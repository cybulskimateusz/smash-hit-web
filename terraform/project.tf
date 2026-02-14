data "google_project" "smash_hit" {
  project_id = var.project_id
}

resource "google_project_service" "run" {
  project = data.google_project.smash_hit.project_id
  service = "run.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "artifact_registry" {
  project = data.google_project.smash_hit.project_id
  service = "artifactregistry.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "iam" {
  project = data.google_project.smash_hit.project_id
  service = "iam.googleapis.com"

  disable_on_destroy = false
}
