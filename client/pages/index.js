import buildClient from './api/buildClient';

const Home = ({ currentUser }) => {
  return currentUser ? <div>Home</div> : <div>Your are signout</div>;
};

export const getServerSideProps = async context => {
  const { data } = await buildClient(context).get('/api/users/currentUser');

  return { props: { ...data } };
};

export default Home;
