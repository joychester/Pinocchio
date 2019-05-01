const timingFromNavigationStart = (navTiming, metrics) => {
  let navigationStart = navTiming.navigationStart;

  let navTimingAPIMetrics = {};
  metrics.forEach( name => {
    navTimingAPIMetrics[name] = navTiming[name]- navigationStart;
  });

  return navTimingAPIMetrics;

};

async function getNavTimingAPIMetrics(page, metricNames) {
  let navTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );
  return timingFromNavigationStart(navTiming, metricNames);
}

async function getCustomPerfMetrics(page, markNames) {
  let perfMarks = JSON.parse(
    await page.evaluate(() => JSON.stringify(performance.getEntriesByType('mark')))
  );
  let perfMarkData = {};
  markNames.forEach( mark => {
    let record = perfMarks.find( (item,index) => {
      return item.name === mark;
    });
    if (record != undefined) {
      perfMarkData[mark] = parseFloat(record['startTime'].toFixed(1));
    }
  });
  return perfMarkData;
}

const getTimeFromChromePerfMetrics = (metrics, name) =>
  metrics.metrics.find(x => x.name === name).value * 1000;

const searchForChromeDevPerfMetrics = (metrics, ...dataNames) => {
  const navigationStart = getTimeFromChromePerfMetrics(
    metrics,
    'NavigationStart'
  );

  const extractedData = {};
  dataNames.forEach(name => {
    let duration = getTimeFromChromePerfMetrics(metrics, name) - navigationStart;
    if (duration > 0) {
      extractedData[name] = parseFloat(duration.toFixed(1));
    } else {
      extractedData[name] = 0;
    }
  });

  return extractedData;
};

async function getChromeDevPerfMetrics(page, cdpClient, metricName) {
  let cdpPerfData = 0;
  while (cdpPerfData === 0 ) {
    await page.waitFor(300);
    let chromeDevperfMetrics = await cdpClient.send('Performance.getMetrics');
    cdpPerfData = searchForChromeDevPerfMetrics(
      chromeDevperfMetrics,
      metricName
    );
  }
  return cdpPerfData;
}

async function enableCDPPerfClient(page) {
  let cdpClient = await page.target().createCDPSession();
  await cdpClient.send('Performance.enable');
  return cdpClient;
}

async function printAllChromeDevPerfMetrics(cdpClient) {
  let chromeDevperfMetrics = await cdpClient.send('Performance.getMetrics');
  for(let key in chromeDevperfMetrics) {
    if(chromeDevperfMetrics.hasOwnProperty(key)) {
      let value = chromeDevperfMetrics[key];
      for (i=0; i<value.length; ++i) {
        console.log(value[i]);
      }
    }
  }
}

async function enablePageIntercepted(pageIntercepted, page, page_time, page_load_indicator){

  if(pageIntercepted === true) {
    let key_indicator, interceptedRequest_time, start_time, end_time = 0;

    await page.setRequestInterception(true);

    page.on('request', async interceptedRequest => {

      if (interceptedRequest.url().indexOf(page_load_indicator) > -1){
        //console.log("####URL: " + interceptedRequest.url());
        key_indicator = interceptedRequest.url();
        interceptedRequest_time = await page.evaluate(() => performance.now());
        console.log(`###Request [${page_load_indicator}] Started: ${interceptedRequest_time.toFixed(1)}`);
      }
      interceptedRequest.continue();
    });

    // put async for the callback function due to await statement
    page.on('response', async response => {
      if(response.url() === key_indicator) {
        end_time = await page.evaluate(() => performance.now());
        console.log(`###Request [${page_load_indicator}] Ended: ${end_time.toFixed(1)}`);
        page_time.end_time = end_time;
      }
    });
  } else if (pageIntercepted === false) {
    // Clean-up: unsubscribe all request and response Interception
    page.removeAllListeners('request', () => {});
    page.removeAllListeners('response', () => {});
  } else return;
}

module.exports = {
  getNavTimingAPIMetrics,
  getCustomPerfMetrics,
  getChromeDevPerfMetrics,
  enableCDPPerfClient,
  printAllChromeDevPerfMetrics,
  enablePageIntercepted,
};
