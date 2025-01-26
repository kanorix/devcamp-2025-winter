
resource "google_project_service" "apis" {
  for_each = toset([
    "artifactregistry.googleapis.com",
    "run.googleapis.com",
    "iamcredentials.googleapis.com",
    "iam.googleapis.com",
  ])
  service = each.key
}
