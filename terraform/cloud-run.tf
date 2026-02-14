resource "google_cloud_run_v2_service" "server" {
  project  = data.google_project.smash_hit.project_id
  name     = "smash-hit-server"
  location = var.region

  template {
    containers {
      image = var.server_image

      ports {
        container_port = 3002
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }
  }

  depends_on = [google_project_service.run]
}

resource "google_cloud_run_v2_service" "app" {
  project  = data.google_project.smash_hit.project_id
  name     = "smash-hit-app"
  location = var.region

  template {
    containers {
      image = var.app_image

      ports {
        container_port = 3000
      }

      env {
        name  = "WS_URL"
        value = google_cloud_run_v2_service.server.uri
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }
  }

  depends_on = [google_project_service.run]
}

# Public access for app
resource "google_cloud_run_v2_service_iam_member" "app_public" {
  project  = google_cloud_run_v2_service.app.project
  location = google_cloud_run_v2_service.app.location
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Public access for WebSocket server
resource "google_cloud_run_v2_service_iam_member" "server_public" {
  project  = google_cloud_run_v2_service.server.project
  location = google_cloud_run_v2_service.server.location
  name     = google_cloud_run_v2_service.server.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
