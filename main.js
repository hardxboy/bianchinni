/* ==========================================================
   ★ EDITE AQUI — contatos, redes e mapa em um só lugar ★
   ========================================================== */
const CONFIG = {
  whatsappNumber : "5531999990000",  // DDI + DDD + número, só dígitos
  whatsappMsg    : "Olá! Vim pelo site e gostaria de agendar um horário na Bianchinni Barbearia.",
  phoneDisplay   : "+55 (31) 99999-0000",
  phoneRaw       : "+5531999990000",
  email          : "contato@bianchinnibarbearia.com.br",
  address        : "Rua Antônio de Albuquerque, 738 — Savassi, Belo Horizonte/MG",
  mapQuery       : "Rua Antônio de Albuquerque, 738, Savassi, Belo Horizonte",
  instagram      : "https://instagram.com/bianchinnibarbearia",
  facebook       : "https://facebook.com/bianchinnibarbearia"
};
/* ========================================================== */

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- aplica a configuração em todos os pontos do site ---------- */
(function applyConfig(){
  const waHref = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(CONFIG.whatsappMsg);
  $$("[data-wa]").forEach(a => { a.href = waHref; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-tel-link]").forEach(a => a.href = "tel:" + CONFIG.phoneRaw);
  $$("[data-mail-link]").forEach(a => a.href = "mailto:" + CONFIG.email);
  $$("[data-ig]").forEach(a => a.href = CONFIG.instagram);
  $$("[data-fb]").forEach(a => a.href = CONFIG.facebook);
  $$("[data-phone]").forEach(el => el.textContent = CONFIG.phoneDisplay);
  $$("[data-mail]").forEach(el => el.textContent = CONFIG.email);
  $$("[data-addr]").forEach(el => el.textContent = CONFIG.address);
  $$("[data-addr-link]").forEach(a => a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapQuery));
  $("#mapFrame").src = "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG.mapQuery) + "&output=embed";
  $("#year").textContent = new Date().getFullYear();
})();

/* ---------- cortina de abertura ---------- */
(function shutter(){
  const el = $("#shutter");
  const done = () => {
    el.classList.add("is-done");
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-ready");
    setTimeout(() => el.classList.add("is-gone"), 1200);
  };
  if (reduceMotion) { el.classList.add("is-gone"); document.body.classList.remove("is-locked"); document.body.classList.add("is-ready"); return; }
  setTimeout(done, 1600);
})();

/* ---------- cabeçalho, parallax e botão flutuante ---------- */
(function scrollFx(){
  const header = $("#header"), heroImg = $("#heroImg"), wa = $(".wa-float");
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    wa.classList.toggle("is-on", y > 560);
    if (!reduceMotion && y < window.innerHeight && heroImg) {
      heroImg.style.transform = "translate3d(0," + (y * .22) + "px,0) scale(1.12)";
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive:true });
  onScroll();
})();

/* ---------- gaveta mobile ---------- */
(function drawer(){
  const drawer = $("#drawer"), burger = $("#burger");
  const setOpen = open => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("is-locked", open);
  };
  burger.addEventListener("click", () => setOpen(!drawer.classList.contains("is-open")));
  $$("[data-drawer-close]", drawer).forEach(el => el.addEventListener("click", () => setOpen(false)));
  $$("a.dlink", drawer).forEach(a => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("is-open")) setOpen(false); });
})();

/* ---------- revelação no scroll ---------- */
(function reveals(){
  const els = $$("[data-rv]");
  if (reduceMotion) { els.forEach(el => el.classList.add("is-in")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold:.15, rootMargin:"0px 0px -6% 0px" });
  els.forEach(el => io.observe(el));
})();

/* ---------- contadores ---------- */
(function counters(){
  const nums = $$(".stat__num");
  const render = (el, val) => {
    const dec = +(el.dataset.decimals || 0);
    el.textContent = val.toLocaleString("pt-BR", { minimumFractionDigits:dec, maximumFractionDigits:dec }) + (el.dataset.suffix || "");
  };
  if (reduceMotion) { nums.forEach(el => render(el, +el.dataset.count)); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, target = +el.dataset.count, t0 = performance.now(), dur = 1500;
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        render(el, target * e);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold:.5 });
  nums.forEach(el => io.observe(el));
})();

