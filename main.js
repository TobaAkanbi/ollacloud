/* OLLA CLOUD — interactions */
(function(){
  'use strict';

  // sticky header shadow
  var header = document.querySelector('.site-header');
  function onScroll(){
    if(header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // mobile menu
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.mobile-menu');
  if(burger && menu){
    burger.addEventListener('click', function(){
      var open = burger.classList.toggle('open');
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        burger.classList.remove('open'); menu.classList.remove('open');
        document.body.style.overflow='';
      });
    });
  }

  // scroll reveal
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  // service card pointer glow
  document.querySelectorAll('.svc-card').forEach(function(card){
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left)+'px');
      card.style.setProperty('--my', (e.clientY - r.top)+'px');
    });
  });

  // count-up
  function countUp(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = (target % 1 !== 0) ? (el.getAttribute('data-dec')||2)*1 : 0;
    var dur = 1400, start = performance.now();
    function tick(now){
      var p = Math.min((now-start)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = (target*eased).toFixed(dec);
      if(p<1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(dec);
    }
    requestAnimationFrame(tick);
  }
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); }
    });
  }, {threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  // pricing toggle
  var toggle = document.querySelector('.bill-toggle');
  if(toggle){
    toggle.addEventListener('click', function(e){
      var btn = e.target.closest('button'); if(!btn) return;
      toggle.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var annual = btn.getAttribute('data-bill') === 'annual';
      document.querySelectorAll('[data-monthly]').forEach(function(el){
        var m = el.getAttribute('data-monthly'), a = el.getAttribute('data-annual');
        el.textContent = annual ? a : m;
      });
      document.querySelectorAll('.price-amt .per').forEach(function(el){
        el.textContent = annual ? '/mo · billed yearly' : '/month';
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function(){
      var open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    });
  });
  // logos view-all toggle (defined on window so inline onclick works)
  window.toggleLogos = function(){
    var row = document.querySelector('.logos-row');
    var btn = document.getElementById('logosToggle');
    if(!row || !btn) return;
    var expanded = row.classList.toggle('expanded');
    btn.classList.toggle('open', expanded);
    btn.childNodes[0].textContent = expanded ? 'Show less ' : 'View all clients ';
  };

  // ---- Console demo animation ----
  (function(){
    var screens = ['cs-login','cs-dash','cs-vm'];
    var durations = [4500, 5000, 7000]; // ms per screen
    var current = 0;
    var timer;

    function showScreen(idx){
      screens.forEach(function(id,i){
        var el = document.getElementById(id);
        if(!el) return;
        el.style.display = (i === idx) ? 'block' : 'none';
      });
    }

    function runLogin(){
      showScreen(0);
      var btn = document.querySelector('.cs-btn');
      var sign = document.getElementById('cs-signing');
      if(!btn || !sign) return;
      btn.style.display = 'block';
      sign.style.display = 'none';
      setTimeout(function(){
        if(current !== 0) return;
        btn.style.display = 'none';
        sign.style.display = 'flex';
      }, 2400);
    }

    function runDash(){
      showScreen(1);
    }

    function runVM(){
      showScreen(2);
      var launchBtn = document.getElementById('cs-launch-btn');
      var launching = document.getElementById('cs-launching');
      var success = document.getElementById('cs-launch-success');
      var bar = launching ? launching.querySelector('.cs-lp-bar') : null;
      var steps = ['lps-1','lps-2','lps-3','lps-4'];
      if(!launchBtn || !launching || !success) return;
      launchBtn.style.display = 'flex';
      launching.style.display = 'none';
      success.style.display = 'none';
      steps.forEach(function(id){ var s=document.getElementById(id); if(s){s.className='cs-lp-step';} });
      if(bar) bar.style.width='0';

      setTimeout(function(){
        if(current !== 2) return;
        launchBtn.style.display = 'none';
        launching.style.display = 'block';
        var pct = [20,45,70,100];
        steps.forEach(function(id,i){
          setTimeout(function(){
            if(current !== 2) return;
            var s=document.getElementById(id); if(s) s.classList.add('active');
            if(bar) bar.style.width = pct[i]+'%';
            if(i>0){ var prev=document.getElementById(steps[i-1]); if(prev){prev.classList.remove('active');prev.classList.add('done');} }
            if(i===steps.length-1){
              setTimeout(function(){
                if(current !== 2) return;
                var last=document.getElementById(steps[i]); if(last){last.classList.remove('active');last.classList.add('done');}
                launching.style.display = 'none';
                success.style.display = 'flex';
              }, 600);
            }
          }, 600*(i+1));
        });
      }, 1800);
    }

    var runners = [runLogin, runDash, runVM];

    function next(){
      current = (current + 1) % screens.length;
      runners[current]();
      timer = setTimeout(next, durations[current]);
    }

    // start only when section enters viewport
    var demoEl = document.querySelector('.console-frame');
    if(demoEl){
      var demoIO = new IntersectionObserver(function(entries){
        if(entries[0].isIntersecting){
          demoIO.disconnect();
          runLogin();
          timer = setTimeout(next, durations[0]);
        }
      }, {threshold:.2});
      demoIO.observe(demoEl);
    }
  })();


  // DM launcher popup (WhatsApp / LinkedIn)
  document.querySelectorAll('.dm-wrap').forEach(function(wrap){
    var btn = wrap.querySelector('.dm-launch');
    var pop = wrap.querySelector('.dm-pop');
    if(!btn || !pop) return;
    function close(){ pop.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
    function open(){ pop.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      pop.classList.contains('open') ? close() : open();
    });
    document.addEventListener('click', function(e){ if(!wrap.contains(e.target)) close(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
    pop.querySelectorAll('.dm-opt').forEach(function(a){ a.addEventListener('click', close); });
  });
})();
