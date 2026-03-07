# Key Infrastructure Outputs

output "resource_group_name" {
  value       = module.resource_group.name
}

output "aks_cluster_name" {
  value       = module.aks.cluster_name
}

output "aks_cluster_id" {
  value       = module.aks.cluster_id
}

output "acr_login_server" {
  value       = module.acr.login_server
}

output "acr_name" {
  value       = module.acr.acr_name
}

output "kube_config" {
  value       = module.aks.kube_config
  sensitive   = true
}

output "vnet_id" {
  value       = module.vnet.vnet_id
}

output "log_analytics_workspace_id" { 
  value       = module.aks.log_analytics_workspace_id
}
