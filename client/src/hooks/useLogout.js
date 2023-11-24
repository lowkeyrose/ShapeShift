import { ACTIONS } from '../context/Actions';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = () => {
    // dispatch logout action
    dispatch({ type: ACTIONS.LOGOUT })
  }

  return { logout }
}