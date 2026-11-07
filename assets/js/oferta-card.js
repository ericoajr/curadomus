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
    .oc-btn-outline { border-color: var(--border, #e7dfd1); }
    .oc-btn-outline:hover { background: var(--cream, var(--cream-deep, #f3ecdf)); }
    @keyframes oc-fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .oc-card { animation: none; } }

    .nivel-badge { display: inline-flex; align-items: center; gap: 5px; border-radius: 999px; padding: 5px 10px; font-size: 10px; font-weight: 800; letter-spacing: .02em; box-shadow: 0 1px 4px rgba(43,36,30,.08); }
    .nivel-destaque { background: var(--primary, #6e5334); color: #fff; border: 1px solid var(--primary, #6e5334); }
    .nivel-oportunidade { background: #e8f5ee; color: #087f5b; border: 1px solid #cce9da; }
    .nivel-bom-preco { background: var(--cream, var(--cream-deep, #f3ecdf)); color: var(--primary, #6e5334); border: 1px solid #d8c39a; }
    .nivel-monitorado { background: rgba(255,255,255,.94); color: var(--muted-ink, #7a6e60); border: 1px solid var(--border, #e7dfd1); }
    .analise-destaque { border-color: #d8c39a !important; background: #fbf3df !important; }
    .analise-oportunidade { border-color: #cce9da !important; background: #f1faf5 !important; }
    .analise-bom-preco { border-color: #d8c39a !important; background: #fbf7ef !important; }
    .analise-monitorado { border-color: var(--border, #e7dfd1) !important; background: var(--background, #fbf7f1) !important; }

  `;

  var NIVEIS = {
    DESTAQUE: { texto: "★ Destaque", badgeClass: "nivel-destaque", analiseClass: "analise-destaque" },
    OPORTUNIDADE: { texto: "✓ Oportunidade", badgeClass: "nivel-oportunidade", analiseClass: "analise-oportunidade" },
    BOM_PRECO: { texto: "✓ Bom preço", badgeClass: "nivel-bom-preco", analiseClass: "analise-bom-preco" },
    MONITORADO: { texto: "Monitorado", badgeClass: "nivel-monitorado", analiseClass: "analise-monitorado" }
  };

  var CLASSIFICACOES = {
    EXCELENTE: "Destaque",
    MUITO_BOA: "Oportunidade",
    BOA: "Bom preço",
    INTERESSANTE: "Preço interessante",
    MODERADA: "Vale acompanhar",
    FRACA: "Em monitoramento",
    SEM_HISTORICO: "Histórico em formação"
  };

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

  function nivelVisual(produto) {
    var classificacao = (produto.analise && produto.analise.classificacao) || "";
    if (classificacao === "EXCELENTE") return "DESTAQUE";
    if (classificacao === "MUITO_BOA") return "OPORTUNIDADE";
    if (classificacao === "BOA") return "BOM_PRECO";
    if (CLASSIFICACOES[classificacao]) return "MONITORADO";
    // Fallback para payloads antigos sem classificação.
    return produto.destaque === true ? "DESTAQUE" : "MONITORADO";
  }

  function motivoAnalise(produto) {
    var analise = produto.analise || {};
    if (analise.semHistorico === true) return "Ainda estamos formando o histórico deste produto.";
    return analise.motivoPrincipal || produto.menorPrecoMensagem || "Preço acompanhado pela Cura Domus.";
  }

  function criar(produto) {
    var titulo = escapeHTML(produto.titulo || "Produto");
    var imagem = safeUrl(produto.imagem);
    var link = safeUrl(produto.linkAfiliado || "#");
    var categoria = escapeHTML(produto.categoria || "");
    var precoAtual = escapeHTML(produto.precoPromocao || "");
    var precoOriginal = escapeHTML(produto.precoOriginal || "");
    var desconto = escapeHTML(String(produto.desconto || "").trim());
    var classificacao = escapeHTML(CLASSIFICACOES[(produto.analise || {}).classificacao] || "Preço analisado");
    var motivo = escapeHTML(motivoAnalise(produto));
    var nivelChave = nivelVisual(produto);
    var nivel = NIVEIS[nivelChave];
    var textoAnaliseClass = nivelChave === "MONITORADO" ? "oc-muted" : "oc-primary";

    return `
      <article class="oc-card oc-shadow flex flex-col overflow-hidden rounded-2xl border transition hover:-translate-y-0.5 sm:flex-row">
        <div class="oc-media relative flex shrink-0 items-center justify-center p-5 sm:w-44">
          <span class="nivel-badge ${nivel.badgeClass} absolute left-3 top-3">${nivel.texto}</span>
          <img src="${imagem}" alt="${titulo}" loading="lazy" class="h-32 w-full object-contain sm:h-36">
        </div>

        <div class="flex flex-1 flex-col gap-3 p-5">
          <div>
            ${categoria ? `<p class="oc-muted mb-1 text-[10px] font-bold uppercase tracking-[.16em]">${categoria}</p>` : ""}
            <p class="oc-primary text-[10px] font-bold uppercase tracking-[.12em]">${classificacao}</p>
            <h3 class="mt-1.5 text-[15px] font-bold leading-snug">${titulo}</h3>
            <div class="mt-3 rounded-xl border px-3 py-2.5 ${nivel.analiseClass}">
              <p class="text-[11px] font-semibold leading-relaxed ${textoAnaliseClass}">${motivo}</p>
            </div>
          </div>

          <div class="mt-auto flex flex-wrap items-end justify-between gap-3">
            <div>
              ${precoOriginal ? `<span class="oc-muted block text-xs line-through">R$ ${precoOriginal}</span>` : ""}
              <strong class="oc-serif oc-primary text-3xl">R$ ${precoAtual}</strong>
              ${desconto ? `<span class="oc-muted mt-1 block text-[10px]">${desconto} informado pela loja</span>` : ""}
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


  window.CuraOfertaCard = { criar: criar, nivelVisual: nivelVisual };
})();
