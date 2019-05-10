# Pinocchio
Synthetic Page perf test by puppeteer lib + ElasticSearch/Kibana
Why Pinocchio? Pinocchio is a "puppeteer" who will always tell your truth (hope so) :)

### How to 
Install the puppeteer lib
```javascript
npm install @elastic/elasticsearch
npm install puppeteer
```
Run the simple test:
```javascript
node ./projectA/init_pageA_test.js
```

PS. How to Run things in CentOS 7.0 :
https://github.com/GoogleChrome/puppeteer/issues/391
Install the Dependencies under Root user:
```javascript
yum install -y pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc
```
