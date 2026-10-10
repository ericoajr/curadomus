// Menu principal do Cura Domus — o mesmo em todas as páginas, exceto a
// cta.html: página de conversão, sem saídas além do convite do WhatsApp.
// Uso: no lugar do menu, <div id="menu-principal"></div> seguido de
// <script src="/assets/js/menu.js"></script> (renderiza na hora, sem salto).
//
// É um <div role="navigation"> com CSS próprio (prefixo cd-menu) para não
// herdar estilos de "nav" das páginas que têm CSS próprio (ex.: fraldas.html)
// e para funcionar com ou sem Tailwind.
//
// Para incluir/remover uma página, edite ITENS. "ate" (AAAA-MM-DD) esconde
// itens sazonais automaticamente depois dessa data.
(function () {
  var ITENS = [
    { href: "/index.html", texto: "Início", paginas: ["", "index"] },
    { href: "/promocoes.html", texto: "Promoções", paginas: ["promocoes"] },
    { href: "/dia-das-criancas.html", texto: "Dia das Crianças", paginas: ["dia-das-criancas"], ate: "2026-10-12" },
    { href: "/fraldas.html", texto: "Fraldas", paginas: ["fraldas"] },
    { href: "/receitas.html", texto: "Receitas", paginas: ["receitas", "receita"] }
  ];
  var CTA = { href: "/cta.html", texto: "Grupos no WhatsApp", paginas: ["cta"] };

  var CSS =
    ".cd-menu{border-bottom:1px solid #E7DFD1;background:#FBF7F1;font-family:Inter,system-ui,sans-serif}" +
    ".cd-menu-in{max-width:72rem;margin:0 auto;padding:12px 24px;display:flex;align-items:center;gap:20px}" +
    ".cd-menu-logo img{height:32px;width:auto;display:block;opacity:.9}" +
    ".cd-menu-links{order:2;margin-left:auto;display:flex;align-items:center;gap:20px;overflow-x:auto;scrollbar-width:none}" +
    ".cd-menu-links::-webkit-scrollbar{display:none}" +
    ".cd-menu a.cd-menu-item{font-size:12px;font-weight:600;color:#6E5334;text-decoration:none;white-space:nowrap;padding:4px 0;border-bottom:2px solid transparent}" +
    ".cd-menu a.cd-menu-item:hover{opacity:.8}" +
    ".cd-menu a.cd-menu-item[aria-current=page]{color:#4E3A22;border-bottom-color:#C9A96A}" +
    ".cd-menu a.cd-menu-cta{order:3;font-size:12px;font-weight:700;color:#fff;background:#25D366;border-radius:999px;padding:7px 14px;white-space:nowrap;text-decoration:none}" +
    ".cd-menu a.cd-menu-cta:hover{background:#128C4A}" +
    ".cd-menu a:focus-visible{outline:3px solid #6E5334;outline-offset:3px}" +
    "@media(max-width:640px){.cd-menu-in{flex-wrap:wrap;gap:10px;padding:10px 16px}" +
    ".cd-menu a.cd-menu-cta{order:2;margin-left:auto}" +
    ".cd-menu-links{order:3;margin-left:0;width:100%;gap:16px}}";

  var pagina = (location.pathname.split("/").pop() || "").replace(/\.html$/, "");
  var d = new Date(); // data local, não UTC
  var hoje = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);

  function link(item, classe) {
    var a = document.createElement("a");
    a.href = item.href;
    a.className = classe;
    a.textContent = item.texto;
    if (item.paginas.indexOf(pagina) >= 0) a.setAttribute("aria-current", "page");
    return a;
  }

  var alvo = document.getElementById("menu-principal");
  if (!alvo) return;

  var estilo = document.createElement("style");
  estilo.textContent = CSS;
  document.head.appendChild(estilo);

  var menu = document.createElement("div");
  menu.className = "cd-menu";
  menu.setAttribute("role", "navigation");
  menu.setAttribute("aria-label", "Menu principal");

  var dentro = document.createElement("div");
  dentro.className = "cd-menu-in";

  var logo = document.createElement("a");
  logo.className = "cd-menu-logo";
  logo.href = "/index.html";
  logo.setAttribute("aria-label", "Cura Domus, início");
  logo.innerHTML = '<img src="/curadomus_logo.png" alt="Cura Domus" width="120" height="32">';

  var links = document.createElement("div");
  links.className = "cd-menu-links";
  ITENS.filter(function (i) { return !i.ate || hoje <= i.ate; })
    .forEach(function (i) { links.appendChild(link(i, "cd-menu-item")); });

  dentro.append(logo, link(CTA, "cd-menu-cta"), links);
  menu.appendChild(dentro);
  alvo.replaceWith(menu);
})();
