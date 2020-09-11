import styled from 'styled-components';

export const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.colors.text};
`;

export const Label = styled.label`
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: bold;
`;

export const Input = styled.input`
  height: 35px;
  padding: 0 8px;
  font-size: 1.2rem;
  background: #25272a;
  color: ${props => props.theme.colors.text};
  border-radius: 5px;
  border: 0;

  &:focus {
    outline: none;
    border: ${props => props.theme.colors.primary} solid 2px;
  }
`;
