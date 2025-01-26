variable "project_id" {
  description = "Google CloudプロジェクトID"
  type        = string
}

variable "region" {
  description = "使用するリージョン"
  type        = string
}

variable "github_username" {
  description = "GitHubのユーザー名"
  type        = string
}

variable "github_repository" {
  description = "GitHubのリポジトリ名"
  type        = string
}

variable "service_name" {
  description = "アプリの名前"
  type        = string
}
