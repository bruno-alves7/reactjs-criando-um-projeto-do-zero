import type { PostDocument, PostPagination } from '../types';

export const fallbackPosts: PostDocument[] = [
  {
    uid: 'como-utilizar-hooks',
    first_publication_date: '2021-03-15T19:25:28+0000',
    data: {
      title: 'Como utilizar Hooks',
      subtitle: 'Pensando em sincronização em vez de ciclos de vida',
      author: 'Joseph Oliveira',
      banner: {
        url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80',
        alt: 'Editor de código aberto em um notebook',
      },
      content: [
        {
          heading: 'Proin et varius',
          body: [
            {
              type: 'paragraph',
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              spans: [],
            },
          ],
        },
        {
          heading: 'Cras laoreet mi',
          body: [
            {
              type: 'paragraph',
              text: 'Nullam dolor sapien, vulputate eu diam at, condimentum hendrerit tellus. Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.',
              spans: [],
            },
          ],
        },
      ],
    },
  },
  {
    uid: 'criando-um-app-cra-do-zero',
    first_publication_date: '2021-03-25T19:27:35+0000',
    data: {
      title: 'Criando um app CRA do zero',
      subtitle:
        'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
      author: 'Danilo Vieira',
      banner: {
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
        alt: 'Pessoa trabalhando com testes automatizados',
      },
      content: [
        {
          heading: 'Introdução',
          body: [
            {
              type: 'paragraph',
              text: 'Tudo sobre como criar a sua primeira aplicação utilizando Create React App.',
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
