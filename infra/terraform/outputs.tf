output "cluster_name" {
  value = module.eks.cluster_name
}

output "deployer_role_arn" {
  description = "Store as the AWS_DEPLOY_ROLE_ARN secret in GitHub."
  value       = aws_iam_role.github_deployer.arn
}
