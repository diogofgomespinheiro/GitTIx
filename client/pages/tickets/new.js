// Library imports
import { useRef } from 'react';

// Component imports
import FormInput from '../../components/FormInput';

// Style imports
import { Container, Title, FormContainer } from '../../styles/shared/forms';

const NewTicket = ({ currentUser }) => {
  const titleInputRef = useRef(null);
  const priceInputRef = useRef(null);

  const onBlur = () => {
    const value = parseFloat(priceInputRef.current.value);

    if (isNaN(value)) {
      return;
    }

    priceInputRef.current.value = value.toFixed(2);
  };

  return (
    <Container>
      <FormContainer>
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
          step="0.1"
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
