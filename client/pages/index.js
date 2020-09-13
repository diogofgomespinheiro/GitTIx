import buildAxios from './api/buildAxios';

const Home = () => {
  return <div>Home</div>;
};

export const getServerSideProps = async context => {
  const { data } = await buildAxios(context).get('/api/users/currentUser');

  console.log(data);
  return { props: { data } };
};

export default Home;
