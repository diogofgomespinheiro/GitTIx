import { forwardRef } from 'react';

import { FormGroup, Label, Input } from './styles';

const FormInput = ({ label, name, ...otherProps }, ref) => {
  return (
    <FormGroup>
      <Label htmlFor={name}>{label}</Label>
      <Input name={name} {...otherProps} ref={ref} />
    </FormGroup>
  );
};

export default forwardRef(FormInput);
