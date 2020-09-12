// Library imports
import { useRef, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

// Component imports
import FormInput from '../../components/FormInput';

// Styles
import { Container, FormContainer, Title } from '../../styles/pages/Signup';

const SignUp = () => {
  const { addToast } = useToasts();

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async evt => {
    evt.preventDefault();

    addToast(',mnsajndkjsahdjknaskn skjadkasjd kjsad kjasdkjb ', {
      appearance: 'warning',
      autoDismiss: true,
    });

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    try {
      //const res = await axios.post('/api/users/signup', { email, password });
      //console.log(res.data);
    } catch (err) {
      //console.error(err.response.data);
    }
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
