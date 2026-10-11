terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.28" }
  }
  # Remote state. Create the bucket once by hand (or with a bootstrap stack) before `terraform init`.
  backend "s3" {
    bucket       = "kaarsmarttechs-terraform-state"
    key          = "website/terraform.tfstate"
    region       = "eu-central-1"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = { Project = "kaarsmarttechs-website", ManagedBy = "terraform" }
  }
}
