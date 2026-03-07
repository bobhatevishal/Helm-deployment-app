output "cluster_name" {
  description = "Name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.name
}

output "cluster_id" {
  description = "ID of the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.id
}

output "kube_config" {
  description = "Raw kubeconfig for the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive   = true
}

output "aks_identity_object_id" {
  description = "Object ID of the AKS managed identity"
  value       = azurerm_kubernetes_cluster.aks.identity[0].principal_id
}

output "kubelet_identity" {
  description = "Kubelet identity details"
  value       = azurerm_kubernetes_cluster.aks.kubelet_identity[0]
}

output "node_resource_group" {
  description = "Name of the auto-created node resource group"
  value       = azurerm_kubernetes_cluster.aks.node_resource_group
}

output "log_analytics_workspace_id" {
  description = "ID of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.aks.id
}
