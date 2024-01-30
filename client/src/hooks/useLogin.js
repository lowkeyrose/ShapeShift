import { useState } from 'react'
import { ACTIONS } from '../context/Actions'
import { useGlobalContext } from './useGlobalContext'
import { RoleTypes } from '../components/Navbar-config'

export const useLogin = () => {
  const { dispatch, setLoading, showToastSuccess, navigate, setRoleType } = useGlobalContext()
  const [error, setError] = useState(null)

  const login = async (email, password) => {
    setError(null)
    try {
      setLoading(true)
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const json = await response.json()

      if (!response.ok) {
        setError(json.error)
      } else {
        localStorage.setItem('token', JSON.stringify(json.token))
        dispatch({ type: ACTIONS.SET_USER, payload: json })
        const userRoleType = json.user.roleType
        const mappedRoleType = RoleTypes[userRoleType]
        setRoleType(mappedRoleType)
        showToastSuccess("Login successful")
        navigate('/')
      }
      } catch (error) {
      console.log("The Promise is rejected!", error)
    } finally {
      setLoading(false)
    }
  }
  
  return { login, error }
}