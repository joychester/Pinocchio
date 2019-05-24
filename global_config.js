const GlConfigs = {
  Thread_sleep: 250,
  User_click_delay: 30, // simulate user type action in ms
  User_type_delay: 30, // simulate user click action in ms

  ES_connection_info: 'http://localhost:9200',
  ES_client_max_retry: 3,
  ES_client_requestTimeout: 20000,
  ES_sniffOnStart: 'true',

  // Set of configurable options to set on the browser.
  Pup_options: {
    headless: false, // linux box needs to be 'true'
    devtools: true,
    //"slowMo": 100,
    // More advance args info: https://peter.sh/experiments/chromium-command-line-switches/
    args: ['--no-sandbox', '--disable-setuid-sandbox'],// just for CentOS,Running as root without --no-sandbox is not supported...
    //ignoreHTTPSErrors: true,
  },
  Pup_exit: 'true' // set to false if you do not want to exit after each test

}

module.exports = GlConfigs;
