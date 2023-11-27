import { createContext, useEffect, useReducer } from 'react'
import { ACTIONS } from "./Actions"
import { useLocation } from 'react-router-dom';
import { useGeneralContext } from '../hooks/useGeneralContext';

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return { user: action.payload }
    case ACTIONS.LOGOUT:
      // remove user from storage
      localStorage.removeItem('user')
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const { snackbar } = useGeneralContext()
  const location = useLocation()
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      const loginstatus = async () => {
        try {
          const response = await fetch('/api/user/loginstatus', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })

          const data = await response.json()

          if (response.ok) {
            dispatch({ type: ACTIONS.LOGIN, payload: data })
          } else {
            snackbar('Session expired')
            dispatch({ type: ACTIONS.LOGOUT })
          }
        } catch (error) {
          console.log("The Promise is rejected!", error)
        }
      }
      loginstatus()
    }
  }, [dispatch, location.pathname, snackbar])

  console.log('AuthContext state: ', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
