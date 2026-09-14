// Fonte única de dados dos 4 grupos do Cura Domus.
// Usado pela página geral (cta.html) para montar os cards de escolha, e
// pelas páginas específicas (grupo-landing.js) para preencher o conteúdo
// que muda de grupo para grupo (textos, imagem, link do WhatsApp, exemplos).
//
// Link do WhatsApp de cada grupo: NÃO ALTERAR sem confirmar com o time —
// são os mesmos links já em uso hoje.
window.GRUPOS_CURA_DOMUS = {
  imaginario: {
    slug: "imaginario",
    nome: "Formação do Imaginário",
    href: "imaginario.html",
    imagemCard: "imaginario.png",
    whatsappUrl: "https://chat.whatsapp.com/EAN1D7qKG3m5iFAmh7Hr3F",
    badge: "Formação do Imaginário · grupo gratuito",
    tituloLinha1: "Livros infantis que valem a pena,",
    tituloDestaque: "sem pagar a mais.",
    subtitulo: "Literatura, leitura e formação do imaginário: a gente garimpa os livros, confere o histórico de preço e avisa no grupo na hora.",
    trustItems: [
      { titulo: "Seleção com critério", texto: "Livros escolhidos, não é vitrine genérica." },
      { titulo: "Preço conferido", texto: "Histórico acompanhado antes de avisar." },
      { titulo: "Sem spam", texto: "Só o que é do tema do grupo." },
    ],
    chatTitulo: "Cura Domus · Formação do Imaginário",
    exemplos: [
      "📚 <strong>Coleção de contos clássicos</strong> com 33% off — separei porque vale a leitura.",
      "🔻 Menor preço em 30 dias num box de literatura infantil.",
      "📖 Livro ilustrado com cupom — link aqui embaixo.",
    ],
    ctaLabel: "QUERO RECEBER OFERTAS DE LIVROS",
    entrarLabel: "Entrar no grupo Formação do Imaginário",
    stickyLabel: "Receba ofertas de livros",
    finalDescricao: "Um toque e você já está recebendo as ofertas de livros e formação do imaginário.",
    seo: {
      title: "Cura Domus · Formação do Imaginário — ofertas de livros no WhatsApp",
      description: "Grupo gratuito no WhatsApp com ofertas verificadas de livros infantis e literatura para a formação do imaginário. A gente garimpa, verifica e avisa.",
      canonical: "https://curadomus.com.br/html/imaginario.html",
      ogImage: "https://curadomus.com.br/html/imaginario.png",
    },
  },

  educacao: {
    slug: "educacao",
    nome: "Educação e Escola",
    href: "educacao.html",
    imagemCard: "educacao.png",
    whatsappUrl: "https://chat.whatsapp.com/Dq5cuiWi5vYAQrXq5c2DuW",
    badge: "Educação e Escola · grupo gratuito",
    tituloLinha1: "Rotina escolar mais leve,",
    tituloDestaque: "sem pagar a mais.",
    subtitulo: "Material escolar, mochila, uniforme e organização da rotina: a gente garimpa, confere o histórico de preço e avisa no grupo na hora.",
    trustItems: [
      { titulo: "Foco na rotina", texto: "Do material à organização do dia a dia." },
      { titulo: "Preço conferido", texto: "Histórico acompanhado antes de avisar." },
      { titulo: "Sem spam", texto: "Só o que é do tema do grupo." },
    ],
    chatTitulo: "Cura Domus · Educação e Escola",
    exemplos: [
      "✏️ <strong>Kit de material escolar</strong> com 28% off — separei pra vocês.",
      "🔻 Menor preço em 30 dias numa mochila com rodinhas.",
      "🎒 Uniforme escolar com cupom — link aqui embaixo.",
    ],
    ctaLabel: "QUERO RECEBER OFERTAS PARA EDUCAÇÃO",
    entrarLabel: "Entrar no grupo Educação e Escola",
    stickyLabel: "Receba ofertas de educação",
    finalDescricao: "Um toque e você já está recebendo as ofertas para a rotina escolar.",
    seo: {
      title: "Cura Domus · Educação e Escola — ofertas no WhatsApp",
      description: "Grupo gratuito no WhatsApp com ofertas verificadas de material escolar e itens para a rotina de educação. A gente garimpa, verifica e avisa.",
      canonical: "https://curadomus.com.br/html/educacao.html",
      ogImage: "https://curadomus.com.br/html/educacao.png",
    },
  },

  lar: {
    slug: "lar",
    nome: "Gestão do Lar",
    href: "lar.html",
    imagemCard: "gestao.png",
    whatsappUrl: "https://chat.whatsapp.com/KFFiBvHSKVjKUrQmz0ZNwl",
    badge: "Gestão do Lar · grupo gratuito",
    tituloLinha1: "A rotina da casa mais prática,",
    tituloDestaque: "pagando menos.",
    subtitulo: "Cozinha, organização e utilidades domésticas: a gente garimpa, confere o histórico de preço e avisa no grupo na hora.",
    trustItems: [
      { titulo: "Foco na casa", texto: "Cozinha, organização e rotina." },
      { titulo: "Preço conferido", texto: "Histórico acompanhado antes de avisar." },
      { titulo: "Sem spam", texto: "Só o que é do tema do grupo." },
    ],
    chatTitulo: "Cura Domus · Gestão do Lar",
    exemplos: [
      "🏠 <strong>Air fryer 5L</strong> com 37% off — separei pra vocês.",
      "🔻 Menor preço em 30 dias num organizador de armário.",
      "🧺 Cesto organizador com cupom — link aqui embaixo.",
    ],
    ctaLabel: "QUERO RECEBER OFERTAS PARA CASA",
    entrarLabel: "Entrar no grupo Gestão do Lar",
    stickyLabel: "Receba ofertas para casa",
    finalDescricao: "Um toque e você já está recebendo as ofertas pra deixar a rotina de casa mais prática.",
    seo: {
      title: "Cura Domus · Gestão do Lar — ofertas no WhatsApp",
      description: "Grupo gratuito no WhatsApp com ofertas verificadas de cozinha, organização e utilidades domésticas. O Cura Domus acompanha preços, verifica e avisa.",
      canonical: "https://curadomus.com.br/html/lar.html",
      ogImage: "https://curadomus.com.br/html/gestao.png",
    },
  },

  bebes: {
    slug: "bebes",
    nome: "Bebês e Primeira Infância",
    href: "bebes.html",
    imagemCard: "bebe.jpg",
    whatsappUrl: "https://chat.whatsapp.com/C84J6GtX87t6a0HFp2x5EX",
    badge: "Bebês e Primeira Infância · grupo gratuito",
    tituloLinha1: "Enxoval e primeira infância,",
    tituloDestaque: "sem pagar a mais.",
    subtitulo: "Fralda, higiene, papinha, carrinho e berço: a gente garimpa, verifica o preço e avisa no grupo na hora.",
    trustItems: [
      { titulo: "Fase por fase", texto: "Do enxoval aos primeiros anos." },
      { titulo: "Preço conferido", texto: "Histórico acompanhado antes de avisar." },
      { titulo: "Sem spam", texto: "Só o que é do tema do grupo." },
    ],
    chatTitulo: "Cura Domus · Bebês e Primeira Infância",
    exemplos: [
      "👶 <strong>Kit higiene de bebê</strong> com 42% off — vi e já separei pra vocês.",
      "🔻 Menor preço em 30 dias no pacote de fraldas tamanho M.",
      "🍼 Cadeirinha de alimentação com cupom — link aqui embaixo.",
    ],
    ctaLabel: "QUERO RECEBER OFERTAS PARA BEBÊS",
    entrarLabel: "Entrar no grupo Bebês e Primeira Infância",
    stickyLabel: "Receba ofertas de Bebês",
    finalDescricao: "Um toque e você já está recebendo as ofertas de bebês e primeira infância.",
    seo: {
      title: "Cura Domus · Bebês e Primeira Infância — ofertas no WhatsApp",
      description: "Receba ofertas de produtos para bebês e primeira infância no WhatsApp. O Cura Domus acompanha preços, verifica oportunidades e avisa.",
      canonical: "https://curadomus.com.br/html/bebes.html",
      ogImage: "https://curadomus.com.br/html/bebe.jpg",
    },
  },
};

// Conteúdo comum às 4 páginas específicas (não muda por grupo).
window.CURA_DOMUS_COMO_FUNCIONA = [
  { titulo: "A gente encontra", texto: "Acompanhamos os preços dos produtos relevantes para cada grupo." },
  { titulo: "A gente verifica", texto: "Comparamos com o histórico para ver se a oferta realmente vale a pena." },
  { titulo: "A gente avisa", texto: "Quando encontra algo bom, manda o alerta direto no grupo do WhatsApp." },
];

window.CURA_DOMUS_FAQ_HISTORICO = {
  pergunta: "Como vocês sabem se uma oferta vale a pena?",
  resposta: "A gente acompanha o histórico de preço dos produtos e usa isso para identificar quando um preço está realmente bom — sem prometer que é sempre o menor preço histórico.",
};
