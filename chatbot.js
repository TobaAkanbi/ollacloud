/* OLLA CLOUD — Chatbot widget */
(function () {
  var trigger  = document.getElementById('chatTrigger');
  var panel    = document.getElementById('chatPanel');
  var closeBtn = document.getElementById('chatClose');
  var input    = document.getElementById('chatInput');
  var sendBtn  = document.getElementById('chatSend');
  var msgs     = document.getElementById('chatMessages');

  if (!trigger || !panel) return;

  var GREETINGS = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'what\'s up', 'whats up', 'yo'];
  var GREETING_REPLIES = [
    'Hi there! How can I help you today?',
    'Hello! What can I do for you?',
    'Hey! Great to have you here — what can I help with?',
    'Hi! Ask me anything about OllaCloud.',
  ];

  var KB = [
    { q: ['about', 'who are you', 'what is ollacloud', 'what is olla cloud', 'tell me about', 'your company', 'this company', 'what do you do'],
      a: 'OllaCloud is Nigeria\'s leading private cloud infrastructure provider, built and operated by Ollasystems. We run enterprise-grade IaaS, compute, block & object storage, virtual networking, and managed Kubernetes — all hosted in Lagos, Nigeria.' },
    { q: ['pricing', 'cost', 'price', 'how much', 'naira', 'pay'],
      a: 'Our plans start from ₦18,500/month for a 2 vCPU · 4 GB VM. See full details on our <a href="pricing.html">pricing page</a>.' },
    { q: ['office', 'address', 'location', 'where are you', 'find you', 'visit', 'headquarters', 'hq', 'region', 'where', 'data centre', 'datacenter', 'lagos', 'nigeria'],
      a: 'You can find us at <strong>Plot 1B Block 12C Babafemi Osoba Crescent, Lekki Phase 1, Lagos, Nigeria</strong>. Our data centre operates from Lagos, keeping your data fully within Nigerian borders.' },
    { q: ['ndpa', 'compliance', 'pci', 'iso', 'regulation', 'regulatory', 'audit'],
      a: 'OllaCloud is aligned with Nigeria\'s NDPA, ISO 27001, ISO 22301, ISO 27017 and PCI DSS. All data stays in-country.' },
    { q: ['latency', 'speed', 'fast', 'millisecond'],
      a: 'Our infrastructure delivers sub-5ms latency for users across Nigeria - significantly lower than overseas providers.' },
    { q: ['support', 'help', 'engineer', 'contact', 'phone'],
      a: 'You\'ll reach a local engineer in Lagos during WAT business hours. We offer 24/7 monitoring with on-call escalation.' },
    { q: ['kubernetes', 'k8s', 'container', 'docker'],
      a: 'We offer fully managed Kubernetes clusters. The control plane is managed for you — you just deploy workloads.' },
    { q: ['compute', 'virtual machine', 'vcpu', 'instance', 'server'],
      a: 'Our Compute service offers flexible VMs from 2 vCPU / 4 GB RAM up to 64 vCPU / 256 GB RAM, with bare metal available.' },
    { q: ['storage', 's3', 'object', 'block', 'volume', 'bucket'],
      a: 'We offer S3-compatible object storage and high-IOPS block volumes with multi-zone replication for durability.' },
    { q: ['networking', 'vpc', 'load balancer', 'firewall', 'private'],
      a: 'OllaCloud provides isolated VPCs, software load balancers, firewalls, and private interconnects between services.' },
    { q: ['migrate', 'migration', 'move', 'switch', 'transfer'],
      a: 'We\'ll map a migration plan for your current setup and have you live on OllaCloud without downtime. Talk to our team to get started.' },
    { q: ['uptime', 'sla', 'availability', '99.99'],
      a: 'We back all plans with a 99.99% uptime SLA in writing. If we miss it, you receive service credits automatically.' },
    { q: ['trial', 'free', 'demo', 'test', 'try'],
      a: 'We offer free demos and a guided trial environment. <a href="company.html#contact">Book a demo</a> with our team.' },
    { q: ['billing', 'invoice', 'currency', 'fx', 'dollar'],
      a: 'All invoices are in local currency. No foreign exchange exposure or surprise dollar charges.' },
    { q: ['backup', 'disaster recovery', 'failover'],
      a: 'Automated backups and cross-zone failover are available, with near-zero recovery time and point objectives.' },
  ];

  var fallbackHtml = 'I don\'t have that info on hand. Our team can answer directly — click below to send us a DM.'
    + '<br><a href="company.html#contact" class="chat-dm-btn">'
    + '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
    + ' Send us a DM</a>';

  function findAnswer(text) {
    var t = text.toLowerCase().trim();
    for (var i = 0; i < GREETINGS.length; i++) {
      if (t === GREETINGS[i] || t.indexOf(GREETINGS[i]) === 0) {
        return GREETING_REPLIES[Math.floor(Math.random() * GREETING_REPLIES.length)];
      }
    }
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].q.length; j++) {
        if (t.indexOf(KB[i].q[j]) !== -1) return KB[i].a;
      }
    }
    return null;
  }

  function addMsg(text, who, isHtml) {
    var row = document.createElement('div');
    row.className = 'chat-msg ' + who;
    var bub = document.createElement('div');
    bub.className = 'chat-bubble';
    if (isHtml) bub.innerHTML = text; else bub.textContent = text;
    row.appendChild(bub);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var row = document.createElement('div');
    row.className = 'chat-msg bot';
    row.id = 'chatTyping';
    var bub = document.createElement('div');
    bub.className = 'chat-bubble';
    bub.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
    row.appendChild(bub);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById('chatTyping');
    if (t) t.parentNode.removeChild(t);
  }

  function respond(text) {
    showTyping();
    setTimeout(function () {
      hideTyping();
      var ans = findAnswer(text);
      addMsg(ans || fallbackHtml, 'bot', true);
    }, 800);
  }

  function send() {
    var val = input.value.trim();
    if (!val) return;
    addMsg(val, 'user', false);
    input.value = '';
    respond(val);
  }

  var iconOpen  = trigger.querySelector('.chat-icon-open');
  var iconClose = trigger.querySelector('.chat-icon-close');

  function openPanel() {
    panel.classList.add('open');
    if (iconOpen)  iconOpen.style.display  = 'none';
    if (iconClose) iconClose.style.display = 'block';
    setTimeout(function () { if (input) input.focus(); }, 300);
  }

  function closePanel() {
    panel.classList.remove('open');
    if (iconOpen)  iconOpen.style.display  = 'block';
    if (iconClose) iconClose.style.display = 'none';
  }

  trigger.addEventListener('click', function () {
    panel.classList.contains('open') ? closePanel() : openPanel();
  });

  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (sendBtn)  sendBtn.addEventListener('click', send);
  if (input)    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });

  var path = window.location.pathname;
  if (path === '/' || path === '/index.html' || path.endsWith('/index.html') || path === '') {
    setTimeout(openPanel, 800);
  }
})();
