// Library imports
import { useRef, useState } from 'react';
import axios from 'axios';

// Component imports
import FormInput from '../../components/FormInput';

const SignUp = () => {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async evt => {
    evt.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    try {
      const res = await axios.post('/api/users/signup', { email, password });

      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
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
    </form>
  );
};

export default SignUp;
