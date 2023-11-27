import { useContext } from 'react'
import { GeneralContext } from '../context/GeneralContext'

export const useGeneralContext = () => {
  const context = useContext(GeneralContext)

  if (!context) {
    throw Error('useGeneralContext must be used inside an GeneralContextProvider')
  }

  return context
}