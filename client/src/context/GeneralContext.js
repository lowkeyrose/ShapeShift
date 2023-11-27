import { createContext, useState } from 'react';
import Snackbar from '../components/Snackbar';
import { useNavigate } from 'react-router-dom';


export const GeneralContext = createContext()

export const GeneralContextProvider = ({ children }) => {

  const navigate = useNavigate()

  const [snackbarText, setSnackbarText] = useState('')

  const snackbar = text => {
    setSnackbarText(text);
    setTimeout(() => setSnackbarText(''), 3 * 1000);
  }

  return (
    <GeneralContext.Provider value={{ snackbar, navigate }}>
      {snackbarText && <Snackbar text={snackbarText} />}
      {/* {loading && <Loader />} */}
      {children}
    </GeneralContext.Provider>
  )
}