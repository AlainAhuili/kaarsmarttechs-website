data "aws_availability_zones" "available" { state = "available" }

locals {
  azs = slice(data.aws_availability_zones.available.names, 0, 2)
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.7"

  name            = "${var.cluster_name}-vpc"
  cidr            = "10.20.0.0/16"
  azs             = local.azs
  private_subnets = ["10.20.1.0/24", "10.20.2.0/24"]
  public_subnets  = ["10.20.101.0/24", "10.20.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true # cost saving for a small company; use one per AZ for higher availability

  public_subnet_tags  = { "kubernetes.io/role/elb" = 1 }
  private_subnet_tags = { "kubernetes.io/role/internal-elb" = 1 }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.29"

  name                   = var.cluster_name
  kubernetes_version     = "1.36" # standard support until 2027-08-02; 1.31 is in paid extended support
  endpoint_public_access = true
  vpc_id                 = module.vpc.vpc_id
  subnet_ids             = module.vpc.private_subnets

  enable_cluster_creator_admin_permissions = true

  # EBS volumes for stateful workloads (MariaDB and uploads of the WordPress release). The gp3
  # StorageClass itself is applied once from infra/kubernetes/storageclass-gp3.yaml.
  addons = {
    # Module 21 no longer bootstraps the default add-ons: without vpc-cni, nodes stay NotReady.
    vpc-cni                = { before_compute = true }
    kube-proxy             = { before_compute = true }
    coredns                = {}
    eks-pod-identity-agent = { before_compute = true }
    aws-ebs-csi-driver = {
      pod_identity_association = [{
        role_arn        = module.ebs_csi_pod_identity.iam_role_arn
        service_account = "ebs-csi-controller-sa"
      }]
    }
  }

  eks_managed_node_groups = {
    general = {
      instance_types = ["t3.medium"]
      min_size       = 2
      max_size       = 3
      desired_size   = 2
    }
  }

  # Let the GitHub Actions deploy role manage only the two website namespaces.
  access_entries = {
    github_deployer = {
      principal_arn = aws_iam_role.github_deployer.arn
      policy_associations = {
        website = {
          policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSEditPolicy"
          access_scope = {
            type       = "namespace"
            namespaces = ["website-staging", "website-production"]
          }
        }
      }
    }
  }
}

module "ebs_csi_pod_identity" {
  source  = "terraform-aws-modules/eks-pod-identity/aws"
  version = "~> 2.9"

  name                      = "${var.cluster_name}-ebs-csi"
  attach_aws_ebs_csi_policy = true
}

# ---- Keyless CI/CD: GitHub Actions assumes this role through OIDC ---------------
# An AWS account holds one provider per URL and this one is shared with other GitHub workflows,
# so it is looked up, not owned: `terraform destroy` must not remove it. Create it once by hand
# (IAM > Identity providers, audience sts.amazonaws.com) in a fresh account.
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

data "aws_iam_policy_document" "github_trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [data.aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    # Only deployment jobs bound to the staging or production environment may assume the role.
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_repository}:environment:staging",
        "repo:${var.github_repository}:environment:production",
      ]
    }
  }
}

resource "aws_iam_role" "github_deployer" {
  name               = "github-website-deployer"
  assume_role_policy = data.aws_iam_policy_document.github_trust.json
}

data "aws_iam_policy_document" "describe_cluster" {
  statement {
    actions   = ["eks:DescribeCluster"]
    resources = [module.eks.cluster_arn]
  }
}

resource "aws_iam_role_policy" "describe_cluster" {
  role   = aws_iam_role.github_deployer.id
  policy = data.aws_iam_policy_document.describe_cluster.json
}
