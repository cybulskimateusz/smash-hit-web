variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "europe-central2"
}

variable "app_image" {
  description = "Docker image URL for the app service"
  type        = string
}

variable "server_image" {
  description = "Docker image URL for the WebSocket server"
  type        = string
}

variable "billing_account" {
  description = "GCP billing account ID"
  type        = string
}
