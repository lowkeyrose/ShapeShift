import { useState } from 'react';
import { ACTIONS } from "../context/Actions"
import { useGlobalContext } from '../hooks/useGlobalContext'
import { useWorkoutContext } from "../hooks/useWorkoutContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react'
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutContext()
  const { user, token, snackbar, navigate, location } = useGlobalContext()
  const [isFavorited, setIsFavorited] = useState(user?.favorites?.includes(workout._id))

  const handleDelete = async () => {
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
      console.log('json', json);
      dispatch({ type: ACTIONS.REMOVE_WORKOUT, payload: { workoutId: workout._id } })
    } catch (error) {
      console.error('Error deleting workout:', error)
      snackbar('Failed to delete workout. Please try again.')
    }
  }

  // const favorite = async () => {
  //   try {
  //     setIsFavorited(true)
  //     const response = await fetch(`/api/workouts/favorite/${workout._id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Authorization': token
  //       }
  //     })
  //     if (!response.ok) {
  //       throw new Error(`Failed to favorite workout: ${response.statusText}`);
  //     }
  //     // Update the state to reflect the added workout inside favorites array
  //     dispatch({ type: ACTIONS.FAVORITE, payload: workout._id })
  //     dispatch({ type: ACTIONS.INCREMENT_LIKES, payload: workout._id })
  //     snackbar("Workout added to favorites");

  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  const favorite = async () => {
    try {
      setIsFavorited(true)
      // Update the state to reflect the added workout inside favorites array
      dispatch({ type: ACTIONS.FAVORITE, payload: workout._id })
      dispatch({ type: ACTIONS.INCREMENT_LIKES, payload: workout._id })
      snackbar("Workout added to favorites");
      const response = await fetch(`/api/workouts/favorite/${workout._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token
        }
      })
      if (!response.ok) {
        throw new Error(`Failed to favorite workout: ${response.statusText}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const unfavorite = async () => {
    try {
      if (location.pathname === '/workouts/favorites') {
        dispatch({ type: ACTIONS.REMOVE_WORKOUT, payload: { workoutId: workout._id } })
      }
      // Update the state to reflect the removed workout
      dispatch({ type: ACTIONS.UNFAVORITE, payload: workout._id });
      dispatch({ type: ACTIONS.DECREMENT_LIKES, payload: workout._id });
      setIsFavorited(false);
      snackbar('Workout removed from favorites');
      const response = await fetch(`/api/workouts/unfavorite/${workout._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to unfavorite workout: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error unfavorite workout:', error);
    }
  }

  // const unfavorite = async () => {
  //   try {
  //     const response = await fetch(`/api/workouts/unfavorite/${workout._id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Authorization': token,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to unfavorite workout: ${response.statusText}`);
  //     }
  //     if (location.pathname === '/workouts/favorites') {
  //       dispatch({ type: ACTIONS.REMOVE_WORKOUT,  payload: { workoutId: workout._id } })
  //     }
  //     // Update the state to reflect the removed workout
  //     dispatch({ type: ACTIONS.UNFAVORITE, payload: workout._id });
  //     dispatch({ type: ACTIONS.DECREMENT_LIKES, payload: workout._id });
  //     setIsFavorited(false);
  //     snackbar('Workout removed from favorites');
  //   } catch (error) {
  //     console.error('Error unfavorite workout:', error);
  //   }
  // }

  const handleEdit = () => {
    navigate(`/workouts/myworkouts/edit/${workout._id}`)
  }

  return (
    <div className="workout-card">
      <figure className="workout-figure">
        <h1>{workout.title}</h1>
        <img className="workout-img" src={workout.imgUrl} alt={workout.imgUrl} />
        <figcaption className="workout-figcaption">
          <h3>
            <strong>Exercises: </strong>{workout.exercises ? workout.exercises.length : 0}
          </h3>

          <p >Creator: {workout.username}</p>
          {workout.likes > 0 ? <p>Likes: {workout.likes}</p> : <p>Likes: 0</p>}
          {workout.createdAt && <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>}
          {location.pathname === '/workouts/myworkouts' && <p><strong>Private: </strong>{workout.Private ? 'Yes' : 'No'}</p>}

          <button className="workout-button" onClick={() => navigate(`/workouts/workout/${workout._id}`)}>
            View Workout
          </button>
        </figcaption>
      </figure>
      <div className="multi-button">
        {
          ((user?.roleType === 'admin') || (location.pathname === '/workouts/myworkouts' && user?._id === workout?.user_id)) &&
          <>
            <button onClick={handleDelete}><FontAwesomeIcon icon={faTrash} /></button>
            <button onClick={handleEdit}><FontAwesomeIcon icon={faPenToSquare} /></button>
          </>

        }
        <button style={{ color: (location.pathname === '/workouts/favorites' && 'red') || (!user ? "grey" : (isFavorited ? "red" : "grey")) }} onClick={() => user ? (isFavorited ? unfavorite() : favorite()) : snackbar("This feature is only available for users")} ><FontAwesomeIcon icon={faHeart} /></button>
      </div>
    </div>
  )
}
export default memo(WorkoutDetails)
