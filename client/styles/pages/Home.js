import styled from 'styled-components';

export const Container = styled.div`
  width: ${props => props.width || '100%'};
  padding-top: 100px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  color: ${props => props.theme.colors.text};
`;

export const TableContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  background: ${props => props.theme.colors.background_80};
  border-radius: 8px;
  border: 0;
  box-shadow: 7px 2px 14px -6px rgba(0, 0, 0, 0.75);
  padding: 30px 0 30px 30px;
`;

export const Table = styled.table`
  width: 100%;
  padding-top: 10px;

  thead th,
  tbody td {
    color: ${props => props.theme.colors.text};
    text-align: left;
  }
`;

export const Button = styled.button`
  margin: 10px 0;
`;
