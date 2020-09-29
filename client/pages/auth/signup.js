// Component imports
import AuthContainer from '../../components/AuthContainer';

const SignUp = () => {
  return (
    <AuthContainer
      title="Sign Up"
      buttonText="Sign Up"
      requestUrl="/api/users/signup"
    />
  );
};

export default SignUp;
