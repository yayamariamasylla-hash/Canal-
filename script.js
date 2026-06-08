/* ═══════════════════════════════════════
   CANAL+ SÉNÉGAL — script.js
═══════════════════════════════════════ */

/* ───────────────────────────────────────
   1. HERO SLIDER
─────────────────────────────────────── */
let currentSlide = 0;
let isPaused = false;
let sliderInterval;
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');
const total  = slides.length;

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + total) % total;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  resetProgress();
}

function changeSlide(dir) {
  goToSlide(currentSlide + dir);
  resetTimer();
}

function resetTimer() {
  clearInterval(sliderInterval);
  if (!isPaused) {
    sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
}

function togglePause() {
  isPaused = !isPaused;
  const btn = document.getElementById('sliderPause');
  if (btn) btn.textContent = isPaused ? '▶' : '⏸';
  if (isPaused) {
    clearInterval(sliderInterval);
  } else {
    sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
}

function resetProgress() {
  const bar = document.getElementById('sliderProgress');
  if (!bar) return;
  bar.style.animation = 'none';
  bar.offsetHeight; // reflow
  bar.style.animation = '';
}

// Swipe tactile mobile
let touchStartX = 0;
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
  heroSlider.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  });
  heroSlider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
  });
}

// Démarrer le slider automatiquement
if (slides.length > 0) {
  sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

/* ───────────────────────────────────────
   2. SMOOTH SCROLL
─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 110;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ───────────────────────────────────────
   3. SUBNAV ACTIVE
─────────────────────────────────────── */
function setSubnavActive(el) {
  document.querySelectorAll('.subnav-link').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

/* ───────────────────────────────────────
   4. GUIDE TV — ONGLETS JOURS
─────────────────────────────────────── */
function setGuideDay(el) {
  document.querySelectorAll('.guide-day-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

/* ───────────────────────────────────────
   5. FILTRAGE DES CHAÎNES
─────────────────────────────────────── */
function filterChannels(el) {
  document.querySelectorAll('.ch-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const cat = el.getAttribute('data-cat');
  document.querySelectorAll('.channel-cell').forEach(cell => {
    if (cat === 'all' || cell.getAttribute('data-cat') === cat) {
      cell.style.display = 'flex';
    } else {
      cell.style.display = 'none';
    }
  });
}

/* ───────────────────────────────────────
   6. SÉRIES & FILMS — ONGLETS
─────────────────────────────────────── */
function showSeriesTab(el) {
  document.querySelectorAll('.series-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const tab = el.getAttribute('data-tab');
  ['series', 'films', 'sport'].forEach(t => {
    const grid = document.getElementById('tab-' + t);
    if (grid) grid.style.display = (t === tab) ? 'grid' : 'none';
  });
}

/* ───────────────────────────────────────
   7. TRAILER YOUTUBE
─────────────────────────────────────── */
function openTrailer(videoId, title) {
  document.getElementById('trailerTitle').textContent = title;
  document.getElementById('trailerFrame').src =
    'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
  toggleModal('trailerModal');
}

function closeTrailer() {
  document.getElementById('trailerFrame').src = '';
  closeModalById('trailerModal');
}

/* ───────────────────────────────────────
   8. MODALS
─────────────────────────────────────── */
function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.toggle('open');
  document.body.style.overflow = modal.classList.contains('open') ? 'hidden' : '';
}

function closeModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(event, modalId) {
  if (event.target.id === modalId) {
    closeModalById(modalId);
  }
}

// Fermer avec la touche Échap
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      // Stoppe la vidéo si c'est le modal trailer
      if (m.id === 'trailerModal') {
        document.getElementById('trailerFrame').src = '';
      }
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
    // Ferme le chatbot aussi
    const chatbot = document.getElementById('chatbotBox');
    if (chatbot) chatbot.classList.remove('open');
  }
});

// Réinitialise le contenu des modals à la fermeture
document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', function (e) {
    if (e.target === this || e.target.classList.contains('modal-close')) {
      const loginBody = document.getElementById('loginModalBody');
      const subBody   = document.getElementById('subscribeModalBody');
      const reaboBody = document.getElementById('reaboModalBody');
      setTimeout(() => {
        if (loginBody && loginBody.getAttribute('data-original'))
          loginBody.innerHTML = loginBody.getAttribute('data-original');
        if (subBody && subBody.getAttribute('data-original'))
          subBody.innerHTML = subBody.getAttribute('data-original');
        if (reaboBody && reaboBody.getAttribute('data-original'))
          reaboBody.innerHTML = reaboBody.getAttribute('data-original');
      }, 300);
    }
  });
});

