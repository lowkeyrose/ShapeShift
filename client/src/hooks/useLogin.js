import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { ACTIONS } from '../context/Actions'
import { useGeneralContext } from './useGeneralContext'
import { RoleTypes } from '../components/Navbar-config'

export const useLogin = () => {
  const { setLoading, snackbar, navigate, setRoleType } = useGeneralContext()
  const { dispatch } = useAuthContext()
  const [error, setError] = useState(null)

  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const json = await response.json()
  
      if (!response.ok) {
        setError(json.error)
        console.log('json.error: ', json.error);
      }
      if (response.ok) {
        // console.log('json', json);
        // save the user to local storage
        localStorage.setItem('token', JSON.stringify(json.token))
        // update the auth context
        dispatch({ type: ACTIONS.SET_USER, payload: json })
        // set user roleType
        const userRoleType = json.user.roleType
        const mappedRoleType = RoleTypes[userRoleType]
        setRoleType(mappedRoleType)
  
        // Popup message for UX
        snackbar("Login successful")
        // Navigate home
        navigate('/')
        // update loading state
      }

    } catch (error) {
      console.log("The Promise is rejected!", error)
    } finally {
      setLoading(false)
    }
  }

  return { login, error }
}