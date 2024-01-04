import { RoleTypes } from '../components/Navbar-config';
import { ACTIONS } from '../context/Actions';
import { useAuthContext } from './useAuthContext';
import { useGeneralContext } from './useGeneralContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { snackbar, setRoleType } = useGeneralContext()

  const logout = () => {
    // dispatch logout action
    dispatch({ type: ACTIONS.LOGOUT })
    setRoleType(RoleTypes.none)
    snackbar('user logged out')
    console.log('user logged out')
    localStorage.removeItem('token')
  }

  return { logout }
}