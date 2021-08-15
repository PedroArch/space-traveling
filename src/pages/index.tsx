/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';

import styles from './home.module.scss';

import Header from '../components/Header';

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
  return (
    <>
      <div className={commonStyles.mainWrapper}>
        <header>
          <img src="./logo.svg" alt="logo" />
        </header>
        <div className={styles.posts}>
          {postsPagination &&
            postsPagination.results.map(post => {
              return (
                <div key={post.uid} className={styles.post}>
                  <h2>{post.data.title}</h2>
                  <p>{post.data.subtitle}</p>
                  <footer>
                    <div>
                      <FiCalendar size={20} />
                      <span>
                        {format(
                          new Date(post.first_publication_date),
                          'd MMM yyyy',
                          {
                            locale: ptBR,
                          }
                        )}
                      </span>
                    </div>
                    <div>
                      <FiUser size={20} />
                      <span>{post.data.author}</span>
                    </div>
                  </footer>
                </div>
              );
            })}
        </div>
        {postsPagination.next_page && <span>Carregar mais posts</span>}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['title', 'subtitle', 'author'],
      pageSize: 20,
    }
  );

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
