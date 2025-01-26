terraform {
  # 必要なプロバイダーの定義
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "kanorix-devcamp-2025-tfstate"
    prefix = "develop"
  }
}

provider "google" {
  # 使用するGoogle CloudプロジェクトのID
  project = var.project_id

  # デフォルトで使用するリージョン
  region = var.region
}

# Google Cloud Run用のサービスアカウント
resource "google_service_account" "cloud_run_service_account" {
  # サービスアカウントのID
  account_id = "cloud-run-service-account"

  # サービスアカウントの表示名
  display_name = "Cloud Run Service Account"
}

data "google_artifact_registry_docker_image" "frontend" {
  location      = var.region
  project       = var.project_id
  repository_id = var.service_name
  image_name    = "frontend:latest"
}

resource "google_cloud_run_domain_mapping" "frontend" {
  name     = "${var.service_name}.rkano.dev"
  location = google_cloud_run_v2_service.frontend.location
  metadata {
    namespace = var.project_id
  }
  spec {
    route_name = google_cloud_run_v2_service.frontend.name
  }
}

# Google Cloud Runサービスのリソース
resource "google_cloud_run_v2_service" "frontend" {
  # サービス名
  name = var.service_name

  # サービスのリージョン
  location = var.region

  ingress = "INGRESS_TRAFFIC_ALL"

  template {

    containers {
      # image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.service_name}/frontend:latest"
      image = data.google_artifact_registry_docker_image.frontend.self_link

      resources {
        limits = {
          memory = "512Mi"
          cpu    = "1"
        }
        startup_cpu_boost = true
      }

      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 1
    }
  }
}

# 未認証の呼び出しを許可
data "google_iam_policy" "no_auth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

# ポリシーをCloud Runに適用
resource "google_cloud_run_service_iam_policy" "no_auth" {
  location = google_cloud_run_v2_service.frontend.location
  project  = google_cloud_run_v2_service.frontend.project
  service  = google_cloud_run_v2_service.frontend.name

  policy_data = data.google_iam_policy.no_auth.policy_data
}
