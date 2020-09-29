const Home = ({ currentUser }) => {
  return currentUser ? <div>Home</div> : <div>Your are signout</div>;
};

export const getServerSideProps = async context => {
  return {};
};

export default Home;
