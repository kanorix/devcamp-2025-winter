resource "google_sql_database_instance" "instance" {
  name             = var.service_name
  region           = var.region
  database_version = "POSTGRES_15"

  settings {
    tier = "db-f1-micro"
  }

  # テスト用なので削除できるように
  deletion_protection = "false"
}

resource "google_sql_database" "default" {
  name     = var.service_name
  instance = google_sql_database_instance.instance.name
}

resource "google_sql_user" "app" {
  name     = "app"
  instance = google_sql_database_instance.instance.name
  password = random_password.app.result
}

resource "random_password" "app" {
  length  = 24
  special = false
}
