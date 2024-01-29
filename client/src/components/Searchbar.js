import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

// function for the searchbar
export const search = (searchWord, ...values) => {
  const str = values.join('').toLowerCase();
  const word = searchWord.toLowerCase();
  return str.includes(word);
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#ffffff00',
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  backgroundColor: '#ffffff00',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '0ch',
    cursor: 'pointer',
    backgroundColor: '#ffffff00',
    [theme.breakpoints.down('lg')]: {
      width: '0ch', // Adjust this value as needed for small screens
      '&:focus': {
        cursor: 'unset',
        width: '10ch', // Adjust this value as needed for small screens
      },
    },
    
    [theme.breakpoints.up('lg')]: {
      width: '0ch', // Adjust this value as needed for small screens
      '&:focus': {
        cursor: 'unset',
        width: '10ch', // Adjust this value as needed for small screens
      },
    },
  },
}));

export default function Searchbar() {
  const { searchWord, setSearchWord } = useContext(GlobalContext);
  // Reset search on location change
  const location = useLocation();
  useEffect(() => {
    setSearchWord("");
  }, [location, setSearchWord])

  return (
    <Box sx={{ display: {xs:'none', sm: 'flex', md: 'flex' }}}>
      <Toolbar sx={{ m: {xs:'0', sm:'0', md:'0',lg:'0'}, p:{xs:'0', sm:'0', md:'0',lg:'0'}}}>
        <Search>
          <SearchIconWrapper >
            <SearchIcon/>
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchWord}
            onChange={(event) => setSearchWord(event.target.value)}
          />
        </Search>
      </Toolbar>
    </Box>
  );
}