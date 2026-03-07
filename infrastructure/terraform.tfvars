# ──────────────────────────────────────────────
# Project Settings
# ──────────────────────────────────────────────
project_name = "helm-deployment-app"
environment  = "prod"
location     = "Canada Central"

# ──────────────────────────────────────────────
# Networking
# ──────────────────────────────────────────────
vnet_address_space = ["10.0.0.0/16"]

public_subnets = {
  "pub-subnet-0" = "10.0.10.0/24"
  "pub-subnet-1" = "10.0.11.0/24"
}

private_subnets = {
  "pvt-subnet-0" = "10.0.0.0/24"
  "pvt-subnet-1" = "10.0.1.0/24"
  "pvt-subnet-2" = "10.0.2.0/24"
  "pvt-subnet-3" = "10.0.3.0/24"
}

# ──────────────────────────────────────────────
# AKS Configuration
# ──────────────────────────────────────────────
node_count         = 1
min_count          = 1
max_count          = 2
vm_size            = "Standard_D2s_v3" # Changed from DS2_v2 due to region restriction
os_disk_size_gb    = 30                # Optimized for cost
kubernetes_version = null    # Uses latest stable version
aks_sku_tier       = "Standard"

# ──────────────────────────────────────────────
# ACR Configuration
# ──────────────────────────────────────────────
acr_sku = "Premium"

# ──────────────────────────────────────────────
# Tags
# ──────────────────────────────────────────────
tags = {
  owner = "vishal"
}
