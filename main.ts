import { config } from "https://deno.land/x/dotenv/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer/mod.ts"; // 9.0.2
// import { sleep } from "https://deno.land/x/sleep/mod.ts";
import {readLines} from "https://deno.land/std/io/bufio.ts";

const token = config()['TOKEN'];
const browser = await puppeteer.launch({ 'headless': false });
const page = await browser.newPage();
const app_url = 'https://discord.com/app';

page.on('console', msg => { console.log(msg.text()) });

await page.goto(app_url);

page.waitForTimeout(4e3);

await page.evaluate((token) => {
  eval(`setInterval(() => {
    let elem = document.createElement("iframe");
    document.body.appendChild(elem).contentWindow.localStorage.token = '"${token}"';
  }, 50); setTimeout(() => { location.reload() }, 2500);`);
}, token)


page.waitForTimeout(2e3);
const invite_urls_f=await Deno.open('./inviteURLS.txt');
for await( const url of readLines(invite_urls_f) ) {
  const new_tab = await browser.newPage();
  await new_tab.goto(url);
  console.log('\n\n'+ url +'\n\n')
  await new_tab.evaluate( () => {
    eval(`setTimeout(() => {
          document.querySelectorAll('input')[0].click();
          document.querySelectorAll('.content-2I4Lyb')[0].click();
          document.querySelectorAll('button')[1].click();
          document.querySelectorAll('button')[1].click();
        }, 4444);`);
  });
}

// Deno.exit()
