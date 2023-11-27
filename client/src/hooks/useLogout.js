import { ACTIONS } from '../context/Actions';
import { useAuthContext } from './useAuthContext';
import { useGeneralContext } from './useGeneralContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { snackbar } = useGeneralContext()

  const logout = () => {
    // dispatch logout action
    snackbar('user logged out')
    dispatch({ type: ACTIONS.LOGOUT })
  }

  return { logout }
}