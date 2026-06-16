targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the azd environment; used to derive the resource group name.')
param environmentName string

@minLength(1)
@description('Primary location for the Static Web App. Use a region that supports the Free SKU (eastus2, centralus, westus2, westeurope, eastasia).')
param location string

@description('Name for the Static Web App resource.')
param staticWebAppName string = 'hls-usecases-catalog'

@description('SKU for the Static Web App.')
@allowed([
  'Free'
  'Standard'
])
param sku string = 'Free'

var tags = {
  'azd-env-name': environmentName
  workload: 'hls-usecases-catalog'
}

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module web 'web.bicep' = {
  name: 'web'
  scope: rg
  params: {
    name: staticWebAppName
    location: location
    sku: sku
    tags: tags
  }
}

output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = rg.name
output WEB_NAME string = web.outputs.name
output WEB_URI string = web.outputs.uri
