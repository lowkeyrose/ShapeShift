import { useState } from 'react'
import { ACTIONS } from '../context/Actions'
import { useGlobalContext } from './useGlobalContext'

export const useUpdateUser = () => {
  const [error, setError] = useState(null)
  const { dispatch, setLoading, snackbar, navigate, user, token } = useGlobalContext()

  const updateUser = async (firstName, lastName, email, username, phone, gender, profilePic) => {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch(`/api/user/update/${user._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
         },
        body: JSON.stringify({ firstName, lastName, email, username, phone, gender, profilePic, _id: user._id})
      })
      const json = await response.json()
      console.log('response:', response);

      if (!response.ok) {
        throw new Error(json.error);
      }
      if (response.ok) {
        console.log('json: ', json);

        // update the user context
        dispatch({ type: ACTIONS.SET_USER, payload: json })
        // Popup message for UX
        snackbar("Updated user info successfully!")
        // Navigate home
        navigate('/account')
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
        setError('Updating user info failed. Please try again.');
        console.error('Signup error:', error);
      }
    } finally {
      setLoading(false)
    }
  }

  return { updateUser, error }
}