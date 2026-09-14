// Configuração compartilhada do Tailwind (CDN) para todas as páginas do
// Cura Domus. Deve ser carregado DEPOIS de <script src="https://cdn.tailwindcss.com">.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--ink)',
        card: 'var(--card)',
        border: 'var(--border)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-ink)',
        primary: 'var(--primary)',
        'primary-foreground': '#fff',
        accent: 'var(--accent)',
        whats: 'var(--whats)',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(30,25,20,0.04), 0 2px 8px rgba(30,25,20,0.04)',
        card: '0 10px 30px -12px rgba(30,25,20,0.18)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    }
  }
};
