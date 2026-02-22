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

  const browser = isProduction
    ? await puppeteerCore.launch({
        args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: await chromium.executablePath(),
        headless: true,
      })
    : await puppeteer.launch({
        headless: true,
      });

  const page = await browser.newPage();

  // Manually set viewport (since defaultViewport was removed)
  await page.setViewport({
    width: 1240,
    height: 1754,
    deviceScaleFactor: 1,
  });

  await page.setContent(html, {
    waitUntil: "domcontentloaded",
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();

  return pdf;
}
