// Google Analytics 4 e Meta Pixel do Cura Domus, compartilhados por todas as páginas.
// Incluir no <head>: <script src="/assets/js/analytics.js"></script>
//
// - Carrega o gtag e envia "origem" (?origem= da URL, "direto" se ausente) e
//   "pagina" com todos os eventos. Cadastre ambos como dimensões
//   personalizadas (escopo de evento) no GA para vê-los nos relatórios.
// - Mede, em qualquer página, cliques em convites do WhatsApp
//   (click_whatsapp) e em links de oferta das lojas (click_oferta). Rolagem e
//   cliques de saída genéricos ficam com a medição otimizada do próprio GA.
// - Meta Pixel: PageView em todas as páginas; GroupClick e OfertaClick nos
//   mesmos cliques acima.
// - Páginas com o tracking.js (cta.html) já enviam click_whatsapp (e o
//   GroupClick do Pixel) com mais contexto; aqui esses eventos são ignorados
//   nelas para não contar em dobro.
(function () {
  var GA_ID = "G-YLVWEXK5VJ";
  var PIXEL_ID = "1745672329989022";

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

  // Meta Pixel (snippet oficial, sem a parte <noscript>).
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");

  function pixel(evento, dados) {
    try { window.fbq("trackCustom", evento, dados); } catch (_) { /* medição nunca bloqueia o clique */ }
  }

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
      var dadosWhats = {
        grupo_destino: GRUPO_POR_CONVITE[url.pathname.slice(1)] || "desconhecido",
        local: a.dataset.whats || a.id || "link"
      };
      gtag("event", "click_whatsapp", dadosWhats);
      pixel("GroupClick", { group_name: dadosWhats.grupo_destino, cta_position: dadosWhats.local, pagina: pagina });
      return;
    }

    var loja = LOJAS.filter(function (l) { return l.padrao.test(url.hostname); })[0];
    if (loja) {
      var dadosOferta = { loja: loja.loja, item_name: nomeDoProduto(a) };
      gtag("event", "click_oferta", dadosOferta);
      pixel("OfertaClick", { loja: dadosOferta.loja, content_name: dadosOferta.item_name, pagina: pagina });
    }
  }, true);
})();
