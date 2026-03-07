output "vnet_id" {
  value       = azurerm_virtual_network.vnet.id
}

output "vnet_name" {
  value       = azurerm_virtual_network.vnet.name
}

output "private_subnet_ids" {
  value = [
    azurerm_subnet.private["pvt-subnet-0"].id,
    azurerm_subnet.private["pvt-subnet-1"].id,
    azurerm_subnet.private["pvt-subnet-2"].id,
    azurerm_subnet.private["pvt-subnet-3"].id
  ]
}

output "public_subnet_ids" {
  value = [
    azurerm_subnet.public["pub-subnet-0"].id,
    azurerm_subnet.public["pub-subnet-1"].id
  ]
}

output "nsg_id" {
  value       = azurerm_network_security_group.nsg.id
}
