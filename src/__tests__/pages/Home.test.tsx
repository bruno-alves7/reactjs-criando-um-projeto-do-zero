import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GetStaticPropsContext } from 'next';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { ParsedUrlQuery } from 'querystring';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App, { getStaticProps } from '../../pages';
import { fallbackPosts } from '../../services/posts';
import { getPrismicClient } from '../../services/prismic';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

interface GetStaticPropsResult {
  props: HomeProps;
}

const mockedGetByTypeReturn: PostPagination = {
  next_page: 'link',
  results: [
    {
      uid: 'como-utilizar-hooks',
      first_publication_date: '2021-03-15T19:25:28+0000',
      data: {
        title: 'Como utilizar Hooks',
        subtitle: 'Pensando em sincronização em vez de ciclos de vida',
        author: 'Joseph Oliveira',
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
      },
    },
  ],
};

vi.mock('@prismicio/client', () => ({}));
vi.mock('../../services/prismic', () => ({
  hasPrismicEndpoint: vi.fn(() => Boolean(process.env.PRISMIC_API_ENDPOINT)),
  getPrismicClient: vi.fn(),
}));

const mockedPrismic = vi.mocked(getPrismicClient);
const mockedFetch = vi.fn();
const mockedPush = vi.fn();

function RouterWrapper({ children }: { children: React.ReactNode }) {
  const MockedRouterContext = RouterContext as React.Context<unknown>;

  return (
    <MockedRouterContext.Provider
      value={{
        push: mockedPush,
      }}
    >
      {children}
    </MockedRouterContext.Provider>
  );
}

describe('Home', () => {
  beforeEach(() => {
    mockedPush.mockResolvedValue(true);
    globalThis.fetch = mockedFetch as unknown as typeof fetch;

    mockedPrismic.mockReturnValue({
      getByType: vi.fn().mockResolvedValue(mockedGetByTypeReturn),
    } as unknown as ReturnType<typeof getPrismicClient>);

    mockedFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        next_page: null,
        results: [
          {
            uid: 'criando-um-app-cra-do-zero',
            first_publication_date: '2021-03-25T19:27:35+0000',
            data: {
              title: 'Criando um app CRA do zero',
              subtitle:
                'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
              author: 'Danilo Vieira',
            },
          },
        ],
      }),
    });
  });

  afterEach(() => {
    delete process.env.PRISMIC_API_ENDPOINT;
  });

  it('should be able to return prismic posts documents using getStaticProps', async () => {
    const getStaticPropsContext: GetStaticPropsContext<ParsedUrlQuery> = {};

    process.env.PRISMIC_API_ENDPOINT = 'https://example.cdn.prismic.io/api/v2';

    const response = (await getStaticProps(
      getStaticPropsContext,
    )) as GetStaticPropsResult;

    expect(response.props.postsPagination.next_page).toEqual(
      mockedGetByTypeReturn.next_page,
    );
    expect(response.props.postsPagination.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockedGetByTypeReturn.results[0]),
        expect.objectContaining(mockedGetByTypeReturn.results[1]),
      ]),
    );
  });

  it('returns fallback posts when Prismic is not configured', async () => {
    const getStaticPropsContext: GetStaticPropsContext<ParsedUrlQuery> = {};

    const response = (await getStaticProps(
      getStaticPropsContext,
    )) as GetStaticPropsResult;

    expect(response.props.postsPagination.results[0].uid).toBe(
      fallbackPosts[0].uid,
    );
  });

  it('returns fallback posts when Prismic request fails', async () => {
    process.env.PRISMIC_API_ENDPOINT = 'https://example.cdn.prismic.io/api/v2';
    mockedPrismic.mockReturnValue({
      getByType: vi.fn().mockRejectedValue(new Error('Prismic unavailable')),
    } as unknown as ReturnType<typeof getPrismicClient>);

    const getStaticPropsContext: GetStaticPropsContext<ParsedUrlQuery> = {};

    const response = (await getStaticProps(
      getStaticPropsContext,
    )) as GetStaticPropsResult;

    expect(response.props.postsPagination.results[0].uid).toBe(
      fallbackPosts[0].uid,
    );
  });

  it('should be able to render posts documents info', () => {
    render(<App postsPagination={mockedGetByTypeReturn} />);

    screen.getByText('Como utilizar Hooks');
    screen.getByText('Pensando em sincronização em vez de ciclos de vida');
    screen.getByText('15 mar 2021');
    screen.getByText('Joseph Oliveira');

    screen.getByText('Criando um app CRA do zero');
    screen.getByText(
      'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
    );
    screen.getByText('25 mar 2021');
    screen.getByText('Danilo Vieira');
  });

  it('should be able to navigate to post page after a click', () => {
    render(<App postsPagination={mockedGetByTypeReturn} />, {
      wrapper: RouterWrapper,
    });

    fireEvent.click(screen.getByText('Como utilizar Hooks'));
    fireEvent.click(screen.getByText('Criando um app CRA do zero'));

    expect(mockedPush).toHaveBeenNthCalledWith(1, '/post/como-utilizar-hooks', {
      scroll: true,
    });
    expect(mockedPush).toHaveBeenNthCalledWith(
      2,
      '/post/criando-um-app-cra-do-zero',
      {
        scroll: true,
      },
    );
  });

  it('should be able to load more posts if available', async () => {
    const postsPagination = {
      ...mockedGetByTypeReturn,
      results: [mockedGetByTypeReturn.results[0]],
    };

    render(<App postsPagination={postsPagination} />);

    screen.getByText('Como utilizar Hooks');

    fireEvent.click(screen.getByText('Carregar mais posts'));

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalledWith('link');
    });

    screen.getByText('Como utilizar Hooks');
    screen.getByText('Criando um app CRA do zero');
    expect(screen.queryByText('Carregar mais posts')).not.toBeInTheDocument();
  });

  it('should not be able to load more posts if not available', async () => {
    const postsPagination = {
      ...mockedGetByTypeReturn,
      next_page: null,
    };

    render(<App postsPagination={postsPagination} />);

    screen.getByText('Como utilizar Hooks');
    screen.getByText('Criando um app CRA do zero');

    expect(screen.queryByText('Carregar mais posts')).not.toBeInTheDocument();
  });
});
