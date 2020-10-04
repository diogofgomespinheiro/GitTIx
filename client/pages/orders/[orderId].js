// Library imports
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

// Api/Helpers imports
import buildClient from '../api/buildClient';

// Hooks imports
import useRequest from '../../hooks/useRequest';

// Style imports
import { Container, Text } from '../../styles/pages/Order';

const Order = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest } = useRequest({
    url: '/api/payments',
    method: 'post',
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <Container>
        <Text>Order Expired!</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Text>Time left to pay: {timeLeft} seconds</Text>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id, orderId: order.id })}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </Container>
  );
};

export const getServerSideProps = async appContenxt => {
  const { orderId } = appContenxt.query;

  const client = buildClient(appContenxt);
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { props: { order: data } };
};

export default Order;
