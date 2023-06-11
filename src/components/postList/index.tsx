import Link from 'next/link';
import styles from './postList.module.scss';
import { FiUser, FiCalendar } from 'react-icons/fi';

interface PostListProps {
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

export default function PostList({ post }: PostListProps) {
  return (
    <div className={styles.posts}>
      <Link href={`/post/${post.uid}`}>
        <a className={styles.post}>
          <strong>{post.data.title}</strong>
          <p>{post.data.subtitle}</p>
          <ul>
            <li>
              <FiCalendar />
              {post.first_publication_date}
            </li>
            <li>
              <FiUser />
              {post.data.author}
            </li>
          </ul>
        </a>
      </Link>
    </div>
  );
}
