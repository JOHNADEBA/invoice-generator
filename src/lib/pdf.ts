// import chromium from "@sparticuz/chromium";
// import puppeteerCore from "puppeteer-core";
// import puppeteer from "puppeteer";

// export async function generatePDF(html: string) {
//   const isProduction = process.env.VERCEL === "1";

//   const browser = isProduction
//     ? await puppeteerCore.launch({
//         args: chromium.args,
//         executablePath: await chromium.executablePath(),
//         headless: true,
//       })
//     : await puppeteer.launch({
//         headless: true,
//       });

//   const page = await browser.newPage();

//   await page.setContent(html, {
//     waitUntil: "networkidle0",
//   });

//   const pdf = await page.pdf({
//     format: "A4",
//     printBackground: true,
//   });

//   await browser.close();

//   return pdf;
// }

import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

export async function generatePDF(html: string) {
  const isProduction = process.env.VERCEL === "1";

  let browser;

  if (isProduction) {
    const executablePath = await chromium.executablePath();

    browser = await puppeteerCore.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      executablePath,
      headless: true,
    });
  } else {
    browser = await puppeteer.launch({
      headless: true,
    });
  }

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "domcontentloaded",
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdf;
}
