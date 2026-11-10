// Card de oferta compartilhado do Cura Domus — o mesmo card em todas as
// páginas que exibem ofertas de promocoes.json (promocoes, dia-das-criancas,
// home e ofertas sugeridas nas receitas).
//
// Uso:
//   <script src="/assets/js/oferta-card.js"></script>
//   lista.innerHTML = ofertas.map(CuraOfertaCard.criar).join("");
//
// O script injeta o próprio CSS, então não depende da paleta nem do
// tailwind.config da página. As cores usam as variáveis --cream/--muted-ink
// quando a página as define, com o mesmo valor padrão como fallback.
// O clique em "Ver produto" é medido pelo analytics.js (click_oferta), que
// lê o título do <h3> dentro do <article>.
(function () {
  var CSS = `
    .oc-card { border-color: var(--border, #e7dfd1); background: var(--card, #fff); animation: oc-fade-up .35s ease both; }
    .oc-media { background: var(--cream, var(--cream-deep, #f3ecdf)); }
    .oc-muted { color: var(--muted-ink, #7a6e60); }
    .oc-primary { color: var(--primary, #6e5334); }
    .oc-bg-primary { background: var(--primary, #6e5334); }
    .oc-serif { font-family: "Cormorant Garamond", serif; letter-spacing: -.015em; }
    .oc-shadow { box-shadow: 0 2px 10px rgba(43,36,30,.06); }
    .oc-shadow:hover { box-shadow: 0 12px 32px rgba(43,36,30,.12); }
    @keyframes oc-fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .oc-card { animation: none; } }

  `;

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeUrl(value) {
    try {
      var url = new URL(value || "", window.location.href);
      if (url.protocol !== "http:" && url.protocol !== "https:") return "#";
      return escapeHTML(url.href);
    } catch (e) {
      return "#";
    }
  }

  // "Preço de 09/11 às 14:30" a partir de dataOferta ("dd/MM/yyyy HH:mm", horário de Brasília).
  // A Licença do Associados (2(i)) pede data/horário perto do preço.
  function quando(dataOferta) {
    var m = /^(\d{2})\/(\d{2})\/\d{4}\s+(\d{2}):(\d{2})/.exec(String(dataOferta || "").trim());
    return m ? "Preço de " + m[1] + "/" + m[2] + " às " + m[3] + ":" + m[4] : "";
  }

  function criar(produto) {
    var titulo = escapeHTML(produto.titulo || "Produto");
    var imagem = safeUrl(produto.imagem);
    var link = safeUrl(produto.linkAfiliado || "#");
    var categoria = escapeHTML(produto.categoria || "");
    var precoAtual = escapeHTML(produto.precoPromocao || "");
    var precoOriginal = escapeHTML(produto.precoOriginal || "");
    var desconto = escapeHTML(String(produto.desconto || "").trim());
    var data = escapeHTML(quando(produto.dataOferta));

    return `
      <article class="oc-card oc-shadow flex flex-col overflow-hidden rounded-2xl border transition hover:-translate-y-0.5 sm:flex-row">
        <div class="oc-media relative flex shrink-0 items-center justify-center p-5 sm:w-44">
          <img src="${imagem}" alt="${titulo}" loading="lazy" class="h-32 w-full object-contain sm:h-36">
        </div>

        <div class="flex flex-1 flex-col gap-3 p-5">
          <div>
            ${categoria ? `<p class="oc-muted mb-1 text-[10px] font-bold uppercase tracking-[.16em]">${categoria}</p>` : ""}
            <h3 class="mt-1.5 text-[15px] font-bold leading-snug">${titulo}</h3>
          </div>

          <div class="mt-auto flex flex-wrap items-end justify-between gap-3">
            <div>
              ${precoOriginal ? `<span class="oc-muted block text-xs line-through">R$ ${precoOriginal}</span>` : ""}
              <strong class="oc-serif oc-primary text-3xl">R$ ${precoAtual}</strong>
              ${desconto ? `<span class="oc-muted mt-1 block text-[10px]">${desconto} informado pela loja</span>` : ""}
              ${data ? `<span class="oc-muted mt-1 block text-[10px]">${data}</span>` : ""}
            </div>

            <div class="flex flex-wrap gap-2">
              <a href="${link}" target="_blank" rel="sponsored nofollow noopener noreferrer"
                class="oc-bg-primary rounded-lg px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">
                Ver produto ↗
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  var estilo = document.createElement("style");
  estilo.textContent = CSS;
  document.head.appendChild(estilo);


  window.CuraOfertaCard = { criar: criar, quando: quando };
})();
