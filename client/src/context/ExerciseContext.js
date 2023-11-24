import { createContext, useReducer } from "react"
import { ACTIONS } from "./Actions"

export const ExerciseContext = createContext()

export const exerciseReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_EXERCISES:
      return {
        exercises: action.payload
      }
    case ACTIONS.CREATE_EXERCISE:
      return {
        exercises: [action.payload, ...state.exercises]
      }
    case ACTIONS.DELETE_EXERCISE:
      return {
        exercises: state.exercises.filter(w => w._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const ExerciseContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(exerciseReducer, {
    exercises: null
  })
  return (
    <ExerciseContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ExerciseContext.Provider>
  )
}