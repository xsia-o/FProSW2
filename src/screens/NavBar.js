import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logoImage from '../resources/LogoSmall.png';
import '../App.css';

const logoStyles = {
  width: '50px',
  height: 'auto', 
};

function NavBar({ onCards, onMain, onLogoff}) {
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
        <AppBar className="whiteNavBar" position="static" sx={{ backgroundColor: 'white', boxShadow: '0px 0px 20px white',width:"80%" }}>
        <Container maxWidth="xl" maxHeight="x0.5">
          <Toolbar disableGutters>

            {/* Logo de la version completa */}
            <img src={logoImage} alt="Logo" style={logoStyles} className="logo1" onClick={onMain}></img>

            {/* Opciones de la version completa */}  
            <Box alignItems={'center'} sx={{ m: 2, flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={onCards}
                 sx={{ my: 2, color: 'black', display: 'block' }}
              >
                Mis Tarjetas
              </Button>
              <Button
                disabled
                //onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                Mis Gastos
              </Button>
              <Button
                disabled
                //onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                Acerca de
              </Button>
            </Box>

            {/* Menu de Perfil para ambas versiones */}     
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                <MenuItem disabled>
                  <Typography textAlign="center">Mi Cuenta</Typography>
                </MenuItem>
                <MenuItem onClick={onLogoff}>
                  <Typography textAlign="center">Cerrar Sesion</Typography>
                </MenuItem>
                
              </Menu>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
    );
  }
  export default NavBar;