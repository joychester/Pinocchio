const pup = require('puppeteer');
const myTest = require('./projects/mytest');

(async() => {
    // return: a Promise, which resolves to browser instance.
    const browser = await pup.launch({
      // Set of configurable options to set on the browser.
      headless: false,
      devtools: true,
      //slowMo: 100,
      //args: ['--enable-feature=NetworkService'],
      //args: ['--no-sandbox', '--disable-setuid-sandbox'], // just for CentOS,Running as root without --no-sandbox is not supported...
      //ignoreHTTPSErrors: true,
    });

    //a Promise, The Page is created in a default browser context.
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setRequestInterception(false);
    //await page.setDefaultTimeout(15000);

    try {
      console.log(await myTest(page));
    }
    catch(err) {
      console.log("Error Message: " + err.stack);
    }
    finally {
      await browser.close();
    }
})();
