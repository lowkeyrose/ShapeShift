import { useState } from 'react';
import { ACTIONS } from "../context/Actions"
import { useAuthContext } from '../hooks/useAuthContext'
import { useGeneralContext } from '../hooks/useGeneralContext'
import { useWorkoutContext } from "../hooks/useWorkoutContext"

import FavoriteIcon from '@mui/icons-material/Favorite';


// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function WorkoutDetails({ workout }) {
  const { user } = useAuthContext()
  const { dispatch } = useWorkoutContext()
  const { location, snackbar } = useGeneralContext()
  const [isFavorite, setIsFavorite] = useState(false)
  const token = JSON.parse(localStorage.getItem('token'))

  const handleClick = async () => {
    const response = await fetch(`/api/workouts/myworkouts/${workout._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: ACTIONS.DELETE_WORKOUT, payload: json })
    }
  }

  const favorite = (workout) => {
    fetch(`/api/workouts/favorite/${workout._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token
      }
    })
      .then(() => {
        snackbar("Workout added to favorites");
        setIsFavorite(true)
      })
      .catch(err => console.log(err));
  }

  const unfavorite = (workout) => {
    fetch(`/api/workouts/unfavorite/${workout._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token
      }
    })
      .then(() => {
        snackbar("Workout removed from favorites");
        setIsFavorite(false)
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      {workout.imgUrl ? <img src={workout.imgUrl} alt={workout.imgUrl} /> : <img src='https://c4.wallpaperflare.com/wallpaper/599/689/236/machine-dwayne-johnson-the-rock-workout-wallpaper-preview.jpg' alt="Workout-img" />}

      <p><strong>Exercises: </strong>{workout.exercises ? workout.exercises.length : 0}</p>

      {location.pathname === '/workouts/myworkouts' && <p><strong>Private: </strong>{workout.Private ? 'Yes' : 'No'}</p>}
      {/* <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p> */}
      {user && <span className="material-symbols-outlined" onClick={handleClick}>delete</span>}


      <FavoriteIcon className='heart-icon' aria-label="add to favorites" style={{ color: !user ? "grey" : (isFavorite ? "red" : "grey") }} onClick={() => user ? (isFavorite ? unfavorite(workout) : favorite(workout)) : snackbar("This feature is only available for users")} />

      {/* <button onClick={() => favorite(workout)}>Favorite</button> */}
    </div>
  )
}