/* ───────────────────────────────────────
   9. FORMULAIRES — SPINNER + SUCCÈS
─────────────────────────────────────── */
function submitFakeForm(containerId, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Sauvegarde du contenu original
  if (!container.getAttribute('data-original')) {
    container.setAttribute('data-original', container.innerHTML);
  }

  // 1. Afficher le spinner
  container.innerHTML = `
    <div style="padding:2rem 0;text-align:center;">
      <div class="spinner"></div>
      <p style="font-size:.85rem;color:#666;font-weight:600;margin-top:1rem;">
        Traitement de votre demande en cours...
      </p>
    </div>
  `;

  // 2. Afficher le succès après 1.5s
  setTimeout(() => {
    let icon  = '✓';
    let title = 'Demande enregistrée !';
    let msg   = 'Un conseiller CANAL+ Sénégal va vous contacter.';

    if (type === 'login') {
      icon  = '🔓';
      title = 'Connexion réussie !';
      msg   = 'Bienvenue sur votre Espace Client CANAL+ Sénégal.';
    } else if (type === 'reabo') {
      icon  = '✅';
      title = 'Réabonnement confirmé !';
      msg   = 'Votre abonnement a été renouvelé. Un SMS de confirmation vous sera envoyé.';
    } else if (type === 'subscribe') {
      icon  = '🎉';
      title = 'Demande enregistrée !';
      msg   = 'Un conseiller CANAL+ Sénégal va vous rappeler sur votre numéro.';
    }

    container.innerHTML = `
      <div style="text-align:center;padding:1rem 0;">
        <span class="success-icon">${icon}</span>
        <h3 class="success-title">${title}</h3>
        <p class="success-p">${msg}</p>
      </div>
    `;

    // Fermer le modal automatiquement après 2.5s
    setTimeout(() => {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }, 2500);

  }, 1500);
}

/* ───────────────────────────────────────
   10. NEWSLETTER
─────────────────────────────────────── */
function submitNewsletter() {
  const input = document.getElementById('newsletterEmail');
  const msg   = document.getElementById('newsletterMsg');
  if (!input || !input.value.includes('@')) {
    alert('Veuillez entrer une adresse email valide.');
    return;
  }
  input.value = '';
  if (msg) msg.style.display = 'block';
}

/* ───────────────────────────────────────
   11. FAQ ACCORDÉON
─────────────────────────────────────── */
function toggleFaq(element) {
  const parent = element.parentElement;
  const isOpen = parent.classList.contains('open');
  // Ferme tous les autres
  document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));
  // Ouvre celui cliqué seulement s'il était fermé
  if (!isOpen) parent.classList.add('open');
}

/* ───────────────────────────────────────
   12. CHATBOT
─────────────────────────────────────── */
function toggleChat() {
  const box   = document.getElementById('chatbotBox');
  const notif = document.querySelector('.chatbot-notif');
  if (!box) return;
  box.classList.toggle('open');
  if (notif) notif.style.display = 'none';
}

const chatReplies = {
  abonn:   "Pour s'abonner, choisissez votre offre : ACCESS, ÉVASION, ÉVASION+ ou TOUT CANAL+. Cliquez sur 'S'abonner' en haut ! 😊",
  reabo:   "Pour vous réabonner, cliquez sur 'Se réabonner'. Payez par Orange Money, Wave, Free Money ou Expresso. Frais de 200 FCFA appliqués depuis sept. 2025.",
  chaines: "CANAL+ Sénégal propose plus de 160 chaînes selon votre formule : sport, cinéma, séries, africaines, jeunesse, musique et info !",
  aide:    "Appelez-nous au 📞 33 889 50 10 (Lun–Sam 8h–20h) ou via notre page Facebook : facebook.com/CanalplusSenegal (534K abonnés). Dalal ak jamm !"
};

function chatQuick(key) {
  const labels = {
    abonn:   "Je veux m'abonner",
    reabo:   "Je veux me réabonner",
    chaines: "Quelles chaînes ?",
    aide:    "J'ai besoin d'aide"
  };
  addChatMsg(labels[key], 'user');
  setTimeout(() => addChatMsg(chatReplies[key], 'bot'), 700);
}

