import { useContext, useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { ACTIONS } from '../context/Actions'
import { GeneralContext } from '../App'

export const useLogin = () => {
  const { navigate, snackbar } = useContext(GeneralContext)
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
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({ type: ACTIONS.LOGIN, payload: json })
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