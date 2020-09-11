import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  html,
  body {
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: Helvetica Neue, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    background: ${props => props.theme.colors.background}
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }

  button {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text};
    padding: 10px 40px;
    margin: 20px 0;
    font-weight: bold;
    font-size: 1rem;
    border: 0;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background: ${props => props.theme.colors.primary_80};
    }
  }
`;
