#!/usr/bin/env node
/**
 * generate-blog.js
 * Fetches published posts from Hygraph and:
 *   1. Writes posts/[slug].html for each post
 *   2. Rewrites posts-data.js so the blog grid in resources.html stays in sync
 *
 * Usage:
 *   HYGRAPH_URL=https://... node generate-blog.js
 *
 * If HYGRAPH_URL is not set the script exits cleanly (existing files untouched).
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT   = __dirname;
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Load .env file if present
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  });
}

const HYGRAPH_URL = process.env.HYGRAPH_URL;
if (!HYGRAPH_URL) {
  console.error('✗ HYGRAPH_URL not set — add it to .env or set it as an environment variable');
  process.exit(1);
}

/* ─── helpers ─────────────────────────────────────────────── */

function fmtDate(iso) {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

async function fetchPosts() {
  const res = await fetch(HYGRAPH_URL, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ query: `{
      posts(orderBy: postDate_DESC) {
        title slug excerpt tag readTime postDate metaDescription
        content { html }
      }
    }` })
  });
  if (!res.ok) throw new Error(`Hygraph responded ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data.posts;
}

/* ─── shared nav / footer HTML (matches existing post pages) ─ */

function navHTML() {
  return `<header class="site-header">
  <div class="wrap nav">
    <a href="../index.html" class="brand" aria-label="OllaCloud home">
      <img src="../images/Logo-main.png" alt="OllaCloud" class="logo-img-hf">
      <span class="brand-text">OllaCloud<span class="sub">Ollasystems</span></span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <div class="nav-item">
        <a href="../product.html" class="nav-link">Product <svg viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></a>
        <div class="dropdown">
          <a href="../product.html#compute" class="dd-link"><span class="dd-col"><span class="dd-t">Compute</span><span class="dd-d">Elastic virtual machines &amp; bare metal</span></span></a>
          <a href="../product.html#storage" class="dd-link"><span class="dd-col"><span class="dd-t">Storage</span><span class="dd-d">Object &amp; block storage, S3-compatible</span></span></a>
          <a href="../product.html#networking" class="dd-link"><span class="dd-col"><span class="dd-t">Networking</span><span class="dd-d">VPCs, load balancing, private links</span></span></a>
          <a href="../product.html#kubernetes" class="dd-link"><span class="dd-col"><span class="dd-t">Managed Kubernetes</span><span class="dd-d">Production-ready container clusters</span></span></a>
        </div>
      </div>
      <div class="nav-item">
        <a href="#" class="nav-link">Solutions <svg viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></a>
        <div class="dropdown dd-two-col">
          <a href="../solutions.html#cloud-solutions" class="dd-link"><span class="dd-col"><span class="dd-t">Cloud Solutions</span><span class="dd-d">IaaS, PaaS &amp; cloud infrastructure</span></span></a>
          <a href="../solutions.html#service-implementation" class="dd-link"><span class="dd-col"><span class="dd-t">Service Implementation</span><span class="dd-d">Unlock efficiency and innovation</span></span></a>
          <a href="../solutions.html#managed-services" class="dd-link"><span class="dd-col"><span class="dd-t">Managed Services</span><span class="dd-d">Managing and sustaining IT operations</span></span></a>
          <a href="../solutions.html#it-training" class="dd-link"><span class="dd-col"><span class="dd-t">IT Training</span><span class="dd-d">Expert training for technology solutions</span></span></a>
          <a href="../solutions.html#security" class="dd-link"><span class="dd-col"><span class="dd-t">Security</span><span class="dd-d">Empower your business with cyber resilience</span></span></a>
        </div>
      </div>
      <div class="nav-item">
        <a href="../resources.html" class="nav-link active">Resources <svg viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></a>
        <div class="dropdown dd-two-col">
          <a href="../resources/private-cloud-nigeria.html" class="dd-link"><span class="dd-col"><span class="dd-t">Private Cloud Nigeria</span><span class="dd-d">OCI-compatible private cloud appliance</span></span></a>
          <a href="../resources/hybrid-cloud-nigeria.html" class="dd-link"><span class="dd-col"><span class="dd-t">Hybrid Cloud Nigeria</span><span class="dd-d">Private cloud + OCI public cloud</span></span></a>
          <a href="../resources/cloud-for-banks-nigeria.html" class="dd-link"><span class="dd-col"><span class="dd-t">Cloud for Banks</span><span class="dd-d">CBN-compliant banking infrastructure</span></span></a>
          <a href="../resources/cloud-for-fintech-nigeria.html" class="dd-link"><span class="dd-col"><span class="dd-t">Cloud for Fintech</span><span class="dd-d">NDPA + PCI DSS compliant fintech infra</span></span></a>
          <a href="../resources/cloud-migration-nigeria.html" class="dd-link"><span class="dd-col"><span class="dd-t">Cloud Migration</span><span class="dd-d">4-stage migration methodology</span></span></a>
          <a href="../resources.html#blog" class="dd-link"><span class="dd-col"><span class="dd-t">Blog</span><span class="dd-d">Engineering posts &amp; product updates</span></span></a>
          <a href="../resources.html#faqs" class="dd-link"><span class="dd-col"><span class="dd-t">FAQs</span><span class="dd-d">Answers to common questions</span></span></a>
        </div>
      </div>
      <div class="nav-item"><a href="../company.html" class="nav-link">About Us</a></div>
    </nav>
    <div class="nav-cta">
      <a href="../booking.html" class="btn btn-teams">
        <svg viewBox="0 0 24 24" width="15" height="15" style="flex-shrink:0"><path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM3 10h18M9 10v10M9 4v6" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>
        Schedule a meeting</a>
      <a href="../company.html#contact" class="btn btn-dark">Talk to sales</a>
    </div>
    <button class="burger" aria-label="Menu"><span></span></button>
  </div>
</header>
<div class="mobile-menu">
  <a href="../product.html">Product</a>
  <a href="../solutions.html">Solutions</a>
  <a href="../resources.html">Resources</a>
  <a href="../company.html">About Us</a>
  <div class="m-cta"><a href="../company.html#contact" class="btn btn-primary btn-lg">Talk to sales</a></div>
</div>`;
}

function footerHTML() {
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="../index.html" class="brand">
          <img src="../images/logo-light.png" alt="OllaCloud" class="logo-img-hf">
          <span class="brand-text" style="color:#fff">OllaCloud<span class="sub">Ollasystems</span></span>
        </a>
        <p>Sovereign cloud infrastructure for African business. Built, hosted and supported in Nigeria.</p>
        <div class="footer-contact"><a href="tel:+2347049214944">+234 704 921 4944</a><a href="mailto:sales@ollasystems.com">sales@ollasystems.com</a></div>
      </div>
      <div class="footer-col"><h4>Product</h4><ul><li><a href="../product.html#compute">Compute</a></li><li><a href="../product.html#storage">Storage</a></li><li><a href="../product.html#networking">Networking</a></li><li><a href="../product.html#kubernetes">Kubernetes</a></li></ul></div>
      <div class="footer-col"><h4>Solutions</h4><ul><li><a href="../solutions.html#cloud-solutions">Cloud Solutions</a></li><li><a href="../solutions.html#managed-services">Managed Services</a></li><li><a href="../solutions.html#it-training">IT Training</a></li><li><a href="../solutions.html#security">Security</a></li></ul></div>
      <div class="footer-col"><h4>Resources</h4><ul><li><a href="../resources.html#blog">Blog</a></li><li><a href="../resources.html#faqs">FAQs</a></li></ul></div>
      <div class="footer-col"><h4>About Us</h4><ul><li><a href="../company.html">About us</a></li><li><a href="../company.html#contact">Contact</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 Ollasystems Ltd. All rights reserved.</span>
      <div class="legal"><a href="../privacy.html">Privacy Policy</a></div>
    </div>
  </div>
</footer>
<script src="../main.js"></script>
<script src="../cookie.js"></script>`;
}

