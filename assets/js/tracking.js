// Núcleo de tracking/UTM compartilhado por todas as páginas de aquisição do
// Cura Domus (geral e específicas de cada grupo). Substitui o bloco de
// script que antes era copiado e colado em cada página.
//
// Cada página deve ter <body data-grupo="bebes"> (ou "imaginario",
// "educacao", "lar", ou vazio/ausente na página geral). Este arquivo lê o
// atributo automaticamente — nenhuma outra configuração é necessária.
// Deve ser incluído no fim do <body>, depois do conteúdo da página.
(function () {
  const CAMPANHA = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
  const params = new URLSearchParams(location.search);
  const utms = {};
  CAMPANHA.forEach((k) => { const v = params.get(k); if (v) utms[k] = v; });

  function comUtms(href) {
    try {
      const u = new URL(href, location.href);
      Object.entries(utms).forEach(([k, v]) => u.searchParams.set(k, v));
      return u.toString();
    } catch {
      return href;
    }
  }

  window.dataLayer = window.dataLayer || [];
  function track(evento, dados = {}) {
    window.dataLayer.push({ event: evento, ...utms, ...dados });
  }
  // Exposto globalmente para qualquer script da página (ex.: grupo-landing.js)
  // poder disparar eventos extras sem duplicar a lógica de UTM.
  window.CuraDomusTrack = track;
  window.CuraDomusComUtms = comUtms;

  const grupo = document.body.dataset.grupo || null;
  const eventoView = grupo ? "view_group_page" : "view_general_page";

  // Aplica os UTMs a todo link marcado com data-utm (internos e do WhatsApp).
  // Roda em runtime (não no load do <head>) para já pegar links que o
  // grupo-landing.js tiver acabado de inserir na página.
  function aplicarUtms() {
    document.querySelectorAll("a[data-utm]").forEach((a) => {
      a.href = comUtms(a.getAttribute("href"));
    });
  }
  aplicarUtms();
  window.CuraDomusAplicarUtms = aplicarUtms;

  // Profundidade de rolagem (25/50/75/100).
  const marcos = [25, 50, 75, 100];
  const vistos = new Set();
  addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = Math.round(((h.scrollTop + innerHeight) / h.scrollHeight) * 100);
    marcos.forEach((m) => { if (pct >= m && !vistos.has(m)) { vistos.add(m); track("scroll", { percent_scrolled: m }); } });
  }, { passive: true });

  track(eventoView, { grupo });

  document.addEventListener("click", (ev) => {
    const whats = ev.target.closest("a[data-whats]");
    if (whats) {
      track("click_whatsapp", { grupo, local: whats.dataset.whats });
      track("cta_click", { grupo, local: whats.dataset.whats });
      return;
    }
    const groupClick = ev.target.closest("a[data-group-click]");
    if (groupClick) {
      track("click_group", { grupo_destino: groupClick.dataset.groupClick });
    }
  });

  // Sticky CTA: aparece quando o CTA principal (hero) some da tela.
  const heroCta = document.querySelector('a[data-whats="hero"]');
  const stickyBar = document.getElementById("stickyCta");
  if (heroCta && stickyBar) {
    new IntersectionObserver(([entry]) => {
      stickyBar.style.display = entry.isIntersecting ? "none" : "flex";
    }, { threshold: 0 }).observe(heroCta);
  }

  // Na página geral (cta.html) a barra fixa some/aparece em relação à seção
  // de grupos, não a um botão único — só ativa se essa seção existir.
  const gruposSection = document.getElementById("grupos");
  if (gruposSection && stickyBar && !heroCta) {
    new IntersectionObserver(([entry]) => {
      stickyBar.style.display = entry.isIntersecting ? "none" : "flex";
    }, { threshold: 0 }).observe(gruposSection);
  }
})();
