import { RoleTypes } from '../components/Navbar-config';
import { ACTIONS } from '../context/Actions';
import { useGlobalContext } from './useGlobalContext';

export const useLogout = () => {
  const { dispatch, snackbar, setRoleType } = useGlobalContext()

  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT })
    setRoleType(RoleTypes.none)
    snackbar('user logged out')
    localStorage.removeItem('token')
  }

  return { logout }
}