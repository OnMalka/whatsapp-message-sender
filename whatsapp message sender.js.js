const puppeteer = require("puppeteer");

async function sendWhatsappMassage(contactName, message) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
    await page.goto("https://web.whatsapp.com/");

    await page.waitForSelector("#pane-side > div:nth-child(1) > div > div > div:nth-child(11) > div > div > div.TbtXF > div._2pkLM > div._3Dr46 > span");
    
    const elem = await page.waitForSelector('#pane-side');
    const boundingBox = await elem.boundingBox();
    await page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + 10
      );

    let done = false;
    while(!done){
      await elem.hover();
      try{
        await page.click(`span[title='${contactName}']`);              
        done = true;
      }catch(e){
        await page.mouse.wheel({ deltaY: 500 });
      }           
    }
    
    await page.waitForSelector("#main > footer > div.vR1LG._3wXwX.copyable-area > div._2A8P4 > div > div.OTBsx");
    console.log('selector found');

    const editor = await page.waitForSelector("#main > footer > div.vR1LG._3wXwX.copyable-area > div._2A8P4 > div > div.OTBsx");
    await editor.focus();
    console.log('editor focused');

    await page.evaluate((message) => {
        console.log("message: "+message);
        document.execCommand("insertText", false, message);
      }, message);
      console.log('evaluated');
    await page.keyboard.press('Enter');
    console.log('Enter pressed');
  } catch (e) {
    console.error("error mine", e);
  }
};

sendWhatsappMassage("Test", "good enough!!!");
