import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { checkPermissions, pages, settings } from './Navbar-config'
import { useGeneralContext } from '../hooks/useGeneralContext'
import { memo } from 'react'

const ResponsiveAppBar = () => {
  const { user, roleType } = useGeneralContext()
  const { logout } = useLogout()
  const handleLogout = (ev) => {
    ev.preventDefault()
    logout()
  }
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="100%" sx={{ backgroundColor: '#fff1d0' }}>
        <Toolbar disableGutters>
          <FitnessCenterIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'black' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            ShapeShift
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="black"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.filter(p => !p.permissions || checkPermissions(p.permissions, roleType)).map((page) => (
                <Link to={page.route} key={page.route} style={{ textDecoration: 'none', color: "black" }}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <FitnessCenterIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'black' }} />
          <Typography
            variant="h5"
            noWrap
            // onClick={() => navigate('/')}
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            ShapeShift
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.filter(p => !p.permissions || checkPermissions(p.permissions, roleType)).map((page) => (
              <Link to={page.route} key={page.route} style={{ textDecoration: 'none', color: 'initial' }}>
                <Button
                  key={page.route}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  {page.title}
                </Button>
              </Link>
            ))}
          </Box>

          {user &&
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <span>{roleType},</span>
                  <span>{user.username}</span>
                  <Avatar alt={user.profilePic} src={user.profilePic} />

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
                {settings.filter(s => !s.permissions || checkPermissions(s.permissions, roleType)).map((setting) => (
                  <Link to={setting.route} key={setting.route} style={{ textDecoration: 'none', color: 'black' }} >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting.title}</Typography>
                    </MenuItem>
                  </Link>
                ))}
                <Link to='/' style={{ textDecoration: 'none', color: 'black' }} >
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Link>
              </Menu>
            </Box>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default memo(ResponsiveAppBar)