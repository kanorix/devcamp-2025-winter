# Google Cloud Run用のサービスアカウント
resource "google_service_account" "cloud_run_service_account" {
  # サービスアカウントのID
  account_id = "cloud-run-service-account"

  # サービスアカウントの表示名
  display_name = "Cloud Run Service Account"
}

# secret読み取り権限の付与
resource "google_project_iam_member" "cloud_run_service_account_iam_secret_manager" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.cloud_run_service_account.email}"
}

resource "google_project_iam_member" "cloud_run_service_account_iam_cloudsql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run_service_account.email}"
}

data "google_artifact_registry_docker_image" "application" {
  location      = var.region
  project       = var.project_id
  repository_id = var.service_name
  image_name    = "application:latest"
}

resource "google_cloud_run_domain_mapping" "application" {
  name     = "${var.service_name}.rkano.dev"
  location = google_cloud_run_v2_service.application.location
  metadata {
    namespace = var.project_id
  }
  spec {
    route_name = google_cloud_run_v2_service.application.name
  }
}

module "cloudsql" {
  source       = "./modules/cloudsql"
  project_id   = var.project_id
  region       = var.region
  service_name = var.service_name
}

# Google Cloud Runサービスのリソース
resource "google_cloud_run_v2_service" "application" {
  # サービス名
  name = var.service_name

  # サービスのリージョン
  location = var.region

  ingress = "INGRESS_TRAFFIC_ALL"
  template {
    service_account = google_service_account.cloud_run_service_account.email

    containers {
      image = data.google_artifact_registry_docker_image.application.self_link

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

      env {
        name  = "DATABASE_URL"
        value = "postgresql://${module.cloudsql.user}:${module.cloudsql.password}@localhost:5432/${module.cloudsql.name}?host=${module.cloudsql.socket}"
      }

      env {
        name = "AUTH_SECRET"
        value_source {
          secret_key_ref {
            secret  = "AUTH_SECRET"
            version = "latest"
          }
        }
      }

      env {
        name  = "NEXTAUTH_URL"
        value = "https://${var.service_name}.rkano.dev"
      }
      env {
        name = "AUTH_DISCORD_ID"
        value_source {
          secret_key_ref {
            secret  = "AUTH_DISCORD_ID"
            version = "latest"
          }
        }
      }

      env {
        name = "AUTH_DISCORD_SECRET"
        value_source {
          secret_key_ref {
            secret  = "AUTH_DISCORD_SECRET"
            version = "latest"
          }
        }
      }

      # Cloud SQLのマウント
      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [module.cloudsql.connection_name]
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
  location = google_cloud_run_v2_service.application.location
  project  = google_cloud_run_v2_service.application.project
  service  = google_cloud_run_v2_service.application.name

  policy_data = data.google_iam_policy.no_auth.policy_data
}

data "google_secret_manager_secret_version" "auth_secret" {
  secret = "AUTH_SECRET"
}

data "google_secret_manager_secret_version" "auth_discord_id" {
  secret = "AUTH_DISCORD_ID"
}

data "google_secret_manager_secret_version" "auth_discord_secret" {
  secret = "AUTH_DISCORD_SECRET"
}
