import { ACTIONS } from "../context/Actions"
import { useWorkoutContext } from "../hooks/useWorkoutContext"

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function WorkoutDetails({ workout }) {

  const { dispatch } = useWorkoutContext()
  const user = JSON.parse(localStorage.getItem('user'))

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
      {workout.imgUrl ? <img src={workout.imgUrl} alt={workout.imgUrl} /> : <img src='https://c4.wallpaperflare.com/wallpaper/599/689/236/machine-dwayne-johnson-the-rock-workout-wallpaper-preview.jpg' alt="Workout-img" />}
      
      {/* Uncaught Error: Objects are not valid as a React child (found: object with keys {_id}). If you meant to render a collection of children, use an array instead. line below */}
      <p><strong>Exercises: </strong>{[workout.exercises].length}</p>

      <p><strong>Private: </strong>{workout.Private}</p>
      {/* <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p> */}
      {user && <span className="material-symbols-outlined" onClick={handleClick}>delete</span>}
    </div>
  )
}
