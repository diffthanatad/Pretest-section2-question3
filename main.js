const puppeteer = require('puppeteer');
const { tableParser } = require('puppeteer-table-parser');
const URL = 'https://codequiz.azurewebsites.net/';

async function scrape() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(URL);
    
    await page.waitForSelector('input[type="button"]');
    await page.click('input[type="button"]');
    
    await page.waitForSelector("table");
    const data = await tableParser(page, {
        selector: 'table',
        allowedColNames: {
          'Fund Name': 'Fund',
          'Nav': 'Nav'
        },
        asArray: true
    });
    
    await browser.close();

    return data;
}

function searchTargetValue(targetFundName, data) {
    for (var i = 0; i < data.length; i++) { 
        const arr = data[i].split(";");

        if (arr[0] === targetFundName) {
            return arr[1];
        }
    }

    return null;
}

async function main() {
    const args = process.argv.slice(2);
    
    const data = await scrape();
    const navValue = searchTargetValue(args[0], data);

    if (!navValue) {
        console.log("No data found.");
    } else {
        console.log(navValue);
    }
}

main();