"use strict";

const Configs = require('./config.js');
const pup = require('puppeteer');
const device_type = require('puppeteer/DeviceDescriptors');
const device = device_type[Configs.Device];
const Target_URL = Configs.Homepage_Test_url;


let total_req = 0, html_count = 0, css_count = 0, js_count = 0, img_count = 0, xhr_count = 0, font_count = 0, fetch_count = 0, other_count = 0;
let html_size = 0, css_size = 0, js_size = 0, img_size = 0, xhr_size = 0, font_size = 0, fetch_size = 0, other_size = 0;
let allowed_domains = Configs.First_party_hosts;
let perf_metrics = {};


pup.launch(Configs.Pup_options).then(async browser => {
  const page = await browser.newPage();

  await page.emulate(device);
  await page.setViewport(Configs.View_point);

  await page.setRequestInterception(true);
  page.on('request', request => {
    let url = request.url();
    let first_party_req = allowed_domains.some( domain => url.indexOf(domain) > -1);

    if (first_party_req) {
      request.continue();
    }
    else
      request.abort();
  });

  //content_type list: document, stylesheet, image, media, font, script, texttrack, xhr, fetch, eventsource, websocket, manifest, other
  page.on('response', response => {
    let content_type = response.request().resourceType();
    let content_size = parseInt(response.headers()['content-length']);
    switch (content_type) {
      case 'document':
        html_size += content_size;
        html_count++;
        break;
      case 'stylesheet':
        css_size += content_size;
        css_count++;
        break;
      case 'script':
        js_size += content_size;
        js_count++;
        break;
      case 'image':
        img_size += content_size;
        img_count++;
        break;
      case 'xhr':
        xhr_size += content_size;
        xhr_count++;
        break;
      case 'font':
        font_size += content_size;
        font_count++;
        break;
      case 'fetch':
        fetch_size += content_size;
        fetch_count++;
        break;
      default:
        console.log('[WARN]: No content Type Matched...' + content_type);
        other_size += content_size;
        other_count++;
    }
  });

  await page.goto(Target_URL);

  await browser.close();

  perf_metrics.html_size = html_size;
  perf_metrics.css_size = css_size;
  perf_metrics.js_size = js_size;
  perf_metrics.img_size = img_size;
  perf_metrics.xhr_size = xhr_size;
  perf_metrics.font_size = font_size;
  perf_metrics.fetch_size = fetch_size;
  perf_metrics.other_size = other_size;
  perf_metrics.total_size = html_size + css_size + js_size + img_size + xhr_size + font_size + fetch_size + other_size;

  perf_metrics.html_count = html_count;
  perf_metrics.css_count = css_count;
  perf_metrics.js_count = js_count;
  perf_metrics.img_count = img_count;
  perf_metrics.xhr_count = xhr_count;
  perf_metrics.font_count = font_count;
  perf_metrics.fetch_count = fetch_count;
  perf_metrics.other_count = other_count;
  perf_metrics.total_request = html_count + css_count + js_count + img_count + xhr_count + font_count + fetch_count + other_count;

  console.log(JSON.stringify(perf_metrics));
});
