# 1. Resource Group Module
module "resource_group" {
  source   = "./modules/resource_group"
  name     = "${var.project_name}-rg"
  location = var.location
}

# Virtual Network, Subnet, and Network Security Group
module "vnet" {
  source                      = "./modules/vnet"
  vnet_name                   = "${var.project_name}-vnet"
  resource_group_name         = module.resource_group.name
  location                    = module.resource_group.location
  vnet_address_space          = var.vnet_address_space
  aks_subnet_name             = var.aks_subnet_name
  aks_subnet_address_prefixes = var.aks_subnet_address_prefixes
  app_subnet_name             = var.app_subnet_name
  app_subnet_address_prefixes = var.app_subnet_address_prefixes
}

# 3. Azure Container Registry Module
module "acr" {
  source              = "./modules/acr"
  name                = "${replace(var.project_name, "-", "")}acr"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
}

# 4. Azure Kubernetes Service Module
module "aks" {
  source              = "./modules/aks"
  cluster_name        = "${var.project_name}-aks"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  node_count          = var.node_count
  vm_size             = var.vm_size
  acr_id              = module.acr.acr_id

}
