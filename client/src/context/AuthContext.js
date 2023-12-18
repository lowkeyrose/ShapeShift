import { createContext, useEffect, useReducer } from 'react'
import { ACTIONS } from "./Actions"
import { useLocation } from 'react-router-dom';
import { useGeneralContext } from '../hooks/useGeneralContext';
import { RoleTypes } from '../components/Navbar-config';

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return { user: action.payload }
    case ACTIONS.LOGOUT:
      localStorage.removeItem('token')
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const { snackbar, setRoleType } = useGeneralContext()
  const location = useLocation()
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  // loginstatus
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'))
    if (token) {
      console.log('loginstatus with token');
      const loginstatus = async () => {
        try {
          const response = await fetch('/api/user/authenticate', {
            method: 'POST',
            headers: {
              'Authorization': token
            }
          })

          console.log('response', response);
          const json = await response.json()
          console.log('data', json);

          if (response.ok) {
            dispatch({ type: ACTIONS.LOGIN, payload: json })
            const userRoleType = json.user.roleType
            const mappedRoleType = RoleTypes[userRoleType]
            setRoleType(mappedRoleType)
            console.log("response ok");
          }
          if (response.status === 401) {
            console.log('loginstatus if 401');
            // } else {
            snackbar('Session expired')
            dispatch({ type: ACTIONS.LOGOUT })

            // check if this is needed! 
            setRoleType(RoleTypes.none)

          } else if (response.status !== 200) {
            console.log('loginstatus else if');
            throw new Error(`Unexpected response status, response status: ${response.status}`)
          }
        } catch (error) {
          console.log("The Promise is rejected!", error)
          console.log('loginstatus catch');
        }
      }
      loginstatus()
    } else {
      console.log('loginstatus without token');
    }

  }, [dispatch, location.pathname,])

  console.log('AuthContext state: ', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
