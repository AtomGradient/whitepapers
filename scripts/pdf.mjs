// Render the built pages to watermarked PDFs with the locally installed Chrome.
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import { papers, UI, BASE } from "./build.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));
if (!CHROME) throw new Error("Chrome not found; set CHROME_PATH");

const font = `font-family:-apple-system,system-ui,'PingFang SC','Hiragino Sans GB','Noto Sans CJK SC','Microsoft YaHei',sans-serif;`;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--disable-gpu"] });
try {
  for (const p of papers) {
    const ui = UI[p.lang];
    const html = resolve(ROOT, p.out);
    const out = resolve(dirname(html), p.pdf);
    const page = await browser.newPage();
    await page.goto(pathToFileURL(html).href, { waitUntil: "load" });
    // The page is rendered from disk; resolve relative links against the public URL so the
    // PDF never carries file:// paths (in-document anchors stay as they are).
    const canonical = `${BASE}/${p.path}`;
    await page.evaluate((base) => {
      for (const a of document.querySelectorAll("a[href]")) {
        const raw = a.getAttribute("href");
        if (!raw || raw.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(raw)) continue;
        a.setAttribute("href", new URL(raw, base).href);
      }
    }, canonical);
    await page.emulateMediaType("print");
    await page.pdf({
      path: out,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="${font}font-size:7.5pt;color:#777;width:100%;padding:0 18mm;display:flex;justify-content:space-between;white-space:nowrap;"><span>${ui.pdfHeader(p.version)}</span><span>AtomGradient · 质子梯度（北京）科技有限公司</span></div>`,
      footerTemplate: `<div style="${font}font-size:7.5pt;color:#777;width:100%;padding:0 18mm;display:flex;justify-content:space-between;white-space:nowrap;"><span>atomgradient.github.io/whitepapers/${p.path} · CC BY-NC-ND 4.0</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
      outline: true,
      tagged: true,
    });
    await page.close();
    console.log(`pdf ${out}`);
  }
} finally {
  await browser.close();
}
