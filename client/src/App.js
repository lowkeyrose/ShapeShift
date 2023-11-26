import { useAuthContext } from './hooks/useAuthContext';
import Navbar from './components/Navbar'
import { createContext, useEffect, useState } from 'react';
import { ACTIONS } from './context/Actions';
import Snackbar from './components/Snackbar';
import Router from './routers/Router';
import AuthRouter from './routers/AuthRouter';
import { useNavigate } from 'react-router-dom';
// import { useNavigate, useLocation } from 'react-router-dom';

export const GeneralContext = createContext();

export default function App() {
  const { user, dispatch } = useAuthContext()
  const [snackbarText, setSnackbarText] = useState('')
  const navigate = useNavigate()
  // const location = useLocation()

  const snackbar = text => {
    setSnackbarText(text);
    setTimeout(() => setSnackbarText(''), 3 * 1000);
  }

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const localUser = JSON.parse(localStorage.getItem('user'))
      const loginstatus = async () => {
        try {
          const response = await fetch('/api/user/loginstatus', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localUser.token}`
            }
          })

          // response always fails
          console.log(response)
          // this line below makes it not send a response
          const data = await response.json()
          
          if (response.ok) {
            console.log("response ok")
            dispatch({ type: ACTIONS.SET_WORKOUTS, payload: data })
          } else {
            console.log("response failed")
            snackbar('User not logged in')
            dispatch({ type: ACTIONS.LOGOUT })
          }
        } catch (error) {
          console.log("The Promise is rejected!", error)
        }
      }
      loginstatus()
    }
  }, [dispatch])
  // }, [dispatch, location.pathname])

  return (
    <GeneralContext.Provider value={{ snackbar, navigate }}>
      <div className="App">
        <Navbar />
        {user ? <AuthRouter /> : <Router />}
        {/* {loading && <Loader />} */}
        {snackbarText && <Snackbar text={snackbarText} />}
      </div>
    </GeneralContext.Provider>
  )
}