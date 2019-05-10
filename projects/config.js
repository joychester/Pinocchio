const Test_host = 'www.dummytest.abc';


const Configs = {
    HomePage_Test_Url : `https://${Test_host}/`,
    Homepage_load_indicator : '/path/to/api/v1',
    Homepage_ind_selector : '.entity-card',
    Homepage_indx_name : 'ushome',
    Homepage_indx_type_name : 'home',
    
    SearchPage_Test_Url : `https://${Test_host}/search/suggest?q=anything`,
    SearchPage_load_indicator_step2 : '/path/to/api/v2',
    SearchPage_matched_keyword : '.SearchSuggestionListItem',
    SearchPage_ind_selector_step1 : '.EventItem',
    SearchPage_ind_selector_step2 : '.EventItem',
    SearchPage_indx_name : 'ussearch',
    SearchPage_indx_type_name : 'search',
}

module.exports = Configs;
