// Lighthouse 5.0 requires Node v10+
"use strict";

//const fs = require('fs');

const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const request = require('request');
const util = require('util');

(async() => {

const URL = 'https://www.yourwebsite.com/';

const opts = {
  //https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md
  //https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-cli/cli-flags.js
  //chromeFlags: ['--headless'],
  logLevel: 'info',
  output: 'json',
  emulatedFormFactor: 'mobile', // 'desktop' or 'mobile'
  maxWaitForLoad: 30 * 1000,
  onlyCategories: ['performance'], //"performance,accessibility,best-practices,seo,pwa"
  skipAudits: ['uses-http2'],
  blockedUrlPatterns: ['*.domain1.net', '*.domain2.net', '*.domain3.com', '*.domain4.com']
};

// Launch chrome using chrome-launcher.
const chrome = await chromeLauncher.launch(opts);
opts.port = chrome.port;

// Connect to it using puppeteer.connect().
const resp = await util.promisify(request)(`http://localhost:${opts.port}/json/version`);
const {webSocketDebuggerUrl} = JSON.parse(resp.body);
const browser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl});

// Run Lighthouse.
const {lhr}  = await lighthouse(URL, opts, null);

//let data = JSON.stringify(Object.values(lhr.categories));
//fs.writeFileSync('sample.json', data);

console.log(`Lighthouse scores: ${Object.values(lhr.categories).map(c => `${c.title} ${c.score}`).join(', ')}`);



await browser.disconnect();
await chrome.kill();

})();