/* ---------- abas de serviços ---------- */
(function tabs(){
  const tabBtns = $$(".tab");
  const activate = btn => {
    tabBtns.forEach(b => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      $("#" + b.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabBtns.forEach((b, i) => {
    b.addEventListener("click", () => activate(b));
    b.addEventListener("keydown", e => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const next = tabBtns[(i + (e.key === "ArrowRight" ? 1 : tabBtns.length - 1)) % tabBtns.length];
        next.focus(); activate(next);
      }
    });
  });
})();

/* ---------- preços editáveis (salvos no navegador) ---------- */
(function editablePrices(){
  const KEY = "bianchinni:precos";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch(e){}
  $$("[data-price]").forEach(el => {
    const key = el.dataset.price;
    if (saved[key]) el.textContent = saved[key];
    el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); el.blur(); } });
    el.addEventListener("input", () => {
      saved[key] = el.textContent.trim();
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch(e){}
    });
  });
})();

/* ---------- status aberto / fechado ---------- */
(function openStatus(){
  const HOURS = { 0:null, 1:null, 2:[9,19], 3:[9,19], 4:[9,19], 5:[9,19], 6:[8,18] }; // 0=domingo
  const days = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  const fmt = h => String(h).padStart(2,"0") + "h";
  const box = $("#openStatus"), label = box.querySelector("span:last-child");
  const now = new Date(), d = now.getDay(), t = now.getHours() + now.getMinutes()/60;
  const today = HOURS[d];
  if (today && t >= today[0] && t < today[1]) {
    box.classList.remove("is-closed");
    label.textContent = "Aberto agora — fecha às " + fmt(today[1]);
    return;
  }
  for (let i = 0; i <= 7; i++) {
    const dd = (d + i) % 7, h = HOURS[dd];
    if (h && (i > 0 || t < h[0])) {
      const when = i === 0 ? "hoje" : i === 1 ? "amanhã" : days[dd];
      box.classList.add("is-closed");
      label.textContent = "Fechado — abre " + when + " às " + fmt(h[0]);
      return;
    }
  }
})();

/* ---------- link ativo na navegação ---------- */
(function activeNav(){
  const links = $$(".nav a");
  const map = { tradicao:0, servicos:1, galeria:2, contato:3 };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.classList.remove("is-active"));
      const i = map[en.target.id];
      if (i !== undefined) links[i].classList.add("is-active");
    });
  }, { rootMargin:"-45% 0px -50% 0px" });
  Object.keys(map).forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });
})();

/* ---------- lightbox da galeria ---------- */
(function lightbox(){
  const items = $$(".gitem");
  const box = $("#lightbox"), img = $("#lbImg"), num = $("#lbNum"), cap = $("#lbCap");
  let idx = 0, lastFocus = null;
  const show = i => {
    idx = (i + items.length) % items.length;
    const it = items[idx], pic = it.querySelector("img");
    img.src = pic.src; img.alt = pic.alt;
    num.textContent = "Nº " + String(idx + 1).padStart(2,"0");
    cap.textContent = it.dataset.caption;
  };
  const open = i => {
    lastFocus = document.activeElement;
    show(i); box.classList.add("is-open");
    document.body.classList.add("is-locked");
    $("#lbClose").focus();
  };
  const close = () => {
    box.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus();
  };
  items.forEach((it, i) => it.addEventListener("click", () => open(i)));
  $("#lbClose").addEventListener("click", close);
  $("#lbPrev").addEventListener("click", () => show(idx - 1));
  $("#lbNext").addEventListener("click", () => show(idx + 1));
  box.addEventListener("click", e => { if (e.target === box) close(); });
  document.addEventListener("keydown", e => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
})();
