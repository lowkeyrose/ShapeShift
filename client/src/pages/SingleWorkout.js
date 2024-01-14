import React, { useEffect } from 'react'
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
  const { user, setLoading, snackbar, navigate, token } = useGlobalContext()
  const { workout, dispatch } = useWorkoutContext()

  // const fetchWorkout = useCallback(
  //   async () => {
  //     setLoading(true);

  //     try {
  //       const response = await fetch(`/api/workouts/workout/${id}`);
  //       if (!response.ok) {
  //         throw new Error(`Workout not found: ${response.statusText}`);
  //       }
  //       const data = await response.json();

  //       dispatch({ type: ACTIONS.SET_SINGLE_WORKOUT, payload: data });
  //     } catch (error) {
  //       console.error('Error fetching workout:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, [dispatch, id, setLoading]);

  // useEffect(() => {
  //   if (isValidObjectId(id)) {
  //     // Proceed with fetching the workout
  //     fetchWorkout()
  //   } else {
  //     navigate('/errorPage')
  //   }
  // }, [id, fetchWorkout, navigate]);

  useEffect(() => {
    if (isValidObjectId(id)) {
      const fetchWorkout = async () => {
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
        };
      fetchWorkout()
    } else {
      navigate('/errorPage')
    }
  }, [id, dispatch, setLoading, navigate]);


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
      navigate('/workouts/myworkouts')
    } catch (error) {
      console.error('Error deleting workout:', error)
      snackbar('Failed to delete workout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='single-workout-page'>
      {workout &&
        <div>
          <div>Workout Title: {[workout.title]}</div>
          <img src={workout.imgUrl} alt={workout.title} />
          <div>Exercises: {workout.exercises && workout.exercises.map((exercise) =>
            <div className="exercise" key={exercise._id}>
              <br />
              <div>Title: {exercise.title}</div>
              {/* Add exercises info as cards maybe */}
            </div>
          )}</div>

          {workout.createdAt && <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>}
          <div>Creator: {workout.username}</div>
          {workout.Private}

          {
            ((user?.roleType === 'admin') || (user?._id === workout?.user_id)) &&
            <>
              <button onClick={editWorkout}>Edit Workout</button>
              <button onClick={deleteWorkout}>Delete Workout</button>
            </>
          }
        </div>
      }


    </div>
  )
}
