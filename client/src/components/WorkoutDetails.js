import { ACTIONS } from "../context/Actions"
import { useWorkoutContext } from "../hooks/useWorkoutContext"
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function WorkoutDetails({ workout }) {

  const { dispatch } = useWorkoutContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    const response = await fetch(`/api/workouts/myworkouts/${workout._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: ACTIONS.DELETE_WORKOUT, payload: json })
    }
  }

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      {workout.imgUrl ? <img src={workout.imgUrl} alt={workout.imgUrl} /> : <img src='../assets/default-workout.jpg' alt="Workout-img" />}
      <p><strong>Exercises: </strong>{workout.exercises}</p>
      <p><strong>Private: </strong>{workout.Private}</p>
      <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
      {user && <span className="material-symbols-outlined" onClick={handleClick}>delete</span>}
    </div>
  )
}
