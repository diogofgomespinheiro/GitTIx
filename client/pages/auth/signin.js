import AuthContainer from '../../components/AuthContainer';

const SignIn = () => {
  return (
    <AuthContainer
      title="Sign In"
      buttonText="Sign In"
      requestUrl="/api/users/signin"
    />
  );
};

export default SignIn;
