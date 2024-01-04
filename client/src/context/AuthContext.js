import { createContext, useCallback, useEffect, useReducer } from 'react'
import { ACTIONS } from "./Actions"
import { useGeneralContext } from '../hooks/useGeneralContext';
import { RoleTypes } from '../components/Navbar-config';

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload
      }
    case ACTIONS.LOGOUT:
      return { user: null }
    case ACTIONS.FAVORITE:
      return {
        user: action.payload.favorites.push(action.payload._id)
      }
    case ACTIONS.UNFAVORITE:
      return {
        user: action.payload.favorites.filter(w => w._id !== action.payload._id)
      }
      // try this instead
    // case ACTIONS.FAVORITE:
    //   return {
    //     ...state,
    //     user: { ...state.user, favorites: [...state.user.favorites, action.payload._id] }
    //   };
    // case ACTIONS.UNFAVORITE:
    //   return {
    //     ...state,
    //     user: {
    //       ...state.user,
    //       favorites: state.user.favorites.filter(w => w._id !== action.payload._id)
    //     }
    //   };
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const { token, snackbar, navigate, location, setRoleType } = useGeneralContext()
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  const memoizedDispatch = useCallback(dispatch, []); // Memoize dispatch to avoid infinite loop

  // authenticate
  useEffect(() => {
    if (token) {
      const authenticate = async () => {
        console.log("authenticate, authenticate, authenticate, authenticate")

        try {
          // Check if the user is already logged out
          // if (!state.user) {
          //   return;
          // }

          const response = await fetch('/api/user/authenticate', {
            method: 'POST',
            headers: {
              'Authorization': token
            }
          })

          if (response.ok) {
            const json = await response.json()
            memoizedDispatch({ type: ACTIONS.SET_USER, payload: json })
            const userRoleType = json.roleType
            const mappedRoleType = RoleTypes[userRoleType]
            setRoleType(mappedRoleType)
          } else {
            snackbar('Session expired')
            memoizedDispatch({ type: ACTIONS.LOGOUT })
            setRoleType(RoleTypes.none)
            navigate('/')
          }
        } catch (error) {
          console.log("The Promise is rejected!", error)
        } 
      }
      authenticate()
    }
  }, [memoizedDispatch, location.pathname, token, snackbar, navigate, setRoleType ])

  console.log('AuthContext state: ', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
