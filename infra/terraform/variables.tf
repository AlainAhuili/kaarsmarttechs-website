variable "region" {
  description = "AWS region. Frankfurt keeps data in the EU (GDPR)."
  type        = string
  default     = "eu-central-1"
}

variable "cluster_name" {
  type    = string
  default = "kst-platform"
}

variable "github_repository" {
  description = "Repository allowed to deploy, as owner/name."
  type        = string
  default     = "kaarsmarttechs/website"
}
