import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import { RichText } from 'prismic-dom';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt?: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

interface QueryProps {
  params: {
    slug: string;
  };
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  const textLength = post.data.content.reduce((acc, value) => {
    return acc + RichText.asText(value.body).split(/\s+/).length;
  }, 0);

  if (router.isFallback) {
    return <span>Carregando...</span>;
  }

  return (
    <div className={styles.container}>
      <img src={post.data.banner.url} alt={post.data.banner.alt} />

      <section className={commonStyles.container}>
        <h1>{post.data.title}</h1>

        <div className={styles.postInfoContainer}>
          <div>
            <FiCalendar />{' '}
            <span>
              {format(
                new Date(post.first_publication_date),
                'dd MMM yyyy'
              ).toLowerCase()}
            </span>
          </div>

          <div>
            <FiUser /> <span>{post.data.author}</span>
          </div>

          <div>
            <FiClock />
            <span>{`${Math.ceil(textLength / 200)} min`}</span>
          </div>
        </div>

        <article id="article" className={styles.contentContainer}>
          {post.data.content.map(content => (
            <div key={content.heading}>
              <h2>{content.heading}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </div>
          ))}
        </article>
      </section>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: QueryProps) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', params.slug);

  return {
    props: {
      post: response,
    },
    revalidate: 60 * 60, // 1 hour
  };
};
