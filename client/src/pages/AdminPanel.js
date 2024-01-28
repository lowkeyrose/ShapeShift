import { useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useGlobalContext } from '../hooks/useGlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import logo from '../assets/robots/adminPanel.png'
import './style/Pages.css'
import '../components/style/WorkoutDetails.css'
import './style/Buttons.css'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [cardFormat, setCardFormat] = useState(false)
  const { token, navigate, showToastError, showToastSuccess, setLoading } = useGlobalContext();

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/users', {
        headers: {
          'Authorization': token
        }
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server returned an error:', response.status, data);
      }
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false)
    }
  }, [token, setLoading])
  
  useEffect(() => {
    fetchUsers()
    return () => {
      setUsers([])
    }
  }, [fetchUsers])

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      })
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`)
      }
      setUsers((prevUsers) => {
        return prevUsers.filter((user) => user._id !== id)
      })
      showToastSuccess('Successfully deleted')
    } catch (error) {
      console.error('Error deleting user:', error)
      showToastError('Failed to delete user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='admin-panel'>
      {
        users && cardFormat
          ?
          <>
            <button className='styled-button' onClick={() => setCardFormat(false)}>Table Format</button>
            <div className="users">
              {users &&
                users.map((user) =>
                  <div className="card" key={user._id}>
                    <figure className="figure">
                      <h1 className='user-title' style={{ textAlign: 'center' }}>{user.username?.toUpperCase()}</h1>
                      <img className="img" src={user.profilePic} alt={user.username} />
                      {user.createdAt && <p>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</p>}
                    </figure>
                    <div className="multi-button admin">
                      {
                        <>
                          <button onClick={() => handleDelete(user._id)}><FontAwesomeIcon icon={faTrash} /></button>
                          <button onClick={() => navigate(`/admin-panel/user/${user._id}`)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                        </>
                      }
                    </div>
                  </div>
                )}
            </div>
          </>
          :
          <>
            <button className='styled-button' onClick={() => setCardFormat(true)}>Card Format</button>
            <TableContainer component={Paper} sx={{ marginTop: '40px', boxShadow: '3px 3px 15px', borderRadius: '10px', width: '90%', height: '100%' }}>
              <Table sx={{ minWidth: 700, m: 'auto' }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Email</StyledTableCell>
                    <StyledTableCell align="center">Full Name</StyledTableCell>
                    <StyledTableCell align="center">Username</StyledTableCell>
                    <StyledTableCell align="center">RoleType</StyledTableCell>
                    <StyledTableCell align="center">Manage</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <StyledTableRow key={user.username}>
                      <StyledTableCell align="center" component="th">{user.email}</StyledTableCell>
                      <StyledTableCell align="center">{`${user.firstName} ${user.lastName}`}</StyledTableCell>
                      <StyledTableCell align="center">{user.username}</StyledTableCell>
                      <StyledTableCell align="center">{user.roleType}</StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="table-buttons">
                          <button className='table-button' onClick={() => navigate(`/admin-panel/user/${user._id}`)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                          <button className='table-button' onClick={() => handleDelete(user._id)}><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </>
      }
      <img className='bottom-left-icon' src={logo} alt="logo" />

    </div>

  );
}