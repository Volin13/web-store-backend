import React, { useContext } from 'react';
import { Context } from '..';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { LOGIN_ROUTE, SHOP_ROUTE } from '../utils/constants';

import { observer } from 'mobx-react-lite'; // Оновлено імпорт

const NavBar = observer(() => {
  const { user } = useContext(Context);
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <NavLink style={{ color: 'white' }} to={SHOP_ROUTE}>
            OnlineStore
          </NavLink>
          {user.isAuth ? (
            <Nav className="ml-auto" style={{ color: 'white' }}>
              <Button className="ml-2" variant="outline-light">
                Вийти
              </Button>{' '}
            </Nav>
          ) : (
            <Nav className="ml-auto" style={{ color: 'white' }}>
              <NavLink to={LOGIN_ROUTE}>
                <Button
                  variant="outline-light"
                  onClick={() => {
                    user.setIsAuth(true);
                  }}
                >
                  Авторизація
                </Button>{' '}
              </NavLink>
            </Nav>
          )}
        </Container>
      </Navbar>
    </>
  );
});

export default NavBar;
