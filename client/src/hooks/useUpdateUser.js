import { useState } from 'react'
import { ACTIONS } from '../context/Actions'
import { useGlobalContext } from './useGlobalContext'
import { useParams } from 'react-router-dom'

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { dispatch, setLoading, showToastSuccess, navigate, user, token } = useGlobalContext();

  const updateUser = async (firstName, lastName, email, username, phone, gender, profilePic) => {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch(`/api/user/update/${id ? id : user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        // Send the _id aswell for backend checks
        body: JSON.stringify({ firstName, lastName, email, username, phone, gender, profilePic, _id: id ? id : user._id })
      })
      const json = await response.json()
      console.log('response:', response);

      if (!response.ok) {
        throw new Error(json.error);
      }
      if (response.ok) {
        console.log('json: ', json);

        if (user.roleType === 'admin') {
          navigate('/admin-panel')
        } else {
          dispatch({ type: ACTIONS.SET_USER, payload: json })
          navigate('/account')
        }
        showToastSuccess("Updated user info successfully!")
      }
    } catch (error) {
      // Handle specific error cases
      if (error.message.includes('duplicate key error') && error.message.includes('email')) {
        setError('email is already in use.');
      } else if (error.message.includes('duplicate key error') && error.message.includes('username')) {
        setError('username is already in use.');
      } else {
        // Handle other types of errors
        setError('Updating user info failed. Please try again.');
        console.error('Update user error:', error);
      }
    } finally {
      setLoading(false)
    }
  }
  return { updateUser, error }
}