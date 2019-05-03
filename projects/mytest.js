const {
    getNavTimingAPIMetrics,
    getCustomPerfMetrics,
    getChromeDevPerfMetrics,
    enableCDPPerfClient,
    printAllChromeDevPerfMetrics,
    enablePageIntercepted,
    createPerfMetricsObj,
} = require('../helper.js');
const Configs = require('./configs.js');

async function testPage(page) {
  const Relax_ms = Configs.Thread_sleep;
  let navTimings, customMetrics, chromeDevperfMetrics = {};
  let resource_found, key_indicator, start_time, end_time = 0;
  let navTimingMetrics = ['responseEnd', 'domInteractive', 'domContentLoadedEventEnd'];
  let pageCustomMetrics = ['mark-custom-metrics-A', 'mark-custom-metrics-B'];

  //Creates a Chrome Devtools Protocol session attached to the page(tab)
  const Cdpclient = await enableCDPPerfClient(page);
  // pass page_time by reference
  let page_time = { end_time: 0 };

  // Step1 : Landing page
  await enablePageIntercepted(true, page, page_time, Configs.Step1_load_indicator);
  console.log("###page load started-1: " + (start_time = await page.evaluate(() => performance.now())).toFixed(1));
  await page.goto(Configs.Test_url, { waitUntil: 'networkidle2', timeout: 15000 });
  await page.waitForSelector(Configs.Email_text_selector, { visible: true, timeout: 15000 });
  await page.waitFor(Relax_ms);
  console.log("###page duration-1: " + (page_time.end_time - start_time).toFixed(1));
  await enablePageIntercepted(false, page);

  // collect visual metrics from Chrome Dev tools
  let firstMeaningfulPaint = await getChromeDevPerfMetrics(page, Cdpclient, 'FirstMeaningfulPaint');
  console.log("###FMP:" + firstMeaningfulPaint["FirstMeaningfulPaint"]);
  Cdpclient.detach();

  await page.click(Configs.Email_text_selector);
  await page.waitFor(Relax_ms);
  await page.type(Configs.Email_text_selector, Configs.Email_input_text);
  await page.waitFor(Relax_ms);

  // Step2: Add Payment info page
  await enablePageIntercepted(true, page, page_time, Configs.Step2_load_indicator);
  //await key element visible
  await page.waitForSelector(Configs.Next_btn_selector, { visible: true, timeout: 10000 });
  await page.waitFor(Relax_ms);
  console.log("###page load started-2: " + (start_time = await page.evaluate(() => performance.now())).toFixed(1));
  await page.click(Configs.Next_btn_selector);
  await page.waitForSelector(Configs.CC_card_selector, { timeout: 15000 });
  console.log("###page duration-2: " + (page_time.end_time - start_time).toFixed(1));
  await enablePageIntercepted(false, page);

  // Step3: Order summary review page
  await enablePageIntercepted(true, page, page_time, Configs.Step3_load_indicator);
  await page.waitForSelector(Configs.Next_btn_selector, { visible: true , timeout: 10000 });
  await page.waitFor(Relax_ms);
  console.log("###page load started-3: " + (start_time = await page.evaluate(() => performance.now())).toFixed(1));
  await page.click(Configs.Next_btn_selector);
  await page.waitForSelector(Configs.Customer_info_selector, { timeout: 15000 });
  await page.waitFor(Relax_ms);
  console.log("###page duration-3: " + (page_time.end_time - start_time).toFixed(1));
  await enablePageIntercepted(false, page);

  // Get ready to get the page perf summary
  await page.waitFor(Relax_ms);

  navTimings = await getNavTimingAPIMetrics(
    page, navTimingMetrics);

  customMetrics = await getCustomPerfMetrics(
    page, pageCustomMetrics);

  //combine perf metrics objects
  let testdate = {};
  testdate['datetime'] = new Date().toISOString();
  let perfMetrciCombined = createPerfMetricsObj(testdate, navTimings, customMetrics, firstMeaningfulPaint);
  
  return perfMetrciCombined;

}

module.exports = testPage;
