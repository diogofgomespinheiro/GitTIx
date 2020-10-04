// Style imports
import {
  Navbar,
  NavLink,
  NavLinkText,
  LeftContainer,
  RightContainer,
  MenuList,
  MenuListItem,
} from './styles';

const Header = ({ currentUser }) => {
  const menuListLinks = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return (
        <MenuListItem key={href}>
          <NavLink href={href}>
            <NavLinkText>{label}</NavLinkText>
          </NavLink>
        </MenuListItem>
      );
    });

  return (
    <Navbar>
      <LeftContainer>
        <NavLink href="/">
          <NavLinkText>GitTix</NavLinkText>
        </NavLink>
      </LeftContainer>
      <RightContainer>
        <MenuList>{menuListLinks}</MenuList>
      </RightContainer>
    </Navbar>
  );
};

export default Header;
