variable "region" {
  description = "AWS region. Frankfurt keeps data in the EU (GDPR)."
  type        = string
  default     = "eu-central-1"
}

variable "cluster_name" {
  type    = string
  default = "kst-platform"
}

variable "github_oidc_subject_prefix" {
  description = <<-EOT
    Subject prefix of the repository's GitHub OIDC tokens. The repository uses immutable subjects
    (owner@id/name@id), shown by `gh api repos/OWNER/REPO/actions/oidc/customization/sub`.
  EOT
  type        = string
  default     = "repo:AlainAhuili@85407672/kaarsmarttechs-website@1287517030"
}
