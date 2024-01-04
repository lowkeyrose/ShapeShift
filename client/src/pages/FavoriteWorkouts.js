import React, { useEffect, useCallback } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import logo from '../assets/favorites.png'
import './style/Pages.css'


// import Button from '@mui/material/Button'
// import AddCircleIcon from '@mui/icons-material/AddCircle';

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'
import { useGeneralContext } from '../hooks/useGeneralContext'
// import { useAuthContext } from '../hooks/useAuthContext';

export default function FavoirteWorkouts() {
  const { token, setLoading } = useGeneralContext()
  const { workouts, dispatch } = useWorkoutContext()
  // const { user, dispatch2 } = useAuthContext()

  const favoriteWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      console.log('favoriteWorkouts start');
      const response = await fetch('/api/workouts/favoriteworkouts', {
        headers: {
          'Authorization': token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        dispatch({ type: ACTIONS.SET_WORKOUTS, payload: data });
      } else {
        console.log('response failed');
        throw new Error(`Failed to fetch workouts: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
      console.log('favoriteWorkouts end');
    }
  }, [dispatch, token, setLoading]);

  useEffect(() => {
    if (token) {
      favoriteWorkouts()
    }
  }, [token, favoriteWorkouts]);

  return (
    <div className='favorites-page'>
      <Typography variant="h1" component="h1" sx={{ fontFamily: "Pacifico, cursive", fontWeight: 600, fontSize: 48, textAlign: 'center' }}>
        Favorite Workouts
      </Typography>
      <Typography component="p" sx={{ fontWeight: 600, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
        <br />
        {workouts && workouts.length > 0 ? "Here are your awesome workouts" : "You current have no available workouts, Add your first one today!"}
      </Typography>

      <div className="workouts">
        {workouts && workouts.map((workout) => (
          <WorkoutDetails key={workout._id} workout={workout} favoriteWorkouts={favoriteWorkouts} />
        ))}
      </div>

      <img className='bottom-right-icon' src={logo} alt="logo" />
    </div>
  )
}