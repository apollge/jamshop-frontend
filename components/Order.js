import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import Head from 'next/head';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

class Order extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
        {(data, loading, error) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }

          if (loading) {
            return <p>Loading...</p>;
          }

          const order = data.data.order;

          return (
            <OrderStyles>
              <Head>
                <title>RAG Shop - Order {order.id}</title>
              </Head>
              <p>
                <span>Order ID:</span>
                <span>{this.props.id}</span>
              </p>
              <p>
                <span>Charge:</span>
                <span>{order.charge}</span>
              </p>
              <p>
                <span>Date:</span>
                <span>
                  <Moment format="MMMM d, YYYY h:mm a">
                    {order.createdAt}
                  </Moment>
                </span>
              </p>
              <p>
                <span>Order Total:</span>
                <span>{formatMoney(order.total)}</span>
              </p>
              <p>
                <span>Item Count:</span>
                <span>{order.items.length}</span>
              </p>
              <div className="items">
                {order.items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <img src={item.image} alt={item.title} />
                    <div className="item-details">
                      <h3>{item.title}</h3>
                      <p>Qty: {item.quantity}</p>
                      <p>Each: {item.price}</p>
                      <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrderStyles>
          );
        }}
      </Query>
    );
  }
}

export default Order;
