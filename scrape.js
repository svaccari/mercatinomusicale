const puppeteer = require("puppeteer");

async function scrape(url, username, password) {
  console.log("scrape", url, username);
  try {
    const browser = await puppeteer.launch({ headless: false, args: ["--disable-setuid-sandbox"], ignoreHTTPSErrors: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1200 });
    await page.goto(url, { waitUntil: "networkidle0" }); // wait until page load
    await page.click(".link_cookie_continue");
    await page.waitForNetworkIdle();
    await page.type('input[name="txtEmail"]', username);
    await page.click("input[value='Accedi con email']");
    await page.waitForNetworkIdle();
    await page.type('input[name="txtPassword"]', password);
    while (true) {
      try {
        await page.click("input[value='Effettua il login']");
        await page.waitForNetworkIdle();
      } catch (e) {
        break;
      }
    }
    await page.goto("https://www.mercatinomusicale.com/my/annunci.asp", { waitUntil: "networkidle0" });
    const buttons = await page.$$("a.btn_xsmall");
    for (const button of buttons) {
      const text = await button.evaluate((el) => el.textContent);
      if (text === "TiramiSu") {
        await button.click();
      }
    }
    await page.waitForNetworkIdle();
    await browser.close();
  } catch (e) {
    return {
      text: "Error: " + e,
      error: true,
    };
  }
}

module.exports = scrape;
