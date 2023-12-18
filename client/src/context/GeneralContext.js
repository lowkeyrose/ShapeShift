import { createContext, useState } from 'react';
import Snackbar from '../components/Snackbar';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { RoleTypes } from '../components/Navbar-config';

export const GeneralContext = createContext()

export const GeneralContextProvider = ({ children }) => {

  const navigate = useNavigate()
  
  const location = useLocation()

  const [snackbarText, setSnackbarText] = useState('')

  const [roleType, setRoleType] = useState(RoleTypes.none)

  const snackbar = text => {
    setSnackbarText(text);
    setTimeout(() => setSnackbarText(''), 3 * 1000);
  }

  return (
    <GeneralContext.Provider value={{ snackbar, navigate, roleType, setRoleType, location }}>
      {snackbarText && <Snackbar text={snackbarText} />}
      {/* {loading && <Loader />} */}
      {children}
    </GeneralContext.Provider>
  )
}