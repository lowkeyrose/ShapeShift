import { createContext, useEffect, useReducer } from 'react'
import { ACTIONS } from "./Actions"
import { useGeneralContext } from '../hooks/useGeneralContext';
import { RoleTypes } from '../components/Navbar-config';

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { user: action.payload }
    case ACTIONS.LOGOUT:
      localStorage.removeItem('token')
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const { snackbar, setRoleType, location } = useGeneralContext()
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  // loginstatus
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'))
    if (token) {
      const loginstatus = async () => {
        try {
          const response = await fetch('/api/user/authenticate', {
            method: 'POST',
            headers: {
              'Authorization': token
            }
          })

          const json = await response.json()

          if (response.ok) {
            dispatch({ type: ACTIONS.SET_USER, payload: json })
            const userRoleType = json.roleType
            const mappedRoleType = RoleTypes[userRoleType]
            setRoleType(mappedRoleType)
          } else {
            snackbar('Session expired')
            dispatch({ type: ACTIONS.LOGOUT })
            setRoleType(RoleTypes.none)
          }
        } catch (error) {
          console.log("The Promise is rejected!", error)
        }
      }
      loginstatus()
    }
  }, [dispatch, location.pathname, setRoleType, snackbar])

  console.log('AuthContext state: ', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
