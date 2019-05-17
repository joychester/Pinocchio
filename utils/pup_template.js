const pup = require('puppeteer');
const GlConfigs = require('../global_config');
const Pup_exit = GlConfigs.Pup_exit || 'true';

async function pupInit(fn) {

    // return: a Promise, which resolves to browser instance.
    const browser = await pup.launch(GlConfigs.Pup_options);

    //a Promise, The Page is created in a default browser context.
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setRequestInterception(false);
    //await page.setUserAgent('stubperf');
    //await page.setDefaultTimeout(15000);

    try {
      //console.log(await myTest(page));
      console.log(await fn(page));
    }
    catch(err) {
      console.log("Error Message: " + err.stack);
    }
    finally {
      if (JSON.parse(Pup_exit)) {
        await browser.close();
      }
    }
}

module.exports = {
  pupInit,
};
