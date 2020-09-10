import { forwardRef } from 'react';

const FormInput = ({ label, name, ...otherProps }, ref) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-input-label">
        {label}
      </label>
      <input className="form-input" name={name} {...otherProps} ref={ref} />
    </div>
  );
};

export default forwardRef(FormInput);
