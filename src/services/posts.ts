import type { PostDocument, PostPagination } from '../types';

export const fallbackPosts: PostDocument[] = [
  {
    uid: 'modernizando-uma-aplicacao-next',
    first_publication_date: '2026-07-07T12:00:00+0000',
    data: {
      title: 'Modernizando uma aplicação Next.js',
      subtitle:
        'Como atualizar uma base legada sem perder cobertura de testes.',
      author: 'Bruno Alves',
      banner: {
        url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80',
        alt: 'Editor de código aberto em um notebook',
      },
      content: [
        {
          heading: 'Por que modernizar?',
          body: [
            {
              type: 'paragraph',
              text: 'Atualizar dependências reduz riscos de segurança, melhora a experiência de desenvolvimento e remove workarounds de runtime que se acumulam em projetos antigos.',
              spans: [],
            },
          ],
        },
        {
          heading: 'Como fazer com segurança',
          body: [
            {
              type: 'paragraph',
              text: 'A estratégia usada aqui preserva o Pages Router, adiciona fallback local para o CMS e mantém testes de comportamento com cobertura mínima de 90%.',
              spans: [],
            },
          ],
        },
      ],
    },
  },
  {
    uid: 'testes-com-vitest',
    first_publication_date: '2026-07-06T12:00:00+0000',
    data: {
      title: 'Testes com Vitest',
      subtitle:
        'Uma suíte rápida para validar páginas, componentes e integrações.',
      author: 'Bruno Alves',
      banner: {
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
        alt: 'Pessoa trabalhando com testes automatizados',
      },
      content: [
        {
          heading: 'Feedback curto',
          body: [
            {
              type: 'paragraph',
              text: 'Vitest mantém a suíte rápida e funciona bem com Testing Library para validar o que o usuário realmente enxerga.',
              spans: [],
            },
          ],
        },
      ],
    },
  },
];

export function getFallbackPostsPage(): PostPagination {
  return {
    next_page: null,
    results: fallbackPosts.map(({ uid, first_publication_date, data }) => ({
      uid,
      first_publication_date,
      data: {
        title: data.title,
        subtitle: data.subtitle,
        author: data.author,
      },
    })),
  };
}

export function getFallbackPostBySlug(slug: string): PostDocument {
  return fallbackPosts.find(post => post.uid === slug) ?? fallbackPosts[0];
}
