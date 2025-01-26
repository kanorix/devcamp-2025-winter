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
