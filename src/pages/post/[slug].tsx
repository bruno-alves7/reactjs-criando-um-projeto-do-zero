import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import { asHTML, asText } from '@prismicio/helpers';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient, hasPrismicEndpoint } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import { fallbackPosts, getFallbackPostBySlug } from '../../services/posts';
import styles from './post.module.scss';
import type { PostDocument } from '../../types';

interface PostProps {
  post: PostDocument;
}

export default function Post({ post }: PostProps) {
  const textLength = post.data.content.reduce((acc, value) => {
    return (
      acc +
      (asText(value.body as Parameters<typeof asText>[0]) ?? '')
        .split(/\s+/)
        .filter(Boolean).length
    );
  }, 0);

  return (
    <div className={styles.container}>
      <Image
        src={post.data.banner.url}
        alt={post.data.banner.alt ?? ''}
        width={1600}
        height={600}
        priority
      />

      <section className={commonStyles.container}>
        <h1>{post.data.title}</h1>

        <div className={styles.postInfoContainer}>
          <div>
            <FiCalendar />{' '}
            <span>
              {format(
                new Date(post.first_publication_date ?? new Date()),
                'dd MMM yyyy',
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
              {/* Prismic RichText serializes trusted CMS content to HTML. */}
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    asHTML(content.body as Parameters<typeof asHTML>[0]) ?? '',
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
  if (!hasPrismicEndpoint()) {
    return {
      paths: fallbackPosts.map(post => ({
        params: { slug: post.uid },
      })),
      fallback: false,
    };
  }

  try {
    const prismic = getPrismicClient();
    const posts = await prismic.getByType('posts');

    const paths = posts.results.map(post => ({
      params: { slug: String(post.uid) },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch {
    return {
      paths: fallbackPosts.map(post => ({
        params: { slug: post.uid },
      })),
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug ?? '');

  if (!hasPrismicEndpoint()) {
    return {
      props: {
        post: getFallbackPostBySlug(slug),
      },
      revalidate: 60 * 60,
    };
  }

  try {
    const prismic = getPrismicClient();
    const response = await prismic.getByUID('posts', slug);

    return {
      props: {
        post: response as unknown as PostDocument,
      },
      revalidate: 60 * 60,
    };
  } catch {
    return {
      props: {
        post: getFallbackPostBySlug(slug),
      },
      revalidate: 60 * 60,
    };
  }
};
