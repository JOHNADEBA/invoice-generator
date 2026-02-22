import puppeteer from "puppeteer"; // dev only – local full launch
import puppeteerCore from "puppeteer-core"; // prod only
import chromium from "@sparticuz/chromium-min";

export async function generatePDF(html: string): Promise<Buffer> {
  const isProduction =
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

  let browser;

  if (isProduction) {
    // Production: remote Chromium via -min
    const remotePath = process.env.CHROMIUM_REMOTE_EXEC_PATH;
    if (!remotePath) {
      throw new Error(
        "Missing CHROMIUM_REMOTE_EXEC_PATH env var. " +
          "Example: https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.x64.tar",
      );
    }

    let executablePath: string;
    try {
      executablePath = await chromium.executablePath(remotePath);
    } catch (err) {
      console.error("Failed to get Chromium path:", err);
      throw err;
    }

    browser = await puppeteerCore.launch({
      args: chromium.args,
      executablePath,
      headless: true,
      // ignoreHTTPSErrors removed – not supported in recent versions
    });
  } else {
    // Local dev: full puppeteer (auto-downloads compatible Chromium/Chrome)
    browser = await puppeteer.launch({
      headless: true,
      channel: "chrome", // Reliable on macOS M-series – uses installed Google Chrome
      // args: ["--no-sandbox", "--disable-setuid-sandbox"], // optional fallback
    });
  }

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1240,
      height: 1754,
    });

    await page.setContent(html, {
      waitUntil: "networkidle0", // Better than domcontentloaded for PDFs
    });

    // page.pdf returns Uint8Array in recent puppeteer-core
    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });

    // Convert to Node Buffer for your API/Response (e.g., new Response(pdfBuffer))
    return Buffer.from(pdfUint8);
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw err;
  } finally {
    await browser
      .close()
      .catch((err) => console.warn("Browser close issue:", err));
  }
}
