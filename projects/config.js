const Email_user = 'testuser123',
      Test_host = 'www.dummytest.abc';


const Configs = {
    Thread_sleep : 250,
    Test_url : `https://${Test_URL}/`,
    Step1_load_indicator : '/step1/api/url',
    Step2_load_indicator : '/step2/api/url',
    Step3_load_indicator : '/step3/api/url',
    Email_text_selector : '#email',
    Email_input_text : `${Email_user}@mytest.com`,
    Next_btn_selector : '.button--next',
    CC_card_selector : '#credit-card-number',
    Customer_info_selector : '.Box-Container.CustomerInfo'
}

module.exports = Configs;
