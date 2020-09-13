// Library imports
import { useRef } from 'react';
import Router from 'next/router';

// Component imports
import FormInput from '../../components/FormInput';

// Hooks imports
import useRequest from '../../hooks/useRequest';

// Styles
import { Container, FormContainer, Title } from '../../styles/pages/Signup';

const SignUp = () => {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const { doRequest } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    onSuccess: () => Router.push('/'),
  });

  const handleSubmit = async evt => {
    evt.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    await doRequest({ email, password });
  };

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit}>
        <Title>Sign Up</Title>
        <FormInput
          type="email"
          name="email"
          ref={emailInputRef}
          label="Email"
          required
        />
        <FormInput
          type="password"
          name="password"
          ref={passwordInputRef}
          label="Password"
          required
        />
        <button>Sign Up</button>
      </FormContainer>
    </Container>
  );
};

export default SignUp;
