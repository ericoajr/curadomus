// Card de oferta compartilhado do Cura Domus — o mesmo card em todas as
// páginas que exibem ofertas de promocoes.json (promocoes, dia-das-criancas,
// home e ofertas sugeridas nas receitas).
//
// Uso:
//   <script src="/assets/js/oferta-card.js"></script>
//   lista.innerHTML = ofertas.map(CuraOfertaCard.criar).join("");
//
// O script injeta o próprio CSS e o modal de histórico (aberto pelo botão
// "Ver histórico" do card, com o mesmo gráfico de fraldas.html), então não depende da paleta nem do
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

    .oc-modal { border: 1px solid var(--border, #e7dfd1); border-radius: 14px; padding: 26px; background: var(--background, #fbf7f1); color: var(--ink, #2b241e); width: min(650px, calc(100% - 24px)); max-height: 90dvh; overflow: auto; }
    .oc-modal::backdrop { background: #20180db3; }
    .oc-modal h2 { font-size: 27px; line-height: 1.15; margin: 9px 0 18px; }
    .oc-close { border: 1px solid var(--border, #e7dfd1); background: #fff; border-radius: 50%; width: 36px; height: 36px; flex-shrink: 0; font-size: 20px; cursor: pointer; }
    .oc-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .oc-metric { background: var(--cream, var(--cream-deep, #f3ecdf)); padding: 12px; border-radius: 7px; }
    .oc-metric small { display: block; font-size: 9px; color: var(--muted-ink, #7a6e60); }
    .oc-metric strong { font-size: 15px; color: var(--primary, #6e5334); }
    .oc-chart { margin-top: 22px; width: 100%; }
    .oc-chart svg { width: 100%; height: auto; display: block; }
    .oc-history-table { max-height: 230px; overflow: auto; margin-top: 18px; }
    .oc-history-table table { width: 100%; border-collapse: collapse; font-size: 11px; }
    .oc-history-table th { text-align: left; position: sticky; top: 0; background: var(--background, #fbf7f1); }
    .oc-history-table th:last-child, .oc-history-table td:last-child { text-align: right; }
    .oc-history-table td, .oc-history-table th { padding: 9px 5px; border-bottom: 1px solid var(--border, #e7dfd1); }
    .oc-history-note { font-size: 10px; color: var(--muted-ink, #7a6e60); margin-top: 13px; }
    @media (max-width: 600px) {
      .oc-modal { padding: 18px; }
      .oc-metric { padding: 10px; }
      .oc-metric strong { font-size: 13px; }
    }
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

  function formatarBRL(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function extrairHistorico(produto) {
    var historico = Array.isArray(produto.historico) ? produto.historico : [];
    return historico
      .map(function (item) { return { data: (item && item.data) || "", preco: Number(item && item.preco) }; })
      .filter(function (item) { return item.data && Number.isFinite(item.preco); });
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
    var historico = extrairHistorico(produto);
    var classificacao = escapeHTML(CLASSIFICACOES[(produto.analise || {}).classificacao] || "Preço analisado");
    var motivo = escapeHTML(motivoAnalise(produto));
    var nivelChave = nivelVisual(produto);
    var nivel = NIVEIS[nivelChave];
    var textoAnaliseClass = nivelChave === "MONITORADO" ? "oc-muted" : "oc-primary";
    var dadosHistorico = escapeHTML(JSON.stringify({ titulo: produto.titulo || "Histórico de preços", preco: produto.precoPromocao, historico: historico }));

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
              ${historico.length ? `
                <button type="button" data-historico="${dadosHistorico}"
                  class="oc-btn-outline oc-primary rounded-lg border px-3 py-2 text-xs font-bold transition">
                  Ver histórico
                </button>` : ""}
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

  // ---------- Modal de histórico ----------
  // Mesmo histórico de fraldas.html: métricas, gráfico da trajetória e os
  // registros coletados.
  var modal = null;

  function numero(value) {
    if (value === null || value === undefined || value === "") return null;
    var limpo = typeof value === "string"
      ? value.replace(/R\$|\s/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", ".")
      : value;
    var n = Number(limpo);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  function dataBR(value) {
    var m = String(value == null ? "" : value).match(/^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}))?$/);
    if (!m) return NaN;
    var ano = +m[3], mes = +m[2] - 1, dia = +m[1], hora = +(m[4] || 0), minuto = +(m[5] || 0);
    if (hora > 23 || minuto > 59) return NaN;
    var n = Date.UTC(ano, mes, dia, hora, minuto);
    var d = new Date(n);
    return d.getUTCFullYear() === ano && d.getUTCMonth() === mes && d.getUTCDate() === dia ? n : NaN;
  }

  function grafico(rows) {
    if (rows.length < 2) return '<p class="oc-history-note">Precisamos de pelo menos duas observações para desenhar o gráfico.</p>';
    var precos = rows.map(function (r) { return r.preco; });
    var lo = Math.min.apply(null, precos), hi = Math.max.apply(null, precos), spread = hi - lo || lo * .05;
    var inicio = rows[0].time, fim = rows[rows.length - 1].time;
    var x = function (r) { return 55 + ((r.time - inicio) / (fim - inicio || 1)) * 495; };
    var y = function (r) { return 160 - ((r.preco - lo) / (spread || 1)) * 120; };
    var pontos = rows.map(function (r) { return x(r).toFixed(2) + "," + y(r).toFixed(2); }).join(" ");
    var primeira = escapeHTML(rows[0].data), ultima = escapeHTML(rows[rows.length - 1].data);
    return `<svg viewBox="0 0 600 215" role="img" aria-label="Trajetória dos preços coletados de ${primeira} a ${ultima}">
      <line x1="55" y1="40" x2="550" y2="40" stroke="#e7dfd1"/>
      <line x1="55" y1="160" x2="550" y2="160" stroke="#e7dfd1"/>
      <text x="5" y="44" fill="#716557" font-size="10">${escapeHTML(formatarBRL(hi))}</text>
      <text x="5" y="164" fill="#716557" font-size="10">${escapeHTML(formatarBRL(lo))}</text>
      <polyline points="${pontos}" fill="none" stroke="#6e5334" stroke-width="2.5" stroke-linejoin="round"/>
      ${rows.map(function (r) {
        return `<circle cx="${x(r).toFixed(2)}" cy="${y(r).toFixed(2)}" r="2.5" fill="#6e5334"><title>${escapeHTML(r.data)}: ${escapeHTML(formatarBRL(r.preco))}</title></circle>`;
      }).join("")}
      <text x="55" y="193" fill="#716557" font-size="10">${primeira}</text>
      <text x="550" y="193" text-anchor="end" fill="#716557" font-size="10">${ultima}</text>
    </svg>`;
  }

  function garantirModal() {
    if (modal) return modal;
    modal = document.createElement("dialog");
    modal.className = "oc-modal";
    modal.setAttribute("aria-labelledby", "ocModalTitulo");
    modal.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="oc-primary text-[10px] font-bold uppercase tracking-[.2em]">Histórico coletado</p>
          <h2 id="ocModalTitulo" class="oc-serif font-semibold"></h2>
        </div>
        <button type="button" class="oc-close" data-fechar-historico aria-label="Fechar histórico">×</button>
      </div>
      <div data-metricas class="oc-metrics"></div>
      <div data-grafico class="oc-chart"></div>
      <p data-periodo class="oc-history-note"></p>
      <div class="oc-history-table">
        <table>
          <caption class="oc-primary text-[10px] font-bold uppercase tracking-[.2em]" style="text-align:left;padding:10px 0">Registros de preço</caption>
          <thead><tr><th scope="col">Data</th><th scope="col">Preço</th></tr></thead>
          <tbody data-tabela></tbody>
        </table>
      </div>
      <p class="oc-history-note">
        O histórico representa os registros coletados pela Cura Domus. O gráfico liga as
        observações coletadas, sem estimar preços nos dias sem registro. Preços, estoque e
        condições podem mudar a qualquer momento.
      </p>
    `;
    modal.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-fechar-historico]")) return modal.close();
      if (ev.target !== modal) return;
      var r = modal.getBoundingClientRect();
      if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) modal.close();
    });
    document.body.appendChild(modal);
    return modal;
  }

  function abrirHistorico(dados) {
    var m = garantirModal();
    var rows = extrairHistorico(dados)
      .map(function (r) { return { data: r.data, preco: r.preco, time: dataBR(r.data) }; })
      .filter(function (r) { return Number.isFinite(r.time); })
      .sort(function (a, b) { return a.time - b.time; });

    m.querySelector("#ocModalTitulo").textContent = dados.titulo || "Histórico de preços";

    if (!rows.length) {
      m.querySelector("[data-metricas]").innerHTML = "";
      m.querySelector("[data-grafico]").innerHTML = '<p class="oc-history-note">Histórico insuficiente para este produto.</p>';
      m.querySelector("[data-periodo]").textContent = "";
      m.querySelector("[data-tabela]").innerHTML = "";
    } else {
      var precos = rows.map(function (r) { return r.preco; });
      var media = precos.reduce(function (soma, p) { return soma + p; }, 0) / precos.length;
      var atual = numero(dados.preco);
      if (atual === null) atual = precos[precos.length - 1];
      m.querySelector("[data-metricas]").innerHTML = [["Preço atual", atual], ["Menor coletado", Math.min.apply(null, precos)], ["Média dos registros", media]]
        .map(function (item) { return `<div class="oc-metric"><small>${item[0]}</small><strong>${formatarBRL(item[1])}</strong></div>`; })
        .join("");
      m.querySelector("[data-grafico]").innerHTML = grafico(rows);
      m.querySelector("[data-periodo]").textContent = rows.length + " registros · " + rows[0].data + " a " + rows[rows.length - 1].data;
      m.querySelector("[data-tabela]").innerHTML = rows.slice().reverse().map(function (r) {
        return `<tr><td>${escapeHTML(r.data)}</td><td>${formatarBRL(r.preco)}</td></tr>`;
      }).join("");
    }

    if (!m.open) m.showModal();
  }

  var estilo = document.createElement("style");
  estilo.textContent = CSS;
  document.head.appendChild(estilo);

  document.addEventListener("click", function (ev) {
    var botao = ev.target instanceof Element ? ev.target.closest("[data-historico]") : null;
    if (!botao) return;
    try {
      var dados = JSON.parse(botao.dataset.historico);
      abrirHistorico(dados);
    } catch (e) {
      console.warn("Não foi possível abrir o histórico.");
    }
  });


  window.CuraOfertaCard = { criar: criar, nivelVisual: nivelVisual };
})();
