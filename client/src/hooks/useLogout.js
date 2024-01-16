import { RoleTypes } from '../components/Navbar-config';
import { ACTIONS } from '../context/Actions';
import { useGlobalContext } from './useGlobalContext';

export const useLogout = () => {
  const { dispatch, showToastSuccess, setRoleType, navigate } = useGlobalContext()

  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT })
    setRoleType(RoleTypes.none)
    showToastSuccess('user logged out')
    localStorage.removeItem('token')
    navigate('/')
  }

  return { logout }
}