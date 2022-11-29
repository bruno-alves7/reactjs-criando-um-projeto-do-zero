import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import Link from 'next/link';

import styles from './post.module.scss';

interface PostProps {
  post: {
    uid?: string;
    first_publication_date: string | null;
    data: {
      title: string;
      subtitle: string;
      author: string;
    };
  };
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <Link href={`post/${post.uid}`}>
      <div className={styles.container}>
        <h2>{post.data.title}</h2>
        <span>{post.data.subtitle}</span>

        <br />
        <br />

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
        </div>
      </div>
    </Link>
  );
}
