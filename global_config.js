const GlConfigs = {
  Thread_sleep: 250,
  User_delay: 30,

  ES_connection_info: 'http://localhost:9200',
  ES_client_max_retry: 3,
  ES_client_requestTimeout: 20000,
  ES_sniffOnStart: 'true',

  // Set of configurable options to set on the browser.
  Pup_options: {
    headless: false, // linux box needs to be 'true'
    devtools: true,
    //"slowMo": 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],// just for CentOS,Running as root without --no-sandbox is not supported...
    //ignoreHTTPSErrors: true,
  }

}

module.exports = GlConfigs;
