import styled from 'styled-components';
import Lottie from 'react-lottie';

export const Container = styled.div`
  width: 100%;
  padding-top: 100px;
`;

export const Title = styled.h1`
  color: ${props => props.theme.colors.text};
`;

export const CardContainer = styled.div`
  margin: 0 auto;
  height: 400px;
  width: 700px;
  background: ${props => props.theme.gradientColors.card_gradient};
  border-radius: 20px;
  padding: 6px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    background: ${props => props.theme.colors.background};
    height: 60px;
    width: 60px;
    left: -30px;
    top: 50%;
    border: 6px solid #e95c7f;
    border-radius: 50%;
    transform: translateY(-50%);
  }

  &::after {
    content: '';
    position: absolute;
    background: ${props => props.theme.colors.background};
    height: 60px;
    width: 60px;
    right: -30px;
    top: 50%;
    border: 6px solid #54a8cd;
    border-radius: 50%;
    transform: translateY(-50%);
  }

  @media (max-width: 767px) {
    width: 94%;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

export const Card = styled.div`
  background: rgba(0, 0, 0, 0.87);
  height: 100%;
  width: 100%;
  border-radius: 20px;
  padding: 0 36px;
`;

export const CardContent = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  color: white;
`;

export const TicketInfo = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;

  h1 {
    word-break: break-word;
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.25rem;
    }
  }
`;

export const TicketId = styled.div`
  border-left: 2px dashed white;

  & h1 {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    text-align: center;
    height: 100%;
    margin: 0 0 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const BuySection = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding-bottom: 20px;

  div {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  span {
    color: ${props => props.theme.colors.text};
    font-weight: bold;
    font-size: 1.5rem;
    margin-right: 10px;

    &:hover {
      background: ${props => props.theme.gradientColors.card_gradient};
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      cursor: pointer;
    }
  }
`;

export const ColoredArrows = styled(Lottie)`
  cursor: pointer;
`;
