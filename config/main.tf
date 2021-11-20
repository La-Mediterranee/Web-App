terraform {
	required_providers {
		google = {
			source = "hashicorp/google"
      		version = "3.5.0"
		}
	}
}

provider "google" {
	credentials = file("./service-account.json")

	project = "la-meditaterranee"
	region  = "eu-central1"
	zone    = "eu-central1-c"
}

resource "google_cloud_run_service" "app-server" {
	name = "terraform-network"
}