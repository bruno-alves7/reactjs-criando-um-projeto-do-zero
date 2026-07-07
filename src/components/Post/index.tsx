import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import Link from 'next/link';

import styles from './post.module.scss';
import type { PostSummary } from '../../types';

interface PostProps {
  post: PostSummary;
}

export default function Post({ post }: PostProps) {
  return (
    <Link href={`/post/${post.uid}`} className={styles.container}>
      <h2>{post.data.title}</h2>
      <span>{post.data.subtitle}</span>

      <br />
      <br />

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
      </div>
    </Link>
  );
}
