# Terraform Configuration for Order Platform Infrastructure

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "order-platform/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "kubernetes" {
  config_path = var.kubeconfig_path
}

provider "helm" {
  kubernetes {
    config_path = var.kubeconfig_path
  }
}

# Create namespace
resource "kubernetes_namespace" "order_platform" {
  metadata {
    name = var.namespace
  }
}

# PostgreSQL using Helm
resource "helm_release" "postgresql" {
  name       = "postgresql"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "postgresql"
  namespace  = kubernetes_namespace.order_platform.metadata[0].name

  set {
    name  = "auth.username"
    value = var.postgres_user
  }

  set {
    name  = "auth.password"
    value = var.postgres_password
  }

  set {
    name  = "auth.database"
    value = "orderplatform"
  }

  set {
    name  = "primary.persistence.size"
    value = "10Gi"
  }
}

# RabbitMQ using Helm
resource "helm_release" "rabbitmq" {
  name       = "rabbitmq"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "rabbitmq"
  namespace  = kubernetes_namespace.order_platform.metadata[0].name

  set {
    name  = "auth.username"
    value = var.rabbitmq_user
  }

  set {
    name  = "auth.password"
    value = var.rabbitmq_password
  }

  set {
    name  = "replicaCount"
    value = "1"
  }
}

# Kubernetes Secrets
resource "kubernetes_secret" "platform_secrets" {
  metadata {
    name      = "platform-secrets"
    namespace = kubernetes_namespace.order_platform.metadata[0].name
  }

  data = {
    POSTGRES_PASSWORD  = base64encode(var.postgres_password)
    RABBITMQ_PASSWORD  = base64encode(var.rabbitmq_password)
    JWT_SECRET         = base64encode(var.jwt_secret)
  }
}

# ConfigMap
resource "kubernetes_config_map" "platform_config" {
  metadata {
    name      = "platform-config"
    namespace = kubernetes_namespace.order_platform.metadata[0].name
  }

  data = {
    POSTGRES_HOST = "postgresql.${var.namespace}.svc.cluster.local"
    POSTGRES_PORT = "5432"
    POSTGRES_USER = var.postgres_user
    RABBITMQ_HOST = "rabbitmq.${var.namespace}.svc.cluster.local"
    RABBITMQ_PORT = "5672"
    RABBITMQ_USER = var.rabbitmq_user
  }
}

# Outputs
output "namespace" {
  value = kubernetes_namespace.order_platform.metadata[0].name
}

output "postgresql_endpoint" {
  value = "postgresql.${var.namespace}.svc.cluster.local:5432"
}

output "rabbitmq_endpoint" {
  value = "rabbitmq.${var.namespace}.svc.cluster.local:5672"
}