function sendChat() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;
  addChatMsg(msg, 'user');
  input.value = '';

  setTimeout(() => {
    const l = msg.toLowerCase();
    let reply = "Je n'ai pas bien compris. Appelez le 33 889 50 10 pour plus d'aide.";
    if (l.includes('abonn'))                            reply = chatReplies.abonn;
    else if (l.includes('réabonn') || l.includes('reabo')) reply = chatReplies.reabo;
    else if (l.includes('chaîne') || l.includes('sport') || l.includes('film')) reply = chatReplies.chaines;
    else if (l.includes('aide') || l.includes('probl') || l.includes('contact')) reply = chatReplies.aide;
    else if (l.includes('prix') || l.includes('combien')) reply = "Nos offres vont de 5 000 FCFA/mois (ACCESS) à 40 000 FCFA/mois (TOUT CANAL+).";
    else if (l.includes('merci') || l.includes('thank'))  reply = "Avec plaisir ! Dalal ak jamm ! 🙏";
    else if (l.includes('can') || l.includes('foot'))     reply = "La CAN 2025 est diffusée en exclusivité sur Canal+ ! 52 matchs en direct. Le Sénégal est Champion d'Afrique 🏆";
    addChatMsg(reply, 'bot');
  }, 800);
}

function addChatMsg(text, sender) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = 'chat-msg ' + sender;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

/* ───────────────────────────────────────
   13. RECHERCHE
─────────────────────────────────────── */
const searchData = [
  { icon:'⚽', name:'Canal+ Sport',     cat:'Chaîne Sport' },
  { icon:'🏆', name:'beIN Sports',      cat:'Chaîne Sport' },
  { icon:'🎬', name:'Canal+ Action',    cat:'Chaîne Cinéma' },
  { icon:'🍿', name:'Canal+ Cinema',    cat:'Chaîne Cinéma' },
  { icon:'🌍', name:'RTS 1',            cat:'Chaîne Sénégalaise' },
  { icon:'🦁', name:'TFM',              cat:'Chaîne Sénégalaise' },
  { icon:'📺', name:'2sTV',             cat:'Chaîne Sénégalaise' },
  { icon:'🌺', name:'A+ Sénégal',       cat:'Chaîne Africaine' },
  { icon:'📡', name:'Sunu Yeuf',        cat:'Chaîne Africaine' },
  { icon:'📰', name:'i24 News',         cat:'Chaîne Info' },
  { icon:'🗺️', name:'TV5 Monde',        cat:'Chaîne Info' },
  { icon:'🌐', name:'France 24',        cat:'Chaîne Info' },
  { icon:'🧒', name:'Cartoon Network',  cat:'Chaîne Jeunesse' },
  { icon:'👶', name:'Gulli',            cat:'Chaîne Jeunesse' },
  { icon:'🐭', name:'Disney Channel',   cat:'Chaîne Jeunesse' },
  { icon:'🎵', name:'MTV Base',         cat:'Chaîne Musique' },
  { icon:'🎙️', name:'Trace Africa',     cat:'Chaîne Musique' },
  { icon:'🎭', name:'Novelas TV',       cat:'Chaîne Séries' },
  { icon:'🔍', name:'Sakho & Mangane',  cat:'Série CANAL+ Original' },
  { icon:'🎺', name:'Black Santiago Club', cat:'Série CANAL+ Original' },
];

function handleSearch(val) {
  const results = document.getElementById('searchResults');
  if (!results) return;
  if (!val.trim()) { results.innerHTML = ''; return; }
  const filtered = searchData.filter(d =>
    d.name.toLowerCase().includes(val.toLowerCase()) ||
    d.cat.toLowerCase().includes(val.toLowerCase())
  );
  if (!filtered.length) {
    results.innerHTML = '<div style="color:#aaa;font-size:.82rem;padding:.5rem 0;">Aucun résultat trouvé.</div>';
    return;
  }
  results.innerHTML = filtered.map(d => `
    <div class="search-result-item">
      <span style="font-size:1.2rem;">${d.icon}</span>
      <div>
        <div style="font-weight:600;">${d.name}</div>
        <div style="font-size:.72rem;color:#888;">${d.cat}</div>
      </div>
    </div>
  `).join('');
}

function doSearch(term) {
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = term;
    handleSearch(term);
  }
}

/* ───────────────────────────────────────
   14. COOKIES
─────────────────────────────────────── */
function closeCookies() {
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.style.display = 'none';
}

