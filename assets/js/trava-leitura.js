// Trava de leitura do Cura Domus: oferta com preço lido há mais de 20 h não
// aparece no site. O promobot já não publica essas ofertas, mas com o app
// parado o JSON antigo continua no ar; por isso o navegador aplica o mesmo
// limite (vitrine.trava-leitura-horas no promobot).
//
// Uso (carregar antes do script da página):
//   <script src="/assets/js/trava-leitura.js"></script>
//   ofertas = CuraLeitura.ofertas(data.ofertas);
//   itens   = CuraLeitura.filtrar(bloco.itens, i => i.oferta);
//   CuraLeitura.listas(d.listas);   // limpa item.produtos de cada lista
(function () {
  var LIMITE_HORAS = 20;

  // dataOferta vem como "dd/MM/yyyy HH:mm", no horário de Brasília (UTC-3, sem horário de verão).
  function instante(texto) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/.exec(String(texto || "").trim());
    if (!m) return NaN;
    return Date.UTC(+m[3], +m[2] - 1, +m[1], +m[4] + 3, +m[5]);
  }

  // Sem data conta como velha, igual ao promobot.
  function recente(oferta) {
    var t = instante(oferta && oferta.dataOferta);
    return Number.isFinite(t) && Date.now() - t <= LIMITE_HORAS * 60 * 60 * 1000;
  }

  function filtrar(lista, oferta) {
    return (Array.isArray(lista) ? lista : []).filter(function (x) {
      return recente(oferta ? oferta(x) : x);
    });
  }

  function listas(ls) {
    (ls || []).forEach(function (l) {
      (l.itens || []).forEach(function (i) {
        i.produtos = filtrar(i.produtos);
      });
    });
    return ls || [];
  }

  window.CuraLeitura = {
    LIMITE_HORAS: LIMITE_HORAS,
    recente: recente,
    ofertas: function (lista) { return filtrar(lista); },
    filtrar: filtrar,
    listas: listas
  };
})();
