const puppeteer = require("puppeteer");
const fs = require("fs");
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeForumLink(id) {
  return `https://forum.duolingo.com/comment/${id}`;
}

const ids = [
  36884029, 36884036, 36884046, 36884054, 36884061, 36884072, 36884084,
  36884092, 36884103, 36886930, 36886938, 36886943, 36886951, 36886966,
  36886980, 36886988, 36886996, 36887004, 36887007, 36887397, 36887403,
  36887414, 36887419, 36887427, 36887433, 36887445, 36887456, 36887468,
  36887472, 36887627, 36887642, 36887651, 36887661, 36887669, 36887681,
  36887702, 36887710, 36887721, 36887726, 36887731, 36887742, 36887748,
  36887770, 36887778, 36887783, 36887789, 36887793, 36887824, 36887825,
  36887844, 36887847, 36887857, 36887860, 36887892, 36887893, 36887898,
  36887929, 36887941, 36887951, 36887981, 36887991, 36888000, 36888010,
  36888039, 36888058, 36888067, 36888072, 36888092, 36888112, 36888119,
  36888125, 36888135, 36888172, 36888181, 36888203, 36888217, 36888223,
  36888230, 36888238, 36888271, 36888292, 36888278, 36888305, 36888312,
];

function scrapePost(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        // headless: false,
        args: ["--disable-dev-shm-usage"],
      });
      const page = await browser.newPage();
      await page.goto(makeForumLink(id));
      await timeout(3000);
      const content = await page.evaluate(
        () => document.querySelector("*").outerHTML
      );
      browser.close();
      return resolve(content);
    } catch (e) {
      return reject(e);
    }
  });
}

async function scrapeAllPosts(ids) {
  for (const [i, id] of ids.entries()) {
    await scrapePost(id).then((data) =>
      fs.writeFile(`./comment/${id}.html`, data, () => {
        console.log("Done", id, `${i + 1}/${ids.length}`);
      })
    );
  }
}

scrapeAllPosts(ids);
