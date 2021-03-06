// Library imports
import { useRef } from 'react';
import Router from 'next/router';

// Component imports
import FormInput from '../../components/FormInput';

// Hooks imports
import useRequest from '../../hooks/useRequest';

// Styles
import { Container, FormContainer, Title } from '../../styles/shared/forms';

const AuthContainer = ({ title, buttonText, requestUrl }) => {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const { doRequest } = useRequest({
    url: requestUrl,
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
        <Title>{title}</Title>
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
        <button>{buttonText}</button>
      </FormContainer>
    </Container>
  );
};

export default AuthContainer;
