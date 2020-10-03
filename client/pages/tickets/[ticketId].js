// Library imports
import Router from 'next/router';

// Api/Helpers imports
import buildClient from '../api/buildClient';

// Hooks imports
import useRequest from '../../hooks/useRequest';

// Style imports
import {
  BuySection,
  Card,
  CardContainer,
  CardContent,
  ColoredArrows,
  Container,
  TicketId,
  TicketInfo,
} from '../../styles/pages/Ticket';
import animationData from '../../assets/colored_arrow.json';

const Ticket = ({ ticket }) => {
  const { doRequest } = useRequest({
    url: '/api/orders',
    method: 'post',
    onSuccess: order => Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Container>
      <CardContainer>
        <Card>
          <CardContent>
            <TicketInfo>
              <div>
                <h1>{ticket.title}</h1>
                <h1>{ticket.price.toFixed(2)} €</h1>
              </div>
              <BuySection>
                <div onClick={() => doRequest({ ticketId: ticket.id })}>
                  <span>Buy Now</span>
                  <ColoredArrows
                    options={defaultOptions}
                    height={24}
                    width={40}
                  />
                </div>
              </BuySection>
            </TicketInfo>
            <TicketId>
              <h1>Nº {ticket.id}</h1>
            </TicketId>
          </CardContent>
        </Card>
      </CardContainer>
    </Container>
  );
};

export const getServerSideProps = async appContenxt => {
  const { ticketId } = appContenxt.query;

  const client = buildClient(appContenxt);
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { props: { ticket: data } };
};

export default Ticket;
