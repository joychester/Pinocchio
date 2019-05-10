const { Client } = require('@elastic/elasticsearch');
const GlConfigs = require('../global_config');

const client = new Client({
  node: GlConfigs.ES_connection_info || 'http://localhost:9200',
  maxRetries: GlConfigs.ES_client_max_retry || 3,
  requestTimeout: GlConfigs.ES_client_requestTimeout || 30000,
  sniffOnStart: JSON.parse(GlConfigs.ES_sniffOnStart || 'true')
})

module.exports = client;
