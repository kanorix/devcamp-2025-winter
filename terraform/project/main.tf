terraform {
  # 必要なプロバイダーの定義
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }

    github = {
      source  = "integrations/github"
      version = "~> 5.0"  # 使用したいバージョンを指定
    }
  }

  backend "gcs" {
    bucket = "kanorix-devcamp-2025-tfstate"
    prefix = "project"
  }
}

provider "google" {
  # 使用するGoogle CloudプロジェクトのID
  project = var.project_id

  # デフォルトで使用するリージョン
  region  = var.region
}

resource "google_project_service" "iam" {
  project = var.project_id
  service = "iam.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "iam_credentials" {
  project = var.project_id
  service = "iamcredentials.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifact_registry" {
  project = var.project_id
  service = "artifactregistry.googleapis.com"
}

resource "google_project_service" "cloud_run" {
  project = var.project_id
  service = "run.googleapis.com"
}

# cloud runのイメージを保持するArtifact Registry
resource "google_artifact_registry_repository" "default" {
  location      = var.region
  repository_id = "${var.service_name}"
  description   = "Default Image Repository"
  format        = "DOCKER"
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
  depends_on = [google_project_service.artifact_registry]
}
