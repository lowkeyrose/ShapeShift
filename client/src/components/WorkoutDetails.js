import { useState } from 'react';
import { ACTIONS } from "../context/Actions"
import { useAuthContext } from '../hooks/useAuthContext'
import { useGeneralContext } from '../hooks/useGeneralContext'
import { useWorkoutContext } from "../hooks/useWorkoutContext"

import FavoriteIcon from '@mui/icons-material/Favorite';


// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function WorkoutDetails({ workout }) {
// export default function WorkoutDetails({ workout, favoritesCount }) {
  const { user } = useAuthContext()
  const { dispatch } = useWorkoutContext()
  const { location, snackbar} = useGeneralContext()
  const [isFavorited, setIsFavorited] = useState(user?.favorites.includes(workout._id))
  const token = JSON.parse(localStorage.getItem('token'))

  const handleClick = async () => {
    try {
      const response = await fetch(`/api/workouts/myworkouts/${workout._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete workout: ${response.statusText}`)
      }

      const json = await response.json()
      dispatch({ type: ACTIONS.DELETE_WORKOUT, payload: json })
    } catch (error) {
      console.error('Error deleting workout:', error)
      snackbar('Failed to delete workout. Please try again.')
    }
  }

  const favorite = async (workout) => {
    try {
      setIsFavorited(true)
      const response = await fetch(`/api/workouts/favorite/${workout._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token
        }
      })

      // Update the state to reflect the added workout inside favorites array
      dispatch({ type: ACTIONS.FAVORITE, payload: workout._id })
      dispatch({ type: ACTIONS.INCREMENT_LIKES, payload: workout._id })
      snackbar("Workout added to favorites");
    } catch (err) {
      console.error('Error adding workout to favorites', err)
    }
  }

  const unfavorite = async (workout) => {
    try {
      setIsFavorited(false)
      const response = await fetch(`/api/workouts/unfavorite/${workout._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to unfavorite workout: ${response.statusText}`)
      }

      // Update the state to reflect the removed workout
      dispatch({ type: ACTIONS.UNFAVORITE, payload: workout._id })
      dispatch({ type: ACTIONS.DECREMENT_LIKES, payload: workout._id })
      snackbar("Workout removed from favorites");
    } catch (error) {
      console.error('Error unfavorite workout:', error)
    }
  };

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      {workout.imgUrl ? <img src={workout.imgUrl} alt={workout.imgUrl} /> : <img src='https://c4.wallpaperflare.com/wallpaper/599/689/236/machine-dwayne-johnson-the-rock-workout-wallpaper-preview.jpg' alt="Workout-img" />}

      <p><strong>Exercises: </strong>{workout.exercises ? workout.exercises.length : 0}</p>

      {location.pathname === '/workouts/myworkouts' && <p><strong>Private: </strong>{workout.Private ? 'Yes' : 'No'}</p>}
      {/* <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p> */}
      {user && <span className="material-symbols-outlined" onClick={handleClick}>delete</span>}

      <div>
      <FavoriteIcon className='heart-icon' aria-label="add to favorites" style={{ color: !user ? "grey" : (isFavorited ? "red" : "grey") }} onClick={() => user ? (isFavorited ? unfavorite(workout) : favorite(workout)) : snackbar("This feature is only available for users")} />
      {workout.likes > 0 && <p>Likes: {workout.likes}</p>}
      </div>

      <p>Creator: {workout.username}</p>



    </div>
  )
}
