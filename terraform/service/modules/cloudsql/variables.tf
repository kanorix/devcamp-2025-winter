variable "project_id" {
  description = "Google CloudプロジェクトID"
  type        = string
}

# 使用するリージョンを格納する変数
variable "region" {
  description = "使用するリージョン"
  type        = string
}

variable "service_name" {
  description = "アプリの名前"
  type        = string
}
