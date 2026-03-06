variable "project_name" {
  type = string
}

variable "location" {
  type = string
}

variable "node_count" {
  type    = number
  default = 2
}

variable "vm_size" {
  type = string
}

variable "vnet_address_space" {
  type    = list(string)
  default = ["10.0.0.0/16"]
}

variable "aks_subnet_address_prefixes" {
  type    = list(string)
  default = ["10.0.1.0/24"]
}

variable "app_subnet_address_prefixes" {
  type    = list(string)
  default = ["10.0.2.0/24"]
}

variable "aks_subnet_name" {
  type = string
}

variable "app_subnet_name" {
  type = string
}

