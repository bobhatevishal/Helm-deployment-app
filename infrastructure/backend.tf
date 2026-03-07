# ──────────────────────────────────────────────
# Remote State Backend (Azure Storage)
# ──────────────────────────────────────────────
# Uncomment the block below after creating the required storage account.
#
# To create the storage account, run:
#   az group create --name tfstate-rg --location westus2
#   az storage account create --name helmdeployapptfstate \
#       --resource-group tfstate-rg --sku Standard_LRS
#   az storage container create --name tfstate \
#       --account-name helmdeployapptfstate
#
# terraform {
#   backend "azurerm" {
#     resource_group_name  = "tfstate-rg"
#     storage_account_name = "helmdeployapptfstate"
#     container_name       = "tfstate"
#     key                  = "helm-deployment-app.terraform.tfstate"
#   }
# }
