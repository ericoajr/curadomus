// Google Analytics 4 do Cura Domus, compartilhado por todas as páginas.
// Incluir no <head>: <script src="/assets/js/analytics.js"></script>
//
// - Carrega o gtag e envia "origem" (?origem= da URL, "direto" se ausente) e
//   "pagina" com todos os eventos. Cadastre ambos como dimensões
//   personalizadas (escopo de evento) no GA para vê-los nos relatórios.
// - Mede, em qualquer página, cliques em convites do WhatsApp
//   (click_whatsapp) e em links de oferta das lojas (click_oferta). Rolagem e
//   cliques de saída genéricos ficam com a medição otimizada do próprio GA.
// - Páginas com o tracking.js (cta.html) já enviam click_whatsapp com mais
//   contexto; aqui esse evento é ignorado nelas para não contar em dobro.
(function () {
  var GA_ID = "G-YLVWEXK5VJ";

  var params = new URLSearchParams(location.search);
  var pagina = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "") || "index";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    origem: params.get("origem") || "direto",
    pagina: pagina
  });

  // Convite do WhatsApp -> slug do grupo (mesmos links de grupos-data.js).
  var GRUPO_POR_CONVITE = {
    EAN1D7qKG3m5iFAmh7Hr3F: "imaginario",
    Dq5cuiWi5vYAQrXq5c2DuW: "educacao",
    KFFiBvHSKVjKUrQmz0ZNwl: "lar",
    C84J6GtX87t6a0HFp2x5EX: "bebes"
  };

  var LOJAS = [
    { loja: "amazon", padrao: /(^|\.)(amazon\.com\.br|amzn\.to)$/ },
    { loja: "mercadolivre", padrao: /(^|\.)(mercadolivre\.com\.br|meli\.la)$/ },
    { loja: "shopee", padrao: /(^|\.)(shopee\.com\.br|shp\.ee)$/ }
  ];

  function nomeDoProduto(a) {
    var card = a.closest("article, li");
    var titulo = card && card.querySelector("h1, h2, h3, h4");
    return titulo ? titulo.textContent.trim().slice(0, 100) : undefined;
  }

  document.addEventListener("click", function (ev) {
    var a = ev.target instanceof Element ? ev.target.closest("a[href]") : null;
    if (!a) return;
    var url;
    try { url = new URL(a.href); } catch (_) { return; }

    if (url.hostname === "chat.whatsapp.com") {
      if (window.CuraDomusTrack) return; // tracking.js já mede nesta página
      gtag("event", "click_whatsapp", {
        grupo_destino: GRUPO_POR_CONVITE[url.pathname.slice(1)] || "desconhecido",
        local: a.dataset.whats || a.id || "link"
      });
      return;
    }

    var loja = LOJAS.filter(function (l) { return l.padrao.test(url.hostname); })[0];
    if (loja) {
      gtag("event", "click_oferta", { loja: loja.loja, item_name: nomeDoProduto(a) });
    }
  }, true);
})();
