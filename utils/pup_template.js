const pup = require('puppeteer');
const GlConfigs = require('../global_config');

async function pupInit(fn) {
    if (!Array.isArray(GlConfigs.Pup_args)) {
      throw "puppeteer args need to be an Array, exit now!";
    }
    
    // return: a Promise, which resolves to browser instance.
    const browser = await pup.launch({
      // Set of configurable options to set on the browser.
      headless: JSON.parse(GlConfigs.Pup_Headless || 'true'), // linux box needs to be 'true'
      devtools: JSON.parse(GlConfigs.Pup_devtools || 'false'),
      //slowMo: 100,
      args: GlConfigs.Pup_args,// just for CentOS,Running as root without --no-sandbox is not supported...
      //ignoreHTTPSErrors: true,
    });

    //a Promise, The Page is created in a default browser context.
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setRequestInterception(false);
    //await page.setUserAgent('stubperf');
    //await page.setDefaultTimeout(15000);

    try {
      console.log(await fn(page));
    }
    catch(err) {
      console.log("Error Message: " + err.stack);
    }
    finally {
      await browser.close();
    }
}

module.exports = {
  pupInit,
};
