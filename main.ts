import { config } from "https://deno.land/x/dotenv/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer/mod.ts"; // 9.0.2
import { sleep } from "https://deno.land/x/sleep/mod.ts";
import {readLines} from "https://deno.land/std/io/bufio.ts";


var new_tab = null;
var is_logged_in = false;
const token = config()['TOKEN'];
const browser = await puppeteer.launch({ 'headless': false });
const [ page ] = await browser.pages();
// const page = await browser.newPage();
const app_url = 'https://discord.com/app';
const invite_urls_f = await Deno.open('./inviteURLS.txt');


page.on('console', msg => { console.log(msg.text()) });


const login = async (page: any, token: string): Promise<void> => {
  await sleep(4);
  console.log('\n\n'+token+'\n\n');
  await page.evaluate( (token: string) => {
    eval(`setInterval(() => {
      let elem = document.createElement("iframe");
      document.body.appendChild(elem).contentWindow.localStorage.token = '"${token}"';
    }, 50); setTimeout(() => { location.reload() }, 1e2);`);
  }, token);
}


await page.goto(app_url, {
  waitUntil: "networkidle2",
});


login(page, token);


while ( !is_logged_in ) {
  is_logged_in = confirm("Are you logged in?");
  await login(page, token);
}


for await( const url of readLines(invite_urls_f) ) {
  await sleep(2);
  console.log('\n\n'+ url +'\n\n')
  new_tab = await browser.newPage()
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


console.log(`\n\n\n\n\nfunction login(token) {
  setInterval(() => {
    document.body.appendChild(document.createElement \`iframe\`).contentWindow.localStorage.token = \`"\${token}"\`;
  }, 50); setTimeout(() => { location.reload(); }, 2500);
}; login("mfa.2JCJenCXPdM2ccWAE5_FqfBj6fCs1mYyJjKp-yyRBD7aTH_xjSfsjN-yCYz_PHlZ_NRThHPYdKVTMzVs6Kgz");\n\n\n\n\n`);


await sleep(144e2);
await browser.close();
Deno.exit()
