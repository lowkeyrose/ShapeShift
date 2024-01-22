import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import { Link, useResolvedPath } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { checkPermissions, pages, settings } from './Navbar-config'
import { useGlobalContext } from '../hooks/useGlobalContext'
import { memo } from 'react'
import Searchbar from './Searchbar'
import { ClickAwayListener, MenuList, Paper, Popper } from '@mui/material'

const Navbar = () => {
  const { user, roleType, navigate } = useGlobalContext()
  const { logout } = useLogout()
  const handleLogout = (ev) => {
    ev.preventDefault()
    logout()
    setAnchorElUser(null);
  }
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const path = useResolvedPath().pathname;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Dynamically determine whether to show the "About" page in the navigation
  const showAboutInPages = !user;

  return (
    <AppBar position="absolute" sx={{ backgroundColor: 'transparent', boxShadow: path === '/' ? '1px 1px 5px #ffffff33' : '1px 1px 5px grey' }}>
      <Container maxWidth="100%" sx={{ backgroundColor: 'inherit' }}>
        <Toolbar disableGutters>

          {/* LOGO */}
          <FitnessCenterIcon sx={{ display: { xs: 'none', md: 'none', lg: 'flex' }, mr: 1, color: path === '/' ? 'white' : 'black', fontSize: '30px' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'none', lg: 'flex' },
              fontFamily: 'Kanit',
              fontWeight: 600,
              fontSize: '34px',
              color: path === '/' ? 'white' : 'black',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            ShapeShift
          </Typography>

          {/* Hamburger Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex', lg: 'none' } }}>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="white"
            >
              <MenuIcon sx={{color: path === '/' ? 'white' : 'black'}} />
            </IconButton>
            <Popper
              sx={{ mt: '55px', right: 'auto', left: 0,top: '10px !important', position: 'absolute !important' }}
              id="menu-appbar"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              placement="bottom-start"
              transition
              disablePortal
            >
                <ClickAwayListener onClickAway={handleCloseNavMenu}>
                  <Paper in={Boolean(anchorElNav).toString()} style={{ transformOrigin: 'left top'}}>
                    <MenuList autoFocusItem={Boolean(anchorElNav)} id="menu-list-grow">
                      {pages.filter(p => !p.permissions || checkPermissions(p.permissions, roleType)).map((page) => (
                        <Link to={page.route} key={page.route} style={{ textDecoration: 'none', color: "black" }}>
                          <MenuItem onClick={handleCloseNavMenu}>
                            <Typography textAlign="center" fontFamily='Kanit'>{page.title}</Typography>
                          </MenuItem>
                        </Link>
                      ))}
                    </MenuList>
                  </Paper>
                </ClickAwayListener>
            </Popper>
          </Box>


          {/* Logo, Displays from md */}
          <Box
            sx={{
              display: 'flex', position: 'absolute',
              top: 13,
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
            <FitnessCenterIcon
              sx={{
                display: { xs: 'none', sm: 'flex', md: 'flex', lg: 'none' },
                mr: 1,
                mt: 1,
                color: path === '/' ? 'white' : 'black',
              }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'flex', lg: 'none' },
                flexGrow: 1,
                fontFamily: 'Kanit',
                fontWeight: 500,
                fontSize: '28px',
                color: path === '/' ? 'white' : 'black',
                textDecoration: 'none',
              }}
            >
              ShapeShift
            </Typography>
          </Box>

          {/* Nav Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'none', lg: 'block' },
              position: 'absolute',
              top: 13,
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
            {(showAboutInPages ? pages.concat(settings) : pages) // Use a conditional to determine which array to display
              .filter(p => !p.permissions || checkPermissions(p.permissions, roleType))
              .map((page) => (
                <Link to={page.route} key={page.route} style={{ textDecoration: 'none', color: 'initial' }}>
                  <Button
                    key={page.route}
                    sx={{ mx: 2, color: path === '/' ? 'white' : 'black', display: 'inline-block', fontFamily: 'Kanit', fontSize: '17px', textTransform: 'capitalize' }}
                  >
                    {page.title}
                  </Button>
                </Link>
              ))}
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* Searchbar */}
            {['/workouts', '/workouts/favorites', '/workouts/myworkouts'].includes(path) && <Searchbar />}

            {/* User Section */}
            {user && (
              <Box sx={{ flexGrow: 0, m: 0 }}>
                <Tooltip title="Open settings" >
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.profilePic} src={user.profilePic} sx={{ width: '50px', height: '50px' }} />
                  </IconButton>
                </Tooltip>

                <Popper
                  sx={{ mt: '45px', right: -15, top: '10px !important', position: 'absolute !important', left: 'unset !important' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  placement="bottom-end"
                  transition
                  disablePortal
                >
                    <ClickAwayListener onClickAway={handleCloseUserMenu}>
                      <Paper in={Boolean(anchorElUser).toString()} style={{ transformOrigin: 'right top'}}>
                        <MenuList autoFocusItem={Boolean(anchorElUser)} id="menu-list-grow" >
                          <Link to='/' style={{ textDecoration: 'none', color: 'black' }} >
                            <MenuItem onClick={handleLogout}>
                              <Typography textAlign="center" fontFamily='Kanit'>Logout</Typography>
                            </MenuItem>
                          </Link>
                          {settings.filter(s => !s.permissions || checkPermissions(s.permissions, roleType)).map((setting) => (
                            <Link to={setting.route} key={setting.route} style={{ textDecoration: 'none', color: 'black' }} >
                              <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" fontFamily='Kanit'>{setting.title}</Typography>
                              </MenuItem>
                            </Link>
                          ))}
                        </MenuList>
                      </Paper>
                    </ClickAwayListener>
                </Popper>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default memo(Navbar)