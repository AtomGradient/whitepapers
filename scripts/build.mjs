// Build the static site: Markdown -> HTML (pandoc) -> templated pages under docs/.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const BASE = "https://atomgradient.github.io/whitepapers";
const REPO = "https://github.com/AtomGradient/whitepapers";
const REPO_SHORT = "github.com/AtomGradient/whitepapers";
const ORG_CN = "质子梯度（北京）科技有限公司";
const ORG_EN = "AtomGradient";

// Mark used for the favicon.
const LOGO = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c96442"/><stop offset="1" stop-color="#a84e32"/></linearGradient></defs><circle cx="32" cy="32" r="5.5" fill="url(#g)"/><ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="url(#g)" stroke-width="3"/><ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="url(#g)" stroke-width="3" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="url(#g)" stroke-width="3" transform="rotate(120 32 32)"/>`;
const FAVICON = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${LOGO}</svg>`).replace(/'/g, "%27");

// Interface strings per edition language.
export const UI = {
  "zh-CN": {
    langName: "中文",
    whitepaper: "白皮书",
    skip: "跳到正文",
    navAria: "站点导航",
    contents: "Contents · 目录",
    contentsShort: "目录",
    contentsPrint: "目录",
    tocAria: "章节目录",
    tocPrintAria: "目录（打印版）",
    theme: "切换深浅色",
    pdf: "查看 PDF",
    date: "文稿日期",
    version: "版本",
    language: "语言",
    source: "源文件",
    cite: "如何引用",
    top: "回到顶部",
    readOnline: "在线阅读 →",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hans",
    licenseSentence: (u) => `© 2026 ${ORG_CN} · ${ORG_EN}。本文以 <a href="${u}" target="_blank" rel="noopener">CC BY-NC-ND 4.0</a> 许可发布：可署名转载，不得改编或用于商业目的。`,
    coverOrg: (canonical) => `${ORG_CN} · ${ORG_EN}<br>在线版本与最新更正：${canonical}<br>许可：CC BY-NC-ND 4.0 · 转载请注明出处，不得改编或商用`,
    footerLinks: (canonical) => `在线阅读：<a href="${canonical}">${canonical}</a> · 更新记录：<a href="${REPO}" target="_blank" rel="noopener">${REPO_SHORT}</a> · 官网：<a href="https://atomgradient.com" target="_blank" rel="noopener">atomgradient.com</a>`,
    citation: (title, version, date, canonical) => `质子梯度（AtomGradient）. ${title}（白皮书 ${version}）. ${date}. ${canonical}`,
    bibAuthor: "{质子梯度（AtomGradient）}",
    bibType: (version) => `白皮书 ${version}`,
    pdfHeader: (version) => `NI 下一代 · 白皮书 ${version}`,
  },
  en: {
    langName: "English",
    whitepaper: "Whitepaper",
    skip: "Skip to content",
    navAria: "Site navigation",
    contents: "Contents",
    contentsShort: "Contents",
    contentsPrint: "Contents",
    tocAria: "Table of contents",
    tocPrintAria: "Table of contents (print)",
    theme: "Toggle dark mode",
    pdf: "View PDF",
    date: "Date",
    version: "Version",
    language: "Language",
    source: "Source",
    cite: "How to cite",
    top: "Back to top",
    readOnline: "Read online →",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    licenseSentence: (u) => `© 2026 ${ORG_EN} (${ORG_CN}). Licensed under <a href="${u}" target="_blank" rel="noopener">CC BY-NC-ND 4.0</a>: share with attribution; no derivatives, no commercial use.`,
    coverOrg: (canonical) => `${ORG_EN} · ${ORG_CN}<br>Online edition and corrections: ${canonical}<br>License: CC BY-NC-ND 4.0 · attribution required, no derivatives, no commercial use`,
    footerLinks: (canonical) => `Read online: <a href="${canonical}">${canonical}</a> · Changelog: <a href="${REPO}" target="_blank" rel="noopener">${REPO_SHORT}</a> · Website: <a href="https://atomgradient.com" target="_blank" rel="noopener">atomgradient.com</a>`,
    citation: (title, version, date, canonical) => `AtomGradient. ${title} (Whitepaper ${version}). ${date}. ${canonical}`,
    bibAuthor: "{AtomGradient}",
    bibType: (version) => `Whitepaper ${version}`,
    pdfHeader: (version) => `Next-Generation NI · Whitepaper ${version}`,
  },
};

export const papers = [
  {
    slug: "neural-imprint",
    path: "neural-imprint/",
    lang: "zh-CN",
    src: "sources/whitepaper-v2.zh.md",
    out: "docs/neural-imprint/index.html",
    pdf: "AtomGradient-Neural-Imprint-Whitepaper-v2-zh.pdf",
    version: "v2",
    date: "2026-09-17",
    published: "2026-09-17",
    shortTitle: "NI 下一代：持续学习的愿景、哲学与技术路径",
    label: "Neural Imprint · Whitepaper v2",
    highlights: [
      "NI = 持续学习算法与算法架构，以及围绕它构建的整套技术栈",
      "研究立场：设备就是智能体，智能走向数据",
      "已建立的机制：RPP、Directional Steering、DSR、FrogJump 与三项代表性实测",
    ],
    bibKey: "atomgradient2026ni",
    pair: { href: "en/", label: "English" },
    landing: "../",
  },
  {
    slug: "neural-imprint",
    path: "neural-imprint/en/",
    lang: "en",
    src: "sources/whitepaper-v2.en.md",
    out: "docs/neural-imprint/en/index.html",
    pdf: "AtomGradient-Neural-Imprint-Whitepaper-v2-en.pdf",
    version: "v2",
    date: "2026-09-17",
    published: "2026-09-18",
    shortTitle: "Next-Generation NI: A Vision, Philosophy, and Technical Path for Continual Learning",
    label: "Neural Imprint · Whitepaper v2",
    highlights: [
      "NI = a continual learning algorithm and architecture, plus the technology stack built around it",
      "Research position: the device is the agent; intelligence goes to the data",
      "Established mechanisms: RPP, Directional Steering, DSR, FrogJump, and three representative measurements",
    ],
    bibKey: "atomgradient2026ni_en",
    pair: { href: "../", label: "中文" },
    landing: "../../",
  },
];

function pandoc(markdown) {
  return execFileSync("pandoc", ["-f", "gfm", "-t", "html5", "--wrap=none"], { input: markdown, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "");
}

function headingId(level, text) {
  const t = stripTags(text).trim();
  let m;
  if (level === 2 && (m = t.match(/^(\d+)\.\s/))) return `s${m[1]}`;
  if (level === 3 && (m = t.match(/^(\d+)\.(\d+)\s/))) return `s${m[1]}-${m[2]}`;
  if ((m = t.match(/^(?:附录|Appendix)\s*([A-Za-z])/))) return `appendix-${m[1].toLowerCase()}`;
  return "h-" + t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
}

function buildPaper(p) {
  const ui = UI[p.lang];
  const srcPath = resolve(ROOT, p.src);
  const md = readFileSync(srcPath, "utf8");
  const sha = createHash("sha256").update(md).digest("hex");
  const lines = md.split("\n");

  // Front matter: "# Title", blank, subtitle line, blank, abstract paragraphs, then "## " chapters.
  if (!lines[0].startsWith("# ")) throw new Error(`${p.src}: first line must be the H1 title`);
  const title = lines[0].slice(2).trim();
  const subtitle = lines[2].trim();
  const firstH2 = lines.findIndex((l, i) => i > 2 && l.startsWith("## "));
  if (firstH2 < 0) throw new Error(`${p.src}: no H2 chapters found`);
  const abstractMd = lines.slice(3, firstH2).join("\n").trim();
  const body = lines.slice(firstH2).join("\n");
  const description = stripTags(pandoc(abstractMd.split("\n\n")[0])).trim().replace(/\s+/g, " ");
  const abstractHtml = pandoc(abstractMd).trim();

  let html = pandoc(body);

  // Stable heading ids from the numbering; collect TOC.
  const toc = [];
  html = html.replace(/<h([23]) id="[^"]*">([\s\S]*?)<\/h\1>/g, (_, lvl, inner) => {
    const level = Number(lvl);
    const id = headingId(level, inner);
    toc.push({ level, id, text: stripTags(inner).trim() });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  // Tables: scrollable wrapper; mark wide tables (long first cells).
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, (_, inner) => {
    const firstCells = [...inner.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => stripTags(m[1]));
    const wide = firstCells.some((c) => c.length > 14);
    return `<div class="table-wrap"><table${wide ? ' class="wide"' : ""}>${inner}</table></div>`;
  });

  // Small-type source notes, text diagrams, external links.
  html = html.replace(/<p><sub>([\s\S]*?)<\/sub><\/p>/g, '<p class="source-note"><sub>$1</sub></p>');
  html = html.replace(/<pre class="text"><code>/g, '<pre class="diagram"><code>');
  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');

  const tocHtml = toc
    .map((t) => `<li class="l${t.level}"><a href="#${t.id}">${escapeHtml(t.text)}</a></li>`)
    .join("\n");

  const canonical = `${BASE}/${p.path}`;
  const watermark = Array.from({ length: 10 }, () => `<span>${ORG_CN}<br>${ORG_EN}</span>`).join("");
  const bibtex = `@techreport{${p.bibKey},\n  title  = {${title}},\n  author = {${ui.bibAuthor}},\n  year   = {${p.date.slice(0, 4)}},\n  month  = {${p.date.slice(5, 7)}},\n  type   = {${ui.bibType(p.version)}},\n  url    = {${canonical}}\n}`;
  const langSwitch = p.pair ? ` · <a href="${p.pair.href}">${p.pair.label}</a>` : "";

  const vars = {
    LANG: p.lang,
    TITLE: escapeHtml(title),
    SHORT_TITLE: escapeHtml(p.shortTitle),
    SUBTITLE: escapeHtml(subtitle),
    DESCRIPTION: escapeHtml(description),
    CANONICAL: canonical,
    FAVICON,
    LOGO,
    TOC: tocHtml,
    BODY: html,
    ABSTRACT: abstractHtml,
    PDF: p.pdf,
    REPO,
    REPO_SHORT,
    LANDING: p.landing,
    VERSION: p.version,
    DATE: p.date,
    LABEL: escapeHtml(p.label),
    LANG_NAME: ui.langName,
    LANG_SWITCH: langSwitch,
    LICENSE_URL: ui.licenseUrl,
    WATERMARK: watermark,
    BIBTEX: escapeHtml(bibtex),
    CITATION: escapeHtml(ui.citation(title, p.version, p.date, canonical)),
    UI_SKIP: ui.skip,
    UI_NAV_ARIA: ui.navAria,
    UI_CONTENTS: ui.contents,
    UI_CONTENTS_SHORT: ui.contentsShort,
    UI_CONTENTS_PRINT: ui.contentsPrint,
    UI_TOC_ARIA: ui.tocAria,
    UI_TOC_PRINT_ARIA: ui.tocPrintAria,
    UI_THEME: ui.theme,
    UI_PDF: ui.pdf,
    UI_WHITEPAPER: ui.whitepaper,
    UI_DATE: ui.date,
    UI_VERSION: ui.version,
    UI_LANGUAGE: ui.language,
    UI_SOURCE: ui.source,
    UI_CITE: ui.cite,
    UI_TOP: ui.top,
    UI_COVER_ORG: ui.coverOrg(canonical),
    UI_LICENSE_SENTENCE: ui.licenseSentence(ui.licenseUrl),
    UI_FOOTER_LINKS: ui.footerLinks(canonical),
  };

  let page = readFileSync(resolve(ROOT, "scripts/template.html"), "utf8");
  page = page.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`unfilled placeholder ${k}`);
    return vars[k];
  });
  const outPath = resolve(ROOT, p.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, page);
  return { ...p, ui, title, subtitle, description, sha, canonical, headings: toc.length };
}

function buildLanding(built) {
  const cards = built
    .map(
      (b) => `    <article class="card" data-lang="${b.lang === "en" ? "en" : "zh"}">
      <div class="card-label">${escapeHtml(`${b.label} · ${b.ui.langName} · ${b.date}`)}</div>
      <h3><a href="${b.path}">${escapeHtml(b.title)}</a></h3>
      <p class="sub">${escapeHtml(b.subtitle)}</p>
      <p class="desc">${escapeHtml(b.description)}</p>
      <ul>${b.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>
      <div class="card-links">
        <a href="${b.path}">${escapeHtml(b.ui.readOnline)}</a>
        <a href="${b.path}${b.pdf}" target="_blank" rel="noopener">PDF →</a>
      </div>
    </article>`
    )
    .join("\n");
  const log = [...built]
    .sort((a, b) => (a.published < b.published ? 1 : -1))
    .map((b) => `<li data-lang="${b.lang === "en" ? "en" : "zh"}"><b>${b.published}</b> · ${escapeHtml(b.shortTitle)} — ${b.ui.whitepaper} ${b.version}${b.lang === "en" ? " published" : " 发布"}</li>`)
    .join("\n");
  const vars = { BASE, REPO, REPO_SHORT, LOGO, FAVICON, CARDS: cards, LOG: log };
  let page = readFileSync(resolve(ROOT, "scripts/landing.html"), "utf8");
  page = page.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`unfilled placeholder ${k}`);
    return vars[k];
  });
  writeFileSync(resolve(ROOT, "docs/index.html"), page);
}

const built = papers.map(buildPaper);
buildLanding(built);
for (const b of built) console.log(`built ${b.out}  headings=${b.headings}  sha256=${b.sha.slice(0, 12)}`);
console.log("built docs/index.html");
