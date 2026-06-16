@description('Static Web App resource name.')
param name string

@description('Azure region for the Static Web App.')
param location string

@allowed([
  'Free'
  'Standard'
])
param sku string = 'Free'

param tags object = {}

resource swa 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: union(tags, { 'azd-service-name': 'web' })
  sku: {
    name: sku
    tier: sku
  }
  properties: {
    buildProperties: {
      appLocation: '/'
      outputLocation: ''
    }
  }
}

output name string = swa.name
output uri string = 'https://${swa.properties.defaultHostname}'
