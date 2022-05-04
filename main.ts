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

await page.evaluate((token) => {
  eval(`setInterval(() => {
    let elem = document.createElement("iframe");
    document.body.appendChild(elem).contentWindow.localStorage.token = '"${token}"';
  }, 50); setTimeout(() => { location.reload() }, 1e2);`);
}, token);

for await( const url of readLines(invite_urls_f) ) {
  console.log('\n\n'+ url +'\n\n')
  await page.evaluate( (url) => {
    console.log(url);
    eval(`"window.open(url, '_blank').focus();`);
    /*eval(`setTimeout(() => {
          document.querySelectorAll('input')[0].click();
          document.querySelectorAll('.content-2I4Lyb')[0].click();
          document.querySelectorAll('button')[1].click();
          document.querySelectorAll('button')[1].click();
        }, 4444);`);*/
  }, url);
}

// Deno.exit()
