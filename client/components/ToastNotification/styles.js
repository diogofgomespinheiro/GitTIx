import styled, { keyframes } from 'styled-components';

const fadeInAnimation = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`;

const fadeOutAnimation = keyframes`
  from {opacity: 1;}
  to {opacity: 0;}
`;

export const ToastContainer = styled.div`
  position: relative;
  margin-bottom: 10px;
  padding: 10px 60px 10px 20px;
  display: flex;
  align-items: center;
  background: ${({ appearance, theme: { colors } }) =>
    colors[`${appearance}_message`]};
  color: ${({ theme: { colors } }) => colors.text};
  border-radius: 5px;
  font-weight: bold;
  animation: ${fadeInAnimation} 2.5s, ${fadeOutAnimation} 2.5s 4s;
`;

export const ToastIconContainer = styled.span`
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

export const CloseButton = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  cursor: pointer;
`;
