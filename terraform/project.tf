resource "google_project" "smash_hit" {
  name            = "Smash Hit Web"
  project_id      = var.project_id
  billing_account = var.billing_account

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_project_service" "run" {
  project = google_project.smash_hit.project_id
  service = "run.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "artifact_registry" {
  project = google_project.smash_hit.project_id
  service = "artifactregistry.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "iam" {
  project = google_project.smash_hit.project_id
  service = "iam.googleapis.com"

  disable_on_destroy = false
}
