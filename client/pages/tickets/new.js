// Library imports
import { useRef } from 'react';
import { useToasts } from 'react-toast-notifications';
import Router from 'next/router';

// Component imports
import FormInput from '../../components/FormInput';

// Hooks imports
import useRequest from '../../hooks/useRequest';

// Style imports
import { Container, Title, FormContainer } from '../../styles/shared/forms';

const NewTicket = ({ currentUser }) => {
  const { addToast } = useToasts();
  const titleInputRef = useRef(null);
  const priceInputRef = useRef(null);

  const { doRequest } = useRequest({
    url: '/api/tickets',
    method: 'post',
    onSuccess: () => {
      addToast('Ticket created with success.', {
        appearance: 'success',
        autoDismiss: true,
      });
      Router.push('/');
    },
  });

  const handleSubmit = event => {
    event.preventDefault();

    const title = titleInputRef.current.value;
    const price = priceInputRef.current.value;

    doRequest({ title, price });
  };

  const onBlur = () => {
    const value = parseFloat(priceInputRef.current.value);

    if (isNaN(value)) {
      return;
    }

    priceInputRef.current.value = value.toFixed(2);
  };

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit}>
        <Title>New Ticket</Title>
        <FormInput
          type="text"
          name="title"
          ref={titleInputRef}
          label="Title"
          required
        />
        <FormInput
          type="number"
          step="0.01"
          name="price"
          ref={priceInputRef}
          onBlur={onBlur}
          label="Price"
          required
        />
        <button>Create</button>
      </FormContainer>
    </Container>
  );
};

export default NewTicket;