/* ─── post page HTML template ─────────────────────────────── */

function renderPostPage(post, date) {
  const desc = post.metaDescription || post.excerpt;
  const kw   = post.metaKeywords   || '';
  const tag  = post.tag            || 'Article';
  const rt   = post.readTime       || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(post.title)} — OllaCloud</title>
<meta name="description" content="${esc(desc)}">
${kw ? `<meta name="keywords" content="${esc(kw)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
<style>
  .post-wrap{max-width:740px;margin:0 auto;padding:72px 24px 120px}
  .post-back{display:inline-flex;align-items:center;gap:6px;font-size:14px;color:var(--muted);text-decoration:none;margin-bottom:40px;transition:color .15s;font-family:var(--mono-font)}
  .post-back:hover{color:var(--ink-text)}
  .post-tag{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mint);font-family:var(--mono-font);margin-bottom:16px}
  .post-wrap h1{font-size:clamp(26px,4vw,42px);font-weight:700;letter-spacing:-.03em;line-height:1.15;margin:0 0 20px;color:var(--ink-text)}
  .post-meta{display:flex;align-items:center;gap:16px;font-size:13px;color:var(--muted);font-family:var(--mono-font);margin-bottom:48px;padding-bottom:32px;border-bottom:1px solid var(--line)}
  .post-meta .author{display:flex;align-items:center;gap:8px}
  .post-av{width:28px;height:28px;border-radius:50%;background:var(--ink-900);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
  .post-wrap h2{font-size:22px;font-weight:700;letter-spacing:-.02em;margin:48px 0 12px;color:var(--ink-text)}
  .post-wrap h3{font-size:18px;font-weight:700;letter-spacing:-.01em;margin:32px 0 10px;color:var(--ink-text)}
  .post-wrap p{font-size:16px;line-height:1.8;color:var(--muted);margin-bottom:20px}
  .post-wrap ul{margin:0 0 20px 20px;padding:0}
  .post-wrap ul li{font-size:16px;line-height:1.8;color:var(--muted);margin-bottom:8px}
  .post-wrap strong{color:var(--ink-text);font-weight:600}
  .post-divider{border:none;border-top:1px solid var(--line);margin:48px 0}
  .post-callout{background:var(--paper);border-left:3px solid var(--mint);border-radius:0 8px 8px 0;padding:20px 24px;margin:32px 0}
  .post-callout p{margin:0;font-size:15px}
  .post-footer{margin-top:64px;padding-top:32px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
  .post-footer a{font-size:14px;color:var(--mint);text-decoration:none;font-family:var(--mono-font)}
  .post-footer a:hover{text-decoration:underline}
  .post-cta-block{background:var(--ink-900);border-radius:12px;padding:32px;margin:48px 0;text-align:center}
  .post-cta-block h3{color:#fff;font-size:20px;margin:0 0 10px}
  .post-cta-block p{color:rgba(255,255,255,.65);font-size:14px;margin:0 0 20px}
</style>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":${JSON.stringify(post.title)},"description":${JSON.stringify(desc)},"author":{"@type":"Organization","name":"OllaCloud"},"publisher":{"@type":"Organization","name":"Ollasystems","url":"https://ollasystems.com"},"datePublished":${JSON.stringify(post.postDate)}}
</script>
</head>
<body>
${navHTML()}

<div class="post-wrap">
  <a href="../resources.html" class="post-back"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6" fill="none"/></svg> Back to resources</a>
  <span class="post-tag">${esc(tag)}</span>
  <h1>${esc(post.title)}</h1>
  <div class="post-meta">
    <div class="author"><div class="post-av">O</div><span>OllaCloud</span></div>
    <span>·</span><span>${esc(date)}</span>${rt ? `<span>·</span><span>${esc(rt)}</span>` : ''}
  </div>

  ${post.content.html}

  <div class="post-cta-block">
    <h3>Ready to move your workloads to Nigeria?</h3>
    <p>Talk to our solutions team about compute, storage, Kubernetes and managed services — all billed in Naira.</p>
    <a href="../company.html#contact" class="btn btn-primary">Get in touch →</a>
  </div>

  <div class="post-footer">
    <a href="../resources.html">← All articles</a>
    <a href="../company.html#contact">Talk to us →</a>
  </div>
</div>

${footerHTML()}
</body>
</html>`;
}

