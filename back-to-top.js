(function () {
  var css = `
    #btt-btn {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      width: 44px;
      height: 44px;
      background: #1a1a1a;
      color: #fff;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,.25);
      opacity: 0;
      transform: translateX(-50%) translateY(12px);
      transition: opacity .25s ease, transform .25s ease;
      pointer-events: none;
      z-index: 8000;
    }
    #btt-btn.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
      pointer-events: auto;
    }
    #btt-btn:hover {
      background: #333;
      transform: translateX(-50%) translateY(-2px);
    }
    @media (max-width: 560px) {
      #btt-btn { bottom: 20px; width: 40px; height: 40px; }
    }
  `;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'btt-btn';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12V4M4 7l4-4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
