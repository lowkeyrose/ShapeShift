import { RoleTypes } from '../components/Navbar-config'
import { ACTIONS } from '../context/Actions'
import { useGlobalContext } from './useGlobalContext'

export const useLogout = () => {
  const { dispatch, showToastSuccess, setRoleType, navigate, setStop } = useGlobalContext()

  const logout = () => {
    setStop(true)
    dispatch({ type: ACTIONS.LOGOUT })
    setRoleType(RoleTypes.none)
    showToastSuccess('user logged out')
    localStorage.removeItem('token')
    navigate('/')
  }

  return { logout }
}