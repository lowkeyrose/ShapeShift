import { createContext, useReducer } from "react"
import { ACTIONS } from "./Actions"

export const WorkoutContext = createContext()

export const workoutReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_WORKOUTS:
      return {
        workouts: action.payload
      }
    case ACTIONS.CREATE_WORKOUT:
      return {
        workouts: [action.payload, state.workouts]
      }
    case ACTIONS.DELETE_WORKOUT:
      return {
        workouts: state.workouts.filter(w => w._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const WorkoutContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, {
    workouts: null
  })
  return (
    <WorkoutContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  )
}