import { useState } from 'react';
import { ACTIONS } from "../context/Actions"
import { useGlobalContext } from '../hooks/useGlobalContext'
import { useWorkoutContext } from "../hooks/useWorkoutContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPenToSquare, faTrash, faThumbsUp, faLock } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react'
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutContext()
  const { user, token, navigate, location, showToastSuccess, showToastError } = useGlobalContext()
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
      showToastSuccess('Workout deleted successfully')
    } catch (error) {
      console.error('Error deleting workout:', error)
      showToastError('Failed to delete workout. Please try again.')
    }
  }

  const favorite = async () => {
    try {
      const response = await fetch(`/api/workouts/favorite/${workout._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token
        }
      })
      if (!response.ok) {
        throw new Error(`Failed to favorite workout: ${response.statusText}`);
      }
      setIsFavorited(true)
      // Update the state to reflect the added workout inside favorites array
      dispatch({ type: ACTIONS.FAVORITE, payload: workout._id })
      dispatch({ type: ACTIONS.INCREMENT_LIKES, payload: workout._id })
      showToastSuccess("Workout added to favorites");
    } catch (err) {
      console.log(err);
    }
  }

  const unfavorite = async () => {
    try {
      const response = await fetch(`/api/workouts/unfavorite/${workout._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to unfavorite workout: ${response.statusText}`);
      }
      if (location.pathname === '/workouts/favorites') {
        dispatch({ type: ACTIONS.REMOVE_WORKOUT, payload: { workoutId: workout._id } })
      }
      // Update the state to reflect the removed workout
      dispatch({ type: ACTIONS.UNFAVORITE, payload: workout._id });
      dispatch({ type: ACTIONS.DECREMENT_LIKES, payload: workout._id });
      setIsFavorited(false);
      showToastSuccess('Workout removed from favorites');
    } catch (error) {
      console.error('Error unfavorite workout:', error);
    }
  }

  const handleEdit = () => {
    navigate(`/workouts/myworkouts/edit/${workout._id}`)
  }

  return (
    <div className="card">
      <figure className="figure">
        <h1>{workout.title?.toUpperCase()}</h1>
        <img className="img" src={workout.imgUrl} alt={workout.imgUrl} />
        <figcaption className="figcaption">
          <h3>
            <strong>Exercises: </strong>{workout.exercises ? workout.exercises.length : 0}
          </h3>



          {workout.createdAt && <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>}


          <button className="button" onClick={() => navigate(`/workouts/workout/${workout._id}`)}>
            View Workout
          </button>
        </figcaption>

        {(location.pathname === '/workouts/myworkouts' && workout.Private) && 
        <div className='private'><FontAwesomeIcon style={{ fontSize: '20px' }} icon={faLock} /></div>
        }

        {workout.likes > 0 && <p className='likes'> <FontAwesomeIcon style={{ fontSize: '24px' }} icon={faThumbsUp} /> {workout.likes}</p>}

        <img className='profilePic' src={workout.userProfilePic} alt={workout.username} />

      </figure>
      <div className="multi-button">
        {
          ((user?.roleType === 'admin') || (location.pathname === '/workouts/myworkouts' && user?._id === workout?.user_id)) &&
          <>
            <button onClick={handleDelete}><FontAwesomeIcon icon={faTrash} /></button>
            <button onClick={handleEdit}><FontAwesomeIcon icon={faPenToSquare} /></button>
          </>

        }
        <button style={{ color: (location.pathname === '/workouts/favorites' && 'red') || (!user ? "grey" : (isFavorited ? "red" : "grey")) }} onClick={() => user ? (isFavorited ? unfavorite() : favorite()) : showToastError("This feature is only available for users")} ><FontAwesomeIcon icon={faHeart} /></button>
      </div>
    </div>
  )
}
export default memo(WorkoutDetails)
