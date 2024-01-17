import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useGlobalContext } from '../hooks/useGlobalContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
// import Button from '@mui/material/Button'
// import DeleteIcon from '@mui/icons-material/Delete';
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import './style/SingleWorkout.css'

const isValidObjectId = (id) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

export default function SingleWorkout() {
  const { id } = useParams()
  const { user, setLoading, showToastError, showToastSuccess, navigate, token } = useGlobalContext()
  const { workout, dispatch } = useWorkoutContext()

  const fetchWorkout = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workouts/workout/${id}`);
      if (!response.ok) {
        throw new Error(`Workout not found: ${response.statusText}`);
      }
      const data = await response.json();

      dispatch({ type: ACTIONS.SET_SINGLE_WORKOUT, payload: data });
    } catch (error) {
      console.error('Error fetching workout:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, id, setLoading]);

  useEffect(() => {
    if (isValidObjectId(id)) {
      // Proceed with fetching the workout
      fetchWorkout()
    } else {
      navigate('/errorPage')
    }
  }, [id, fetchWorkout, navigate]);

  const editWorkout = () => {
    navigate(`/workouts/myworkouts/edit/${workout._id}`)
  }

  const deleteWorkout = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/workouts/myworkouts/${workout._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to delete workout: ${response.statusText}`)
      }
      showToastSuccess('Workout deleted successfully')
      navigate('/workouts/myworkouts')
    } catch (error) {
      console.error('Error deleting workout:', error)
      showToastError( showToastSuccess,'Failed to delete workout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='single-workout-page'>
      {workout &&
        <div className='single-workout-container'>
          <div className='workout-title'>{[workout.title]}</div>
          <div className='workout-img-container'
           style={{ backgroundImage: `url(${workout.imgUrl})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
           alt={workout.title}>
           </div>
          <br />
          <br />
          <div className='exercises-title'>Exercises: {workout.exercises && workout.exercises.map((exercise) =>
            <div className="exercise" key={exercise._id}>
              <div>{exercise.title}</div>
              <img className='exercise-img' src={exercise.imgUrl} alt={exercise.title} />
              <div className='exercise-info'>
                <div>Weight: {exercise.weight}</div>
                <div>Reps: {exercise.reps}</div>
                <div>Sets: {exercise.sets}</div>
                {exercise.videoUrl && <a href={exercise.videoUrl} target='blank'>Video Url</a>}
              </div>

            </div>
          )}</div>

          <div>Creator: {workout.username}</div>
          {workout.createdAt && <p>Created: {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>}

          {
            ((user?.roleType === 'admin') || (user?._id === workout?.user_id)) &&
            <div className='workout-buttons'>
              <button className='workout-button' onClick={editWorkout}>Edit Workout</button>
              <button className='workout-button' onClick={deleteWorkout}>Delete Workout</button>
            </div>
          }
        </div>
      }


    </div>
  )
}
