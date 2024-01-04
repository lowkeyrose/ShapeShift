import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { ACTIONS } from '../context/Actions'
import { useGeneralContext } from './useGeneralContext'
import { RoleTypes } from '../components/Navbar-config'

export const useSignup = () => {
  const [error, setError] = useState(null)  
  const { setLoading, snackbar, navigate, setRoleType } = useGeneralContext()
  const { dispatch } = useAuthContext()

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
        setError(json.error)
      }
      if (response.ok) {
        console.log('json: ', json);
        // save the user to local storage
        localStorage.setItem('token', JSON.stringify(json.token))
  
        // update the auth context
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
      console.log("The Promise is rejected!", error)
    } finally {
      setLoading(false)
    }
  }

  return { signup, error }
}