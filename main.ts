import { config } from "https://deno.land/x/dotenv/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer/mod.ts"; // 9.0.2
import { sleep } from "https://deno.land/x/sleep/mod.ts";
import {readLines} from "https://deno.land/std/io/bufio.ts";

const token = config()['TOKEN'];
const browser = await puppeteer.launch({ 'headless': false });
const page = await browser.newPage();
const app_url = 'https://discord.com/app';
const invite_urls_f = await Deno.open('./inviteURLS.txt');

page.on('console', msg => { console.log(msg.text()) });

await page.goto(app_url);

page.waitForTimeout(4e3);

await page.evaluate((token) => {
  eval(`setInterval(() => {
    let elem = document.createElement("iframe");
    document.body.appendChild(elem).contentWindow.localStorage.token = '"${token}"';
  }, 50); setTimeout(() => { location.reload() }, 2500);`);
}, token);


console.log('\n\nHERE\n\n')
await sleep(2e3);

var new_tab = null;
console.log('\n\nHERE\n\n')

for await( const url of readLines(invite_urls_f) ) {
  console.log('\n\n'+ url +'\n\n')
  new_tab = await browser.newPage();
  await new_tab.goto(url);
  await new_tab.evaluate( () => {
    eval(`setTimeout(() => {
          document.querySelectorAll('input')[0].click();
          document.querySelectorAll('.content-2I4Lyb')[0].click();
          document.querySelectorAll('button')[1].click();
          document.querySelectorAll('button')[1].click();
        }, 4444);`);
  });
};

// Deno.exit()
