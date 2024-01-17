import React, { createContext, useReducer } from "react"
import { ACTIONS } from "./Actions"

export const WorkoutContext = createContext()

export const workoutReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_WORKOUTS:
      // Ensure immutability by creating a new array reference like ...state,
      return {
        // if state was workout change it to workouts
        workouts: [...action.payload]
      }

    case ACTIONS.SET_SINGLE_WORKOUT:
      return {
        // if state was workouts change it to workout
        workout: action.payload
      }

    case ACTIONS.CREATE_WORKOUT:
      return {
        workouts: [action.payload, ...(state.workouts || [])]
      }

    case ACTIONS.REMOVE_WORKOUT:
      return {
        workouts: state.workouts.filter((w) => w._id !== action.payload.workoutId)
      }

    // case ACTIONS.UPDATE_WORKOUT:
    //   return {
    //     ...state,
    //     workouts: state.workouts.map((w) =>
    //       w._id === action.payload._id ? w : action.payload 
    //     ),
    //   };

    case ACTIONS.INCREMENT_LIKES:
      return {
        workouts: state.workouts.map((w) =>
          w._id === action.payload ? { ...w, likes: (w.likes || 0) + 1 } : w
        ),
      }
    case ACTIONS.DECREMENT_LIKES:
      return {
        workouts: state.workouts.map((w) =>
          w._id === action.payload ? { ...w, likes: Math.max((w.likes || 0) - 1, 0) } : w
        ),
      }
    default:
      return state;
  }
};

export const WorkoutContextProvider = React.memo(({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, {
    workouts: null
  })

  console.log('WorkoutContext state: ', state)

  return (
    <WorkoutContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  )
})