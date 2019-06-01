const Test_host = 'www.yourwebsite.com';

const Configs = {
    First_party_hosts : ['www.yourwebsite.com', '.yourwebsitestatic.com'],
    Device : 'iPhone X',
    View_point : { width: 375, height: 635 },

    Pup_options : {
      headless:false,
      devtools: true
    },

    Homepage_Test_url : `https://${Test_host}/`,
    //Homepage_indx_name : 'fp_home',
    //Homepage_indx_type_name : 'fp_home',
}

module.exports = Configs;
