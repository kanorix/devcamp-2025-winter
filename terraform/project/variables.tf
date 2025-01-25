variable "project_id" {
  description = "Google CloudプロジェクトID"
  type        = string
  default     = "kanorix-devcamp-2025"
}

variable "github_username" {
  description = "GitHubのユーザー名"
  type        = string
  default     = "kanorix"
}

variable "github_repository" {
  description = "GitHubのリポジトリ名"
  type        = string
  default     = "devcamp-2025-winter"
}

# 使用するリージョンを格納する変数
variable "region" {
  description = "使用するリージョン"
  type        = string
  default     = "asia-northeast1"
}

variable "service_name" {
  description = "アプリの名前"
  type        = string
  default     = "devcamp-2025"
}
