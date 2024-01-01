import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ErrorPage from './ErrorPage';
import { useGeneralContext } from '../hooks/useGeneralContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Button from '@mui/material/Button'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import { useAuthContext } from '../hooks/useAuthContext';
import ExerciseForm from '../components/ExerciseForm';

export default function SingleWorkout() {
  const { id } = useParams()
  const { setLoading, snackbar, navigate } = useGeneralContext()
  const { workout, dispatch } = useWorkoutContext()
  const { user } = useAuthContext()
  const token = JSON.parse(localStorage.getItem('token'))


  useEffect(() => {
    const fetchWorkout = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/workouts/${id}`)
        const data = await response.json()
        console.log('data: ', data);

        dispatch({ type: ACTIONS.SET_SINGLE_WORKOUT, payload: data })
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false)
      }
    }
    fetchWorkout()
  }, [id, setLoading, dispatch])

  const deleteExercise = async (id) => {
    if (workout.exercises.length === 1) {
      snackbar('A workout must contain at least one exercise')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to delete exercise: ${response.statusText}`)
      }

      const json = await response.json()
      dispatch({ type: ACTIONS.DELETE_EXERCISE, payload: json })

    } catch (error) {
      console.error('Error deleting exercise:', error)
      snackbar('Failed to delete exercise. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addExercise = async (exercise) => {
    exercise.workout_id = workout._id
    console.log('exercise: ', exercise)

    try {
      setLoading(true)
      const response = await fetch('/api/exercises/new', {
        method: 'POST',
        body: JSON.stringify(exercise),
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to add exercise: ${response.statusText}`);
      }
  
      const json = await response.json();
  
      // Update the local state (workout) after successfully adding the exercise
      dispatch({ type: ACTIONS.CREATE_EXERCISE, payload: json }); 

    } catch (error) {
      console.error('Error adding exercise:', error);
    } finally {
      setLoading(false)
    }
  }

  const editExercise = async () => {

  }

  const deleteWorkout = async () => {
    try {
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
    }
  }

  return (
    <div className='SingleWorkout'>
      {workout ?
        <div>
          <div>Workout Title: {[workout.title]}</div>
          <img src={workout.imgUrl} alt={workout.title} />
          <div>Exercises: {workout.exercises && workout.exercises.map((exercise) =>
            <div className="exercise" key={exercise._id}>
              <br />
              <div>Title: {exercise.title}</div>
              {
                user?.roleType === 'master' || user?.roleType === 'admin' ?
                  <>
                    <p className="material-symbols-outlined" onClick={() => deleteExercise(exercise._id)}>delete</p>
                    <p className="material-symbols-outlined" onClick={() => editExercise}>edit</p>
                  </>
                  :
                  (user?._id === workout?.user_id) &&
                  <>
                    <p className="material-symbols-outlined" onClick={() => deleteExercise(exercise._id)}>delete</p>
                    <p className="material-symbols-outlined" onClick={() => editExercise}>edit</p>
                  </>
              }
            </div>
          )}</div>



          {workout.createdAt && <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>}
          <div>Creator: {workout.username}</div>
          {workout.Private}

          {
            user?.roleType === 'master' || user?.roleType === 'admin' ?
              <>
                <button onClick={addExercise}>Add Exercise</button>
                <button onClick={deleteWorkout}>Delete Workout</button>
              </>
              :
              (user?._id === workout?.user_id) &&
              <>
                <ExerciseForm id="exercise-form" onAddExercise={addExercise} />
                <Button
                  onClick={deleteWorkout}
                  variant="contained"
                  sx={{ m: 2 }}
                >
                  Delete Workout
                </Button>
              </>
          }
        </div>
        :
        <ErrorPage />
      }


    </div>
  )
}
