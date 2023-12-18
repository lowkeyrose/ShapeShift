import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { ACTIONS } from '../context/Actions'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (firstName, lastName, email, password, username, phone, gender) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, username, phone, gender })
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
      dispatch({ type: ACTIONS.SET_USER, payload: json })

      // update loading state
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}