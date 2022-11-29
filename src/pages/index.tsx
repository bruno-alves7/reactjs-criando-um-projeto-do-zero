import { useState } from 'react';
import { GetStaticProps, GetServerSideProps } from 'next';

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
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [vm, setVm] = useState({
    loadedMorePosts: false,
    next_page: '',
    posts: [],
  });

  const loadMorePosts = async (): Promise<void> => {
    fetch(postsPagination.next_page)
      .then(res => res.json())
      .then(data => {
        setVm({
          loadedMorePosts: true,
          next_page: data.next_page,
          posts: data.results,
        });
      });
  };

  return (
    <div className={commonStyles.container}>
      <div className={styles.container}>
        {vm.loadedMorePosts
          ? vm.posts.map(post => <Post key={post.uid} post={post} />)
          : postsPagination.results.map(post => (
              <Post key={post.uid} post={post} />
            ))}

        {postsPagination.next_page && (
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
