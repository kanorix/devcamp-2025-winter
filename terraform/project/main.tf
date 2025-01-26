module "apis" {
  source = "./modules/apis"
}

module "gha" {
  source            = "./modules/gha"
  project_id        = var.project_id
  region            = var.region
  service_name      = var.service_name
  github_username   = var.github_username
  github_repository = var.github_repository
}

# cloud runのイメージを保持するArtifact Registry
resource "google_artifact_registry_repository" "default" {
  repository_id          = var.service_name
  description            = "Default Image Repository"
  format                 = "DOCKER"
  cleanup_policy_dry_run = false
  cleanup_policies {
    id     = "delete"
    action = "DELETE"
    condition {
      tag_state  = "ANY"      # default: ANY
      older_than = "2592000s" # 30 days
    }
  }
  cleanup_policies {
    id     = "keep-minimum-versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = 2
    }
  }
  depends_on = [module.apis.apis]
}
