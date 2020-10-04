import styled from 'styled-components';

export const Container = styled.div`
  width: 90%;
  margin: 0 auto;
  padding-top: 100px;
`;

export const Title = styled.h1`
  color: ${props => props.theme.colors.text};
`;

export const OrdersList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 700px;
`;

export const Order = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding: 0 20px;
  height: 50px;
  background: ${props => props.theme.colors.background_80};
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  font-size: 18px;
  border: 0;
  border-radius: 8px;
  box-shadow: 7px 2px 14px -6px rgba(0, 0, 0, 0.75);
  cursor: pointer;
`;
