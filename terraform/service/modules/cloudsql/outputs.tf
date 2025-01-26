output "connection_name" {
  value = google_sql_database_instance.instance.connection_name
}

output "socket" {
  value = "/cloudsql/${google_sql_database_instance.instance.connection_name}"
}

output "name" {
  value = google_sql_database.default.name
}

output "user" {
  value = google_sql_user.app.name
}

output "password" {
  value = random_password.app.result
}
