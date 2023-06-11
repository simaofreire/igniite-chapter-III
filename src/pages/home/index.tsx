import { GetStaticProps } from 'next';
import Header from '../../components/Header';
import PostList from '../../components/postList';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import styles from './home.module.scss';
import Head from 'next/head';
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

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleNextPage(): Promise<void> {
    if (nextPage === null) return;

    const res = await fetch(nextPage)
      .then(response => response.json())
      .catch(err => console.error(err));

    setNextPage(res.next_page);

    const newPosts = res.results.map((post: Post) => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          { locale: ptBR }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...newPosts]);
  }

  return (
    <main className={commonStyles.container}>
      <Head>
        <title> Home | spacetraveling</title>
      </Head>
      <Header />

      {posts.map(post => (
        <PostList key={post.uid} post={post} />
      ))}

      {nextPage && (
        <button
          type="button"
          onClick={handleNextPage}
          className={styles.button}
        >
          Carregar mais posts
        </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', {
    pageSize: 2,
    orderings: {
      field: 'last_publication_date',
      direction: 'asc',
    },
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };

  return { props: { postsPagination } };
};
