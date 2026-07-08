/*
  ============================================================
  OllaCloud — Blog & Engineering Posts
  File: posts-data.js
  ============================================================

  This is the only file you need to edit to publish a new post
  or video on the Resources page. The website reads this file
  automatically and builds the cards for you — no HTML editing
  required on the Resources page itself.

  ────────────────────────────────────────────────────────────
  IMPORTANT RULES
  ────────────────────────────────────────────────────────────
  1. Always add new posts at the TOP of the OLLA_POSTS array
     (inside the [ ] brackets), so the newest content appears
     first on the page.

  2. Each post entry is a JavaScript object: { ... }
     Separate multiple entries with a comma after the closing }

  3. Do not delete the opening  var OLLA_POSTS = [
     or the closing ];  — the website will break without them.

  ============================================================
  HOW TO ADD A BLOG / ARTICLE POST  (step by step)
  ============================================================

  Step 1 — Write the article
    - Duplicate the file: posts/multi-zone-replication.html
    - Rename it to something descriptive, e.g.
        posts/kubernetes-on-ollacloud.html
    - Open the copy and replace all the sample content
      (title, body text, author name, date) with your own.
    - Keep the <head>, nav, and footer exactly as they are —
      they are already wired up correctly.

  Step 2 — Add an entry to this file
    Copy the block below and paste it at the TOP of the
    OLLA_POSTS array (right after the opening [ on line ~60):

    {
      type: 'article',
      tag: 'Engineering',
      title: 'Your post title goes here',
      excerpt: 'One or two sentences that preview the post. This is what visitors read on the card before clicking through.',
      date: 'Jul 2026',
      readTime: '6 min read',
      url: 'posts/kubernetes-on-ollacloud.html'
    },

  Field reference:
    type      → always 'article' for blog posts
    tag       → label shown on the card. Use one of:
                  Engineering | Guide | Announcement | Tutorial | Case Study
    title     → the full post title (keep under ~80 characters)
    excerpt   → short preview shown on the card (1–2 sentences)
    date      → publish month and year, e.g. 'Jul 2026'
    readTime  → estimated read time, e.g. '5 min read'
    url       → path to the HTML file you created in Step 1
                (always starts with  posts/  and ends with  .html)

  ============================================================
  HOW TO ADD A VIDEO POST  (step by step)
  ============================================================

  Step 1 — Upload the video to YouTube
    - Upload the recording to the OllaCloud YouTube channel.
    - Once published, copy the video URL. It will look like:
        https://www.youtube.com/watch?v=ABC123xyz
      The part after  v=  is the YouTube ID (e.g. ABC123xyz).
      You need this ID in Step 2.

  Step 2 — Add an entry to this file
    Copy the block below and paste it at the TOP of the
    OLLA_POSTS array (right after the opening [ on line ~60):

    {
      type: 'video',
      tag: 'Video',
      title: 'Your video title goes here',
      excerpt: 'One or two sentences describing what the viewer will learn or see in the video.',
      date: 'Jul 2026',
      youtubeId: 'ABC123xyz',
      url: 'https://www.youtube.com/watch?v=ABC123xyz'
    },

  Field reference:
    type      → always 'video' for YouTube videos
    tag       → label shown on the card. 'Video' is the default,
                but you can also use 'Demo' or 'Webinar'
    title     → the video title (keep under ~80 characters)
    excerpt   → short description shown on the card (1–2 sentences)
    date      → publish month and year, e.g. 'Jul 2026'
    youtubeId → the ID from the YouTube URL (the part after v=)
                The website uses this to automatically pull the
                video thumbnail from YouTube — no image upload needed.
    url       → the full YouTube link (opens YouTube when clicked)

  ============================================================
  EXAMPLE — what a correctly filled array looks like
  ============================================================

  var OLLA_POSTS = [

    // newest post at the top ↓
    {
      type: 'video',
      tag: 'Demo',
      title: 'Live demo: Kubernetes cluster in 3 minutes',
      excerpt: 'Watch our engineer spin up a managed K8s cluster on OllaCloud from scratch.',
      date: 'Jul 2026',
      youtubeId: 'XyZ789abc',
      url: 'https://www.youtube.com/watch?v=XyZ789abc'
    },
    {
      type: 'article',
      tag: 'Announcement',
      title: 'OllaCloud Abuja region — now in beta',
      excerpt: 'Our second availability zone is open for early access. Here is what is available and how to get started.',
      date: 'Jun 2026',
      readTime: '4 min read',
      url: 'posts/abuja-region-beta.html'
    },

    // older posts below ↓
    ...

  ];

  ============================================================
*/

var OLLA_POSTS = [

  {
    type: 'article',
    tag: 'Article',
    title: 'What Is a Sovereign Cloud and Why Nigerian Enterprises Need One in 2026',
    excerpt: 'Sovereign cloud explained for Nigerian enterprises — what data residency, operational sovereignty, and jurisdictional sovereignty actually mean, and why the NDPA and CBN\'s June 2026 directive make it a compliance requirement.',
    date: 'Jul 2026',
    readTime: '6 min read',
    url: 'posts/what-is-sovereign-cloud-nigeria.html'
  },
  {
    type: 'article',
    tag: 'Compliance',
    title: 'What the CBN Cybersecurity Framework Means for Your Cloud Infrastructure in 2026',
    excerpt: 'The CBN cybersecurity framework imposes direct obligations on how Nigerian banks and fintechs manage cloud infrastructure. What CIOs and Compliance Officers need to know — data residency, third-party risk, and incident response.',
    date: 'Jul 2026',
    readTime: '9 min read',
    url: 'posts/cbn-cybersecurity-framework-cloud-2026.html'
  },
  {
    type: 'article',
    tag: 'Compliance',
    title: 'NDPA 2023 and Cloud Compliance: What Nigerian Banks Must Know',
    excerpt: 'The Nigeria Data Protection Act 2023 changes the ground rules for cloud infrastructure. Here is exactly what it requires, how CBN rules apply, and how to achieve full compliance without sacrificing cloud performance.',
    date: 'Jul 2026',
    readTime: '8 min read',
    url: 'posts/ndpa-cloud-compliance-nigerian-banks.html'
  },
  {
    type: 'article',
    tag: 'Article',
    title: 'Why Nigerian Banks and Fintechs Are Choosing OllaCloud',
    excerpt: 'How OllaCloud\'s private cloud infrastructure helps Nigerian banks, fintechs and regulated enterprises meet NDPA and CBN data residency requirements without sacrificing cloud-native performance.',
    date: 'Jul 2026',
    readTime: '9 min read',
    url: 'posts/nigerian-banks-fintechs-private-cloud.html'
  },

  /* ── ADD NEW POSTS ABOVE THIS LINE ── */

  // SAMPLE VIDEO — replace youtubeId and url with your own YouTube video.
  // ⚠️  Make sure embedding is enabled: YouTube Studio → Content → select video
  //     → Edit → More options → Allow embedding ✓
  {
    type: 'video',
    tag: 'Video',
    title: 'Discover the Power of MySQL',
    excerpt: 'Olla Systems, in partnership with industry experts, from Oracle, put together a first-of-its-kind interactive workshop in Lagos, Nigeria to educate tech experts, enthusiasts, and users on the numerous functions and benefits of Oracle MySQL.',
    date: 'Jun 2026',
    youtubeId: 'SyoDgjb04ds',
    url: 'https://youtu.be/SyoDgjb04ds?si=RobWL434DPbiEVY5'
  },

];

