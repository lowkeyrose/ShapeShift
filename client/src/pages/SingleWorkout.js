import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useGlobalContext } from '../hooks/useGlobalContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
// import Button from '@mui/material/Button'
// import DeleteIcon from '@mui/icons-material/Delete';
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import './style/SingleWorkout.css'
import './style/Buttons.css'

export default function SingleWorkout() {
  const { id } = useParams()
  const { user, setLoading, showToastError, showToastSuccess, navigate, token, isValidObjectId } = useGlobalContext()
  const { workout, dispatch } = useWorkoutContext()

  const fetchWorkout = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workouts/workout/${id}`);
      // Validate the id belongs to a workout
      if (!response.ok) {
        navigate('/errorPage')
        throw new Error(`Workout not found: ${response.statusText}`);
      }
      const data = await response.json();
      dispatch({ type: ACTIONS.SET_SINGLE_WORKOUT, payload: data });
    } catch (error) {
      console.error('Error fetching workout:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, id, setLoading, navigate]);

  useEffect(() => {
    if (isValidObjectId(id)) {
      fetchWorkout()
    } else {
      navigate('/errorPage')
    }
    // eslint-disable-next-line
  }, [id, fetchWorkout, navigate, dispatch]);

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
      showToastError(showToastSuccess, 'Failed to delete workout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='single-workout-page'>
      {workout &&
        <div className='single-workout-container'>
          <div className='workout-title'>{[workout.title]}</div>


          <div className="img-container">
            <img className='workout-img' src={workout.imgUrl} alt={workout.title}>
            </img>
          </div>

          <br />
          <br />
          <div className='exercises-container'>
            <h1 className='Exercises-title'>Exercises:</h1>
            {workout.exercises && workout.exercises.map((exercise) =>
              <div className="exercise" key={exercise._id}>
                <div className='exercise-title'>{exercise.title}</div>
                <img className='exercise-img' src={exercise.imgUrl} alt={exercise.title} />
                <div className='exercise-info'>
                  <div>Weight: {exercise.weight}</div>
                  <div>Reps: {exercise.reps}</div>
                  <div>Sets: {exercise.sets}</div>
                  <div>Duration: {exercise.duration}</div>
                  {exercise.videoUrl && <a href={exercise.videoUrl} target='blank'>Video</a>}
                </div>

              </div>
            )}</div>

          <div>Creator: {workout.username}</div>
          {workout.createdAt && <p>Created: {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>}

          {
            ((user?.roleType === 'admin') || (user?._id === workout?.user_id)) &&
            <div className='workout-buttons'>
              <button className='styled-button' onClick={editWorkout}>Edit Workout</button>
              <button className='styled-button' onClick={deleteWorkout}>Delete Workout</button>
            </div>
          }
        </div>
      }


    </div>
  )
}
