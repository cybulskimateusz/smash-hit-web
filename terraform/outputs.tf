output "app_url" {
  description = "URL of the Smash Hit app"
  value       = google_cloud_run_v2_service.app.uri
}

output "server_url" {
  description = "URL of the WebSocket server"
  value       = google_cloud_run_v2_service.server.uri
}

output "artifact_registry" {
  description = "Artifact Registry repository path"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker.repository_id}"
}
