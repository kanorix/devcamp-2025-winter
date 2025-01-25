
resource "google_project_service" "cloud_resource_manager" {
  project = var.project_id
  service = "cloudresourcemanager.googleapis.com"
}

resource "google_iam_workload_identity_pool" "github_actions" {
  workload_identity_pool_id = "github-actions2"
  project                   = var.project_id
}

resource "google_iam_workload_identity_pool_provider" "github_actions" {
  workload_identity_pool_provider_id = "github-actions"

  workload_identity_pool_id = google_iam_workload_identity_pool.github_actions.workload_identity_pool_id
  project                   = var.project_id

  attribute_condition = format("assertion.repository == \"%s/%s\"", var.github_username, var.github_repository)
  attribute_mapping = {
    "google.subject" = "assertion.repository"
  }
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account" "github_actions" {
  account_id = "github-actions"
  project    = var.project_id
}

resource "google_service_account_iam_member" "github_actions" {
  service_account_id = google_service_account.github_actions.name

  role   = "roles/iam.workloadIdentityUser"
  member = format("principal://iam.googleapis.com/%s/subject/%s", google_iam_workload_identity_pool.github_actions.name, data.github_repository.default.full_name)
}

resource "google_project_iam_member" "github_actions" {
  project = var.project_id

  role   = "roles/editor"
  member = google_service_account.github_actions.member
}

locals {
  envs = [
    {
      name  = "GOOGLE_CLOUD_PROJECT_ID"
      value = var.project_id
    },
    {
      name  = "GOOGLE_CLOUD_SERVICE_NAME"
      value = var.service_name
    },
    {
      name  = "GOOGLE_CLOUD_REGION"
      value = var.region
    },
    {
      name  = "GOOGLE_CLOUD_WORKLOAD_IDENTITY_PROVIDER_ID"
      value = google_iam_workload_identity_pool_provider.github_actions.name
    },
    {
      name  = "GOOGLE_CLOUD_SERVICE_ACCOUNT_EMAIL"
      value = google_service_account.github_actions.email
    }
  ]
}

resource "github_actions_variable" "envs" {
  for_each = { for v in local.envs : v.name => v }

  variable_name = each.value.name

  value      = each.value.value
  repository = data.github_repository.default.name
}

data "github_repository" "default" {
  full_name = format("%s/%s", var.github_username, var.github_repository)
}
