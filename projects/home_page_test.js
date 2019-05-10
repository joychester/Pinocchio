const {
    getNavTimingAPIMetrics,
    getCustomPerfMetrics,
    getChromeDevPerfMetrics,
    enableCDPPerfClient,
    printAllChromeDevPerfMetrics,
    enablePageIntercepted,
    getCurrentDateObj,
    createPerfMetricsObj,
} = require('../utils/pup_helper.js');
const GlConfigs = require('../global_config.js');
const Configs = require('./config.js');
const { insertDoc } = require('../utils/es_helper.js');

const Relax_ms = GlConfigs.Thread_sleep || 300;
const Test_url = Configs.HomePage_Test_Url;
const Page_load_indicator = Configs.Homepage_load_indicator;
const Page_ind_selector = Configs.Homepage_ind_selector;
const Elastic_indx_name = Configs.Homepage_indx_name;
const Elastic_indx_type_name = Configs.Homepage_indx_type_name;

async function testPage(page) {
  let navTimings = {}, customMetrics = {}, chromeDevperfMetrics = {}, pageDuration = {}, testdate = {};
  let resource_found, key_indicator, start_time, end_time = 0;
  let navTimingMetrics = ['responseEnd', 'domInteractive', 'domContentLoadedEventEnd'];
  let pageCustomMetrics = ['perf-mark-A', 'perf-mark-B', 'perf-mark-C'];

  // pass page_time by reference
  let page_time = { end_time: 0 };

  //Creates a Chrome Devtools Protocol session attached to the page(tab)
  const Cdpclient = await enableCDPPerfClient(page);

  // Step1 : Landing page
  await enablePageIntercepted(true, page, page_time, Page_load_indicator);
  console.log("###page load started-1: " + (start_time = await page.evaluate(() => performance.now())).toFixed(1));
  await page.goto(Test_url, { waitUntil: 'networkidle2', timeout: 15000 });
  await page.waitForSelector(Page_ind_selector, { visible: true, timeout: 15000 });
  await page.waitFor(Relax_ms);
  console.log("###page duration-1: " + (pageDuration['duration'] = parseFloat((page_time.end_time - start_time).toFixed(1))));
  await enablePageIntercepted(false, page);

  // collect visual metrics from Chrome Dev tools
  let firstMeaningfulPaint = await getChromeDevPerfMetrics(page, Cdpclient, 'FirstMeaningfulPaint');
  console.log("###FMP:" + firstMeaningfulPaint["FirstMeaningfulPaint"]);

  Cdpclient.detach();

  // Get ready to get the page perf summary
  await page.waitFor(Relax_ms);

  navTimings = await getNavTimingAPIMetrics(
    page, navTimingMetrics);

  customMetrics = await getCustomPerfMetrics(
    page, pageCustomMetrics);

  testdate = getCurrentDateObj();

  //combine perf metrics objects
  let perfMetrciCombined = createPerfMetricsObj(testdate, navTimings, customMetrics, firstMeaningfulPaint, pageDuration);

  //save to ElasticSearch index
  insertDoc(Elastic_indx_name, perfMetrciCombined, Elastic_indx_type_name);

  return perfMetrciCombined;

}

module.exports = testPage;