/* ───────────────────────────────────────
   15. NAV LINKS — ACTIVE AU SCROLL
─────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const sections = ['offres-section','series-films','guide-tv','chaines','decodeurs','mycanal','actualites','revendeurs'];
  const scrollY  = window.scrollY + 120;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (match) match.classList.add('active');
    }
  });
});


/* ───────────────────────────────────────
   16. LOADER DE PAGE
─────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

/* ───────────────────────────────────────
   17. BOUTON SCROLL TO TOP
─────────────────────────────────────── */
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (scrollBtn) {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }
  // Navbar effet scroll
  const nav = document.querySelector('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 64);
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ───────────────────────────────────────
   18. ESPACE CLIENT DASHBOARD
─────────────────────────────────────── */
function openEspaceClient() {
  const body = document.getElementById('loginModalBody');
  if (!body) return;

  // Sauvegarder l'original
  if (!body.getAttribute('data-original')) {
    body.setAttribute('data-original', body.innerHTML);
  }

  body.innerHTML = `
    <div class="ec-dashboard">
      <div class="ec-profile">
        <div class="ec-avatar">👤</div>
        <div>
          <div class="ec-name">Moussa Diallo</div>
          <div class="ec-number">N° décodeur : <strong>1234567890</strong></div>
        </div>
        <span class="ec-badge-plan">ÉVASION</span>
      </div>
      <div class="ec-cards">
        <div class="ec-card">
          <div class="ec-card-label">Formule</div>
          <div class="ec-card-value red">ÉVASION</div>
          <div class="ec-card-sub">160+ chaînes</div>
        </div>
        <div class="ec-card">
          <div class="ec-card-label">Échéance</div>
          <div class="ec-card-value">15 juin 2026</div>
          <div class="ec-card-sub" style="color:#e3a008;">⏰ Dans 16 jours</div>
        </div>
        <div class="ec-card">
          <div class="ec-card-label">Dernier paiement</div>
          <div class="ec-card-value">10 000 FCFA</div>
          <div class="ec-card-sub">15 mai 2026</div>
        </div>
      </div>
      <div class="ec-actions">
        <button class="ec-action-btn" onclick="closeModalById('loginModal');toggleModal('reaboModal')">🔄 Se réabonner</button>
        <button class="ec-action-btn" onclick="closeModalById('loginModal');toggleModal('subscribeModal')">⬆️ Changer de formule</button>
        <button class="ec-action-btn" onclick="showHistory()">📜 Historique</button>
        <button class="ec-action-btn">⚙️ Paramètres</button>
      </div>
      <div id="historySection" style="display:none;">
        <div class="ec-history-title">Historique des paiements</div>
        <table class="ec-table">
          <thead><tr><th>Date</th><th>Formule</th><th>Montant</th><th>Statut</th></tr></thead>
          <tbody>
            <tr><td>15/05/2026</td><td>ÉVASION</td><td>10 000 FCFA</td><td><span class="ec-status-ok">✓ Payé</span></td></tr>
            <tr><td>15/04/2026</td><td>ÉVASION</td><td>10 000 FCFA</td><td><span class="ec-status-ok">✓ Payé</span></td></tr>
            <tr><td>15/03/2026</td><td>ÉVASION</td><td>10 000 FCFA</td><td><span class="ec-status-ok">✓ Payé</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  toggleModal('loginModal');
}

function showHistory() {
  const h = document.getElementById('historySection');
  if (h) h.style.display = h.style.display === 'none' ? 'block' : 'none';
}

/* ───────────────────────────────────────
   19. SKELETON LOADING — Séries
─────────────────────────────────────── */
function showSkeletons() {
  const grid = document.getElementById('tab-series');
  if (!grid) return;
  const skels = Array(4).fill(`
    <div class="series-card" style="pointer-events:none;">
      <div class="series-thumb">
        <div class="skeleton" style="width:100%;height:100%;min-height:130px;"></div>
      </div>
      <div class="series-info">
        <div class="skeleton" style="height:14px;width:70%;margin-bottom:8px;"></div>
        <div class="skeleton" style="height:10px;width:50%;margin-bottom:8px;"></div>
        <div class="skeleton" style="height:10px;width:90%;"></div>
      </div>
    </div>
  `).join('');
  grid.innerHTML = skels;
  setTimeout(restoreSeriesCards, 1000);
}

let seriesOriginal = '';
function restoreSeriesCards() {
  // Les vraies cartes sont déjà dans le DOM — pas besoin de restaurer
}


/* ───────────────────────────────────────
   20. SÉLECTEUR DE PAYS
─────────────────────────────────────── */
function switchPays(el) {
  document.querySelectorAll('.pays-item').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
}


/* ───────────────────────────────────────
   21. HAMBURGER MENU MOBILE
─────────────────────────────────────── */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (!menu || !btn) return;
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('open');
}

// Fermer le menu mobile si on clique ailleurs
document.addEventListener('click', e => {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
    btn.classList.remove('open');
  }
});