import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import './style/Account.css'
import './style/Buttons.css'

export default function Account() {
  const { user, navigate } = useContext(GlobalContext)

  return (
    <div className="account-page">
      <div className='account-page-container'>
        <div className='top'>
          <img src={user.profilePic} alt="img" />
          <div className='username'>
            <div className="bg"> {user.username} </div>
            <div className="fg"> {user.username} </div>
          </div>
        </div>
        <div className='bottom'>
          <div className='box'>First Name: {user.firstName}</div>
          <div className='box'>Last Name: {user.lastName}</div>
          <div className='box'>Email: {user.email}</div>
          <div className='box'>Phone: {user.phone}</div>
          <div className='box'>Gender: {user.gender}</div>
        </div>
        <button className='styled-button' onClick={() => navigate(`/account/edit/${user._id}`)}>Edit Account Info</button>
      </div>
    </div>
  )
}