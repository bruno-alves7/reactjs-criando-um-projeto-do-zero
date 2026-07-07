import { useState } from 'react';
import { GetStaticProps } from 'next';

import { getPrismicClient, hasPrismicEndpoint } from '../services/prismic';

import Post from '../components/Post';

import { getFallbackPostsPage } from '../services/posts';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import type { PostPagination } from '../types';

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const loadMorePosts = async (pageUrl: string): Promise<void> => {
    const response = await fetch(pageUrl);
    const data = await response.json();

    setPosts(currentPosts => [...currentPosts, ...data.results]);
    setNextPage(data.next_page);
  };

  return (
    <div className={commonStyles.container}>
      <div className={styles.container}>
        {posts.map(post => (
          <Post key={post.uid} post={post} />
        ))}

        {nextPage && (
          <button type="button" onClick={() => loadMorePosts(nextPage)}>
            Carregar mais posts
          </button>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  if (!hasPrismicEndpoint()) {
    return {
      props: {
        postsPagination: getFallbackPostsPage(),
      },
      revalidate: 60 * 60,
    };
  }

  try {
    const prismic = getPrismicClient();
    const postsResponse = await prismic.getByType('posts', {
      page: 1,
      pageSize: 10,
    });

    const postsPagination = {
      results: postsResponse.results.map(post => ({
        uid: String(post.uid),
        first_publication_date: post.first_publication_date,
        data: {
          title: String(post.data.title),
          subtitle: String(post.data.subtitle),
          author: String(post.data.author),
        },
      })),
      next_page: postsResponse.next_page,
    };

    return {
      props: {
        postsPagination,
      },
      revalidate: 60 * 60,
    };
  } catch {
    return {
      props: {
        postsPagination: getFallbackPostsPage(),
      },
      revalidate: 60 * 60,
    };
  }
};
