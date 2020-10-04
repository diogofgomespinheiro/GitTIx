// Library imports
import Router from 'next/router';

// Api/Helpers imports
import buildClient from '../api/buildClient';

// Style imports
import { Container, Title, Order, OrdersList } from '../../styles/pages/Orders';

const BLOCKED_ORDER_STATUS = ['complete', 'cancelled'];

const Orders = ({ orders }) => {
  const handleOrderClick = order => {
    const { id, status } = order;

    if (!BLOCKED_ORDER_STATUS.includes(status)) {
      Router.push('/orders/[orderId]', `/orders/${id}`);
    }
  };

  return (
    <Container>
      <Title>My Orders:</Title>
      <OrdersList>
        {orders.map(order => (
          <Order key={order.id} onClick={() => handleOrderClick(order)}>
            <span>
              {order.ticket.title} - {order.ticket.price.toFixed(2)} €
            </span>
            <span>{order.status}</span>
          </Order>
        ))}
      </OrdersList>
    </Container>
  );
};

export const getServerSideProps = async appContenxt => {
  const client = buildClient(appContenxt);
  const { data } = await client.get('/api/orders');

  return { props: { orders: data } };
};

export default Orders;
