import buildClient from './api/buildClient';

const Home = ({ currentUser }) => {
  return <div>Home</div>;
};

export const getServerSideProps = async context => {
  const { data } = await buildClient(context).get('/api/users/currentUser');

  return { props: { ...data } };
};

export default Home;
