// import { ACTIONS } from "../context/Actions"
// import { useWorkoutContext } from "../hooks/useWorkoutContext"
// import { useAuthContext } from '../hooks/useAuthContext'

// // date fns
// import formatDistanceToNow from 'date-fns/formatDistanceToNow'

// export default function WorkoutDetails({ workout }) {

//   const { dispatch } = useWorkoutContext()
//   const { user } = useAuthContext()

//   const handleClick = async () => {
//     const response = await fetch(`/api/workouts/${workout._id}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${user.token}`
//       }
//     })
//     const json = await response.json()

//     if (response.ok) {
//       dispatch({ type: ACTIONS.DELETE_WORKOUT, payload: json })
//     }
//   }

//   return (
//     <div className="workout-details">
//       <h4>{workout.title}</h4>
//       <p><strong>Sets: </strong>{workout.sets}</p>
//       <p><strong>Weight (kg): </strong>{workout.weight}</p>
//       <p><strong>Reps: </strong>{workout.reps}</p>
//       <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
//       {user && <span className="material-symbols-outlined" onClick={handleClick}>delete</span>}
//     </div>
//   )
// }
