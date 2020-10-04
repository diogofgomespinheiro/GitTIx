//Library imports
import Link from 'next/link';

// Api/Helpers imports
import buildClient from './api/buildClient';

// Style imports
import {
  Button,
  Container,
  Table,
  TableContainer,
  Title,
} from '../styles/pages/Home';

const Home = ({ currentUser, tickets }) => {
  if (!tickets.length) {
    return (
      <Container width="90%">
        <Title>There are no tickets available!</Title>
      </Container>
    );
  }

  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <Button>View</Button>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <Container>
      <TableContainer>
        <Title>Tickets</Title>
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export const getServerSideProps = async appContenxt => {
  const client = buildClient(appContenxt);
  const { data } = await client.get('/api/tickets');

  const tickets = data.filter(ticket => !ticket.orderId);

  return { props: { tickets } };
};

export default Home;
