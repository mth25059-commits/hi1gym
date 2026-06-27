/* ============================================================
   ALMIGHTY GYM — MAIN SCRIPT
   Interactive, Responsive & Ultra Fast
   Author: Dhruv | dhruvdeveloper.me
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== DYNAMIC CONTACT SETTINGS OVERRIDE ====================
  const defaults = {
    phone: '+91 99999 99999',
    whatsapp: '919999999999',
    email: 'info@almightygym.in',
    address: '123 Power Street, Fitness Nagar, Gurugram — 122505'
  };
  const settings = JSON.parse(localStorage.getItem('gym_settings')) || defaults;
  applyDynamicSettings(settings);

  function applyDynamicSettings(set) {
    document.querySelectorAll('a[href^="tel:"]').forEach(l => { l.href = `tel:${set.phone}`; l.textContent = set.phone; });
    document.querySelectorAll('a[href^="mailto:"]').forEach(l => { l.href = `mailto:${set.email}`; l.textContent = set.email; });
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(l => {
      try { const u = new URL(l.href); const t = u.searchParams.get('text') || 'Hi Almighty Gym, I want to join!'; l.href = `https://wa.me/${set.whatsapp}?text=${encodeURIComponent(t)}`; } catch(e){}
    });
  }

  // ==================== VIDEO AUTOPLAY FIX ====================
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('playsinline', '');
    // Force play on iOS/mobile
    const playVideo = () => {
      heroVideo.play().catch(() => {
        // Fallback: show poster image if video can't play
        heroVideo.style.display = 'none';
      });
    };
    if (document.readyState === 'complete') playVideo();
    else window.addEventListener('load', playVideo);
    // Re-trigger on user interaction for strict browsers
    document.addEventListener('touchstart', () => { if (heroVideo.paused) heroVideo.play().catch(()=>{}); }, { once: true });
    document.addEventListener('click', () => { if (heroVideo.paused) heroVideo.play().catch(()=>{}); }, { once: true });
  }

  // ==================== LOADER ====================
  const loader = document.getElementById('loader');
  if (loader) {
    const hideLoader = () => setTimeout(() => loader.classList.add('hide'), 400);
    if (document.readyState === 'complete') hideLoader();
    else window.addEventListener('load', hideLoader);
  }

  // ==================== WELCOME MODAL ====================
  const welcomeModal = document.getElementById('welcomeModal');
  const welcomeClose = document.getElementById('welcomeModalClose');
  const welcomeSkip  = document.getElementById('welcomeSkip');
  if (welcomeModal) {
    setTimeout(() => { welcomeModal.classList.add('show'); document.body.style.overflow = 'hidden'; }, 1400);
    const closeWelcome = (e) => { if(e) e.preventDefault(); welcomeModal.classList.remove('show'); document.body.style.overflow = ''; };
    if(welcomeClose) welcomeClose.addEventListener('click', closeWelcome);
    if(welcomeSkip)  welcomeSkip.addEventListener('click', closeWelcome);
    welcomeModal.addEventListener('click', e => { if(e.target === welcomeModal) closeWelcome(); });
  }

  // ==================== FLOAT MODAL ====================
  const formModal   = document.getElementById('formModal');
  const formFloat   = document.getElementById('formFloat');
  const fmodalClose = document.getElementById('fmodalClose');
  const openBtns    = document.querySelectorAll('.open-modal-btn, #aboutJoinBtn');
  if (formModal) {
    const open  = e => { if(e) e.preventDefault(); formModal.classList.add('show'); document.body.style.overflow = 'hidden'; };
    const close = e => { if(e) e.preventDefault(); formModal.classList.remove('show'); document.body.style.overflow = ''; };
    if(formFloat)   formFloat.addEventListener('click', open);
    if(fmodalClose) fmodalClose.addEventListener('click', close);
    openBtns.forEach(b => b.addEventListener('click', open));
    formModal.addEventListener('click', e => { if(e.target === formModal) close(); });
  }

  // ==================== NAVBAR ====================
  const navbar = document.getElementById('navbar');
  const handleScroll = () => { navbar && (window.scrollY > 40 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled')); };
  window.addEventListener('scroll', handleScroll); handleScroll();

  // ==================== HAMBURGER ====================
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksEl.classList.toggle('open');
      navbar && navbar.classList.toggle('menu-open');
      document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
    });
    document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      if(navbar) navbar.classList.remove('menu-open');
      document.body.style.overflow = '';
    }));
  }

  // ==================== THEME TOGGLE ====================
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const html        = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved); updateThemeIcon(saved);
  if(themeToggle) themeToggle.addEventListener('click', () => {
    const cur = html.getAttribute('data-theme');
    const nxt = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nxt); localStorage.setItem('theme', nxt); updateThemeIcon(nxt);
  });
  function updateThemeIcon(t) {
    if(!themeIcon) return;
    themeIcon.className = t === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    themeIcon.style.color = t === 'light' ? '#c9a84c' : '';
  }

  // ==================== ACTIVE LINK ON SCROLL ====================
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if(window.scrollY + 120 >= s.offsetTop && window.scrollY + 120 < s.offsetTop + s.clientHeight) cur = s.id; });
    navLinks.forEach(l => { l.classList.remove('active'); if(l.getAttribute('href') === `#${cur}`) l.classList.add('active'); });
  });

  // ==================== COUNTER ====================
  const stats = document.querySelectorAll('.stat-n');
  const startCounters = () => {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10); if(!target) return;
      let count = 0;
      const step = Math.ceil(target / 80);
      const timer = setInterval(() => {
        count += step;
        if (count >= target) { stat.textContent = target; clearInterval(timer); }
        else stat.textContent = count;
      }, 20);
    });
  };
  setTimeout(startCounters, 1000);

  // ==================== GALLERY FILTERING ====================
  const tabs  = document.querySelectorAll('.tab');
  const gitems = document.querySelectorAll('.gitem');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active');
    const filter = tab.getAttribute('data-filter');
    gitems.forEach(item => {
      item.style.transition = 'opacity .3s, transform .3s';
      if (filter === 'all' || item.getAttribute('data-cat') === filter) {
        item.classList.remove('hidden'); item.style.opacity = '1'; item.style.transform = '';
      } else {
        item.style.opacity = '0';
        setTimeout(() => item.classList.add('hidden'), 300);
      }
    });
  }));

  // ==================== REVIEWS CAROUSEL ====================
  const track   = document.getElementById('reviewsTrack');
  const rcards  = document.querySelectorAll('.r-card');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  if (track && rcards.length > 0) {
    let cur = 0; const gap = 22;
    const perView = () => { if(window.innerWidth <= 600) return 1; if(window.innerWidth <= 900) return 2; return 3; };
    const maxIdx  = () => Math.max(0, rcards.length - perView());
    const update  = () => {
      const w = rcards[0].offsetWidth;
      track.style.transform = `translateX(-${cur * (w + gap)}px)`;
      document.querySelectorAll('.car-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    };
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxIdx(); i++) {
        const d = document.createElement('button'); d.className = `car-dot${i===0?' active':''}`;
        d.addEventListener('click', () => { cur = i; update(); }); dotsContainer.appendChild(d);
      }
    }
    if(nextBtn) nextBtn.addEventListener('click', () => { cur = cur < maxIdx() ? cur+1 : 0; update(); });
    if(prevBtn) prevBtn.addEventListener('click', () => { cur = cur > 0 ? cur-1 : maxIdx(); update(); });
    let auto = setInterval(() => { cur = cur < maxIdx() ? cur+1 : 0; update(); }, 4000);
    const carousel = document.getElementById('reviewsCarousel');
    if(carousel) { carousel.addEventListener('mouseenter', () => clearInterval(auto)); carousel.addEventListener('mouseleave', () => { auto = setInterval(() => { cur = cur < maxIdx() ? cur+1 : 0; update(); }, 4000); }); }
    window.addEventListener('resize', () => { cur = Math.min(cur, maxIdx()); update(); });
  }

  // ==================== BACK TO TOP ====================
  const btt = document.getElementById('backToTop');
  if(btt) {
    window.addEventListener('scroll', () => { btt.classList.toggle('show', window.scrollY > 400); });
    btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  }

  // ==================== SAVE SUBMISSION ====================
  const saveSubmission = (data) => {
    const arr = JSON.parse(localStorage.getItem('almighty_leads')) || [];
    arr.push({ id:Date.now(), timestamp:new Date().toLocaleString('en-IN'), ...data });
    localStorage.setItem('almighty_leads', JSON.stringify(arr));
    window.dispatchEvent(new StorageEvent('storage', { key:'almighty_leads' }));
  };

  // ==================== FORM HANDLER ====================
  const initForm = (formId, successId, isWelcome = false) => {
    const form = document.getElementById(formId);
    const succ = document.getElementById(successId);
    if (!form || !succ) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('input[required]').forEach(inp => {
        if (!inp.value.trim()) { valid = false; inp.style.borderColor = 'var(--red)'; } else inp.style.borderColor = '';
      });
      if (!valid) return;
      const btn = form.querySelector('button[type="submit"]'); const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'; btn.disabled = true;
      let fd = {};
      if      (formId === 'welcomeForm')      fd = { name:document.getElementById('wfName')?.value.trim(), phone:document.getElementById('wfPhone')?.value.trim(), email:'N/A', plan:document.getElementById('wfPlan')?.value||'Free Trial', goal:'Welcome Popup' };
      else if (formId === 'contactForm')      fd = { name:document.getElementById('fname')?.value.trim(), phone:document.getElementById('fphone')?.value.trim(), email:document.getElementById('femail')?.value.trim(), plan:document.getElementById('fplan')?.value||'General', goal:document.getElementById('fmsg')?.value.trim()||'No message' };
      else if (formId === 'modalContactForm') fd = { name:document.getElementById('mfname')?.value.trim(), phone:document.getElementById('mfphone')?.value.trim(), email:document.getElementById('mfemail')?.value.trim(), plan:document.getElementById('mfplan')?.value||'General', goal:document.getElementById('mfgoal')?.value.trim()||'No message' };
      saveSubmission(fd);
      setTimeout(() => {
        form.reset(); btn.innerHTML = orig; btn.disabled = false; succ.style.display = 'flex';
        setTimeout(() => {
          succ.style.display = 'none';
          if (isWelcome) { const wm = document.getElementById('welcomeModal'); if(wm){ wm.classList.remove('show'); document.body.style.overflow=''; } }
          else if (formId === 'modalContactForm') { const fm = document.getElementById('formModal'); if(fm){ fm.classList.remove('show'); document.body.style.overflow=''; } }
        }, 2800);
      }, 1000);
    });
  };
  initForm('welcomeForm','wfSuccess',true);
  initForm('contactForm','formSuccess');
  initForm('modalContactForm','modalFormSuccess');

  // ==================== ON-SCROLL REVEAL ====================
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealOnScroll = () => reveals.forEach(el => { if(el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('visible'); });
  window.addEventListener('scroll', revealOnScroll, { passive:true }); revealOnScroll();

});
