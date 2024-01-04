import { createContext, useState } from 'react';
import Snackbar from '../components/Snackbar';
// import Loader from '../components/Loader';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { RoleTypes } from '../components/Navbar-config';
import Loader from '../components/Loader';

export const GeneralContext = createContext()

export const GeneralContextProvider = ({ children }) => {

  const token = JSON.parse(localStorage.getItem('token'))

  const navigate = useNavigate()
  
  const location = useLocation()

  const [snackbarText, setSnackbarText] = useState('')

  const [loading, setLoading] = useState(false)

  const [roleType, setRoleType] = useState(RoleTypes.none)

  const snackbar = text => {
    setSnackbarText(text);
    setTimeout(() => setSnackbarText(''), 3 * 1000);
  }

  return (
    <GeneralContext.Provider value={{ snackbar, navigate, roleType, setRoleType, location, setLoading, token }}>
      {snackbarText && <Snackbar text={snackbarText} />}
      {loading && <Loader />}
      {children}
    </GeneralContext.Provider>
  )
}