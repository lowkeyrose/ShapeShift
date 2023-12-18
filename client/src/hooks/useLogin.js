import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { ACTIONS } from '../context/Actions'
import { useGeneralContext } from './useGeneralContext'
import { RoleTypes } from '../components/Navbar-config'

export const useLogin = () => {
  const { navigate, snackbar, setRoleType } = useGeneralContext()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      console.log('json', json);
      // save the user to local storage
      localStorage.setItem('token', JSON.stringify(json.token))
      // update the auth context
      dispatch({ type: ACTIONS.LOGIN, payload: json })
      // set user roleType
      const userRoleType = json.user.roleType
      const mappedRoleType = RoleTypes[userRoleType]
      setRoleType(mappedRoleType)

      // Popup message for UX
      snackbar("Login successful")
      // Navigate home
      navigate('/')
      // update loading state
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}