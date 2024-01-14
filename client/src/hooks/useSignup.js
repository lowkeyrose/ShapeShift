import { useState } from 'react'
import { ACTIONS } from '../context/Actions'
import { useGlobalContext } from './useGlobalContext'
import { RoleTypes } from '../components/Navbar-config'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const { dispatch, setLoading, snackbar, navigate, setRoleType } = useGlobalContext()

  const signup = async (firstName, lastName, email, password, username, phone, gender, profilePic) => {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, username, phone, gender, profilePic })
      })
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error);
      }
      if (response.ok) {
        console.log('json: ', json);
        // save the user to local storage
        localStorage.setItem('token', JSON.stringify(json.token))

        // update the user context
        dispatch({ type: ACTIONS.SET_USER, payload: json })

        const userRoleType = json.user.roleType
        const mappedRoleType = RoleTypes[userRoleType]
        setRoleType(mappedRoleType)

        // Popup message for UX
        snackbar("Signup successful")
        // Navigate home
        navigate('/')
        // update loading state
      }
    } catch (error) {
      // Handle specific error cases
      if (error.message === 'email already in use') {
        setError('email is already in use.');
      } else if (error.message === 'username already in use') {
        setError('username is already in use.');
      } else {
        // Handle other types of errors
        setError('Signup failed. Please try again.');
        console.error('Signup error:', error);
      }
    } finally {
      setLoading(false)
    }
  }

  return { signup, error }
}