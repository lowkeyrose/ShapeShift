import { useState } from 'react'
import { ACTIONS } from '../context/Actions'
import { useGlobalContext } from './useGlobalContext'
import { RoleTypes } from '../components/Navbar-config'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const { dispatch, setLoading, showToastSuccess, navigate, setRoleType } = useGlobalContext()

  const signup = async (firstName, lastName, email, password, username, phone, gender, profilePic) => {
    setError(null)
    try {
      setLoading(true)
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, username, phone, gender, profilePic })
      })
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error)
      }
      localStorage.setItem('token', JSON.stringify(json.token))
      dispatch({ type: ACTIONS.SET_USER, payload: json })
      const userRoleType = json.user.roleType
      const mappedRoleType = RoleTypes[userRoleType]
      setRoleType(mappedRoleType)
      showToastSuccess("Signup successful")
      navigate('/')
    } catch (error) {
      // Handle specific error cases
      if (error.message === 'email already in use') {
        setError('email is already in use.')
      } else if (error.message === 'username already in use') {
        setError('username is already in use.')
      } else {
        // Handle other types of errors
        setError('Signup failed. Please try again.')
        console.error('Signup error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  return { signup, error }
}