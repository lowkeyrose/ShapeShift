import { createContext, useReducer } from "react"
import { ACTIONS } from "./Actions"

export const WorkoutContext = createContext()

export const workoutReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_WORKOUTS:
      return {
        ...state,
        workouts: action.payload,
      };
    case ACTIONS.CREATE_WORKOUT:
      return {
        ...state,
        workouts: [action.payload, ...state.workouts],
      };
    case ACTIONS.DELETE_WORKOUT:
      return {
        ...state,
        workouts: state.workouts.filter((w) => w._id !== action.payload._id),
      };
    case ACTIONS.INCREMENT_LIKES:
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w._id === action.payload._id ? { ...w, likes: (w.likes || 0) + 1 } : w
        ),
      };
    case ACTIONS.DECREMENT_LIKES:
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w._id === action.payload._id ? { ...w, likes: Math.max((w.likes || 0) - 1, 0) } : w
        ),
      };
    default:
      return state;
  }
};

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