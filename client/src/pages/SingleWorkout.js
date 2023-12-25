import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ErrorPage from './ErrorPage';
import { useGeneralContext } from '../hooks/useGeneralContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'

export default function SingleWorkout() {
  const { id } = useParams()
  const { setLoading } = useGeneralContext()
  const { workout, dispatch } = useWorkoutContext()

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

  return (
    <div className='SingleWorkout'>
      {workout ?
        <div>
          <div>Workout Title: {[workout.title]}</div>
          <img src={workout.imgUrl} alt={workout.title} />
          <div>Exercises: {workout.exercises.map((exercise) =>
            <div className="exercise" key={exercise._id}>
              <br />
              <div>Title: {exercise.title}</div>
            </div>
          )}</div>



          {workout.createdAt && <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>}
          <div>Creator: {workout.username}</div>
          {/* {workout.exercises.map(exercise => (
            <div>{exercise.title}</div>
          ))} */}
          {workout.Private}
        </div>
        :
        <ErrorPage />
      }


    </div>
  )
}
