import React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, } from '@mui/material';
import logoImage from '../resources/LogoSmall.png';
import '../App.css';

const logoStyles = {
  width: '50px',
  height: 'auto',
};

function NavBar({ onCards, onMain, onAccount, onExpenses, onLogoff }) {
  //Lineas comentadas para no mostrar advertencias en terminal (No se usan aún)
  /*const [anchorElNav, setAnchorElNav] = React.useState(null);*/
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  /*const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };*/
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  /*const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };*/
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar className="whiteNavBar" position="static" sx={{ backgroundColor: 'white', boxShadow: '0px 0px 20px white', width: "80%" }}>
      <Container>
        <Toolbar disableGutters>
          {/* Logo de la version completa */}
          <img src={logoImage} alt="Logo" style={logoStyles} className="logo1" onClick={onMain}></img>
          {/* Opciones de la version completa */}
          <Box alignItems={'center'} sx={{ m: 2, flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button onClick={onCards} sx={{ my: 2, color: 'black', display: 'block' }} > Mis Tarjetas </Button>
            <Button onClick={onExpenses} sx={{ my: 2, color: 'black', display: 'block' }} > Mis Gastos </Button>
            <Button sx={{ my: 2, color: 'black', display: 'block' }} > Acerca de </Button>
          </Box>
          {/* Menu de Perfil para ambas versiones */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Account Icon" /*src="/static/images/avatar/2.jpg"*/ />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={onAccount}> <Typography textAlign="center">Mi Cuenta</Typography> </MenuItem>
              <MenuItem onClick={onLogoff}> <Typography textAlign="center">Cerrar Sesion</Typography> </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;