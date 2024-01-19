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
import './style/Pages.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';


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
  const { token, navigate, showToastError, setLoading } = useGlobalContext();
  
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      console.log('inside the try: ');
      const response = await fetch('/api/user/users', {
        headers: {
          'Authorization': token
        }
      });
      console.log('response: ', response);
      const data = await response.json();
      if (response.ok) {
        setUsers(data)
        console.log('data: ', data);
      } else {
        console.error('Server returned an error:', response.status, data);
      }
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
    } catch (error) {
      console.error('Error deleting user:', error)
      showToastError('Failed to delete user. Please try again.')
    }
  }

  return (
    <div className='admin-panel'>
      {
        users &&
        <TableContainer component={Paper} sx={{ boxShadow: '3px 3px 15px', borderRadius: '10px', width: '90%', height: '100%' }}>
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
                    <div className="buttons">
                      <button className='button' onClick={() => navigate(`/admin-panel/user/${user._id}`)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                      <button className='button' onClick={() => handleDelete(user._id)}><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </StyledTableCell>

                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </div>
  );
}