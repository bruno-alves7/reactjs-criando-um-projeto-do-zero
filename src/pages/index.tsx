import { useState } from 'react';
import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import Post from '../components/Post';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const loadMorePosts = async (): Promise<void> => {
    if (!nextPage) {
      return;
    }

    const response = await fetch(nextPage);
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
          <button type="button" onClick={loadMorePosts}>
            Carregar mais posts
          </button>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    page: 1,
    pageSize: 10,
  });

  const postsPagination = {
    results: postsResponse.results,
    next_page: postsResponse.next_page,
  };

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 60, // 1 hour
  };
};
