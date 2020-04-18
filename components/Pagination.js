import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import { perPage, shopName } from './../config';
import ErrorMessage from './ErrorMessage';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = (props) => {
  return (
    <Query query={PAGINATION_QUERY}>
      {({ loading, error, data }) => {
        if (loading) {
          return <p>Loading...</p>;
        }

        if (error) {
          return <ErrorMessage error={error} />;
        }

        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        const page = props.page;

        return (
          <PaginationStyles>
            <Head>
              <title>{`${shopName} | Page ${page} of ${pages}`}</title>
            </Head>

            <Link
              prefetch
              href={{
                pathname: 'items',
                query: { page: page - 1 },
              }}
            >
              <a className="prev" aria-disabled={page <= 1}>
                {`< Prev`}
              </a>
            </Link>
            <p>
              Page {page} of {pages}
            </p>
            <p>{count} Items Total</p>
            <Link
              prefetch
              href={{
                pathname: 'items',
                query: { page: page + 1 },
              }}
            >
              <a className="prev" aria-disabled={page >= pages}>
                {`Next >`}
              </a>
            </Link>
          </PaginationStyles>
        );
      }}
    </Query>
  );
};

export default Pagination;
