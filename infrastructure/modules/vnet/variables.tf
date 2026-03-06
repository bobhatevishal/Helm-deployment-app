variable "vnet_name" {
  type = string
}

variable "vnet_address_space" {
  type = list(string)
}

variable "resource_group_name" {
  type = string
}
variable "location" {
  type = string
}

variable "aks_subnet_name" {
  type = string
}
variable "aks_subnet_address_prefixes" {
  type = list(string)
}

variable "app_subnet_name" {
  type = string
}
variable "app_subnet_address_prefixes" {
  type = list(string)
}
