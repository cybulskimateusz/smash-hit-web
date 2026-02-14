resource "google_artifact_registry_repository" "docker" {
  project       = google_project.smash_hit.project_id
  location      = var.region
  repository_id = "smash-hit-web"
  format        = "DOCKER"
  description   = "Docker images for Smash Hit Web"

  depends_on = [google_project_service.artifact_registry]
}