/* ─── escape HTML attribute values ────────────────────────── */
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ─── main ─────────────────────────────────────────────────── */
async function main() {
  const posts = await fetchPosts();
  console.log(`✓ Fetched ${posts.length} post(s) from Hygraph`);

  fs.mkdirSync(path.join(ROOT, 'posts'), { recursive: true });

  // Generate individual HTML pages for each article
  for (const post of posts) {
    const date = fmtDate(post.postDate);
    const html = renderPostPage(post, date);
    const file = path.join(ROOT, 'posts', `${post.slug}.html`);
    fs.writeFileSync(file, html, 'utf8');
    console.log(`  → posts/${post.slug}.html`);
  }

  // Load manually maintained video entries
  const videosFile = path.join(ROOT, 'videos.json');
  const videos = fs.existsSync(videosFile)
    ? JSON.parse(fs.readFileSync(videosFile, 'utf8'))
    : [];
  console.log(`✓ Loaded ${videos.length} video(s) from videos.json`);

  // Build article entries from Hygraph
  const articleEntries = posts.map(p => {
    const date = fmtDate(p.postDate);
    return `  {
    type: 'article',
    tag: ${JSON.stringify(p.tag || 'Article')},
    title: ${JSON.stringify(p.title)},
    excerpt: ${JSON.stringify(p.excerpt || '')},
    date: ${JSON.stringify(date)},
    readTime: ${JSON.stringify(p.readTime || '')},
    url: ${JSON.stringify(`posts/${p.slug}.html`)}
  }`;
  });

  // Build video entries from videos.json
  const videoEntries = videos.map(v => `  ${JSON.stringify(v).replace(/^{/, '{\n   ').replace(/}$/, '\n  }')}`);

  // Merge: articles first (newest from Hygraph), then videos
  const allEntries = [...articleEntries, ...videoEntries].join(',\n');

  fs.writeFileSync(
    path.join(ROOT, 'posts-data.js'),
    `var OLLA_POSTS = [\n${allEntries}\n];\n`,
    'utf8'
  );
  console.log('✓ posts-data.js updated (articles + videos merged)');
}

main().catch(err => {
  console.error('✗ Blog generation failed:', err.message);
  process.exit(1);
});
