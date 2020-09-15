import Link from 'next/link';
import styled from 'styled-components';

export const Navbar = styled.nav`
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.background_80};
  box-shadow: 7px 2px 14px -6px rgba(0, 0, 0, 0.75);
`;

export const LeftContainer = styled.div``;

export const RightContainer = styled.div`
  flex: 1;
`;

export const MenuList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  list-style: none;
`;

export const MenuListItem = styled.li`
  &:not(:last-child) {
    margin-right: 10px;
  }
`;

export const NavLink = styled(Link)``;

export const NavLinkText = styled.a`
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;
