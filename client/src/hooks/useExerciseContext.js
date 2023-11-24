import { useContext } from 'react'
import { ExerciseContext } from '../context/WorkoutContext'

export const useExerciseContext = () => {
  const context = useContext(ExerciseContext)

  if (!context) {
    throw Error('useExerciseContext must be used inside an ExerciseContextProvider')
  }

  return context
}