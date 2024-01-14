import React, { useEffect } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import logo from '../assets/robots/myworkouts.png'
import '../components/style/WorkoutDetails.css'
import './style/Pages.css'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'
import { useGlobalContext } from '../hooks/useGlobalContext'

export default function MyWorkouts() {
    const { navigate, setLoading, token } = useGlobalContext()
    const { workouts, dispatch } = useWorkoutContext()
    // console.log("MyWorkouts component rendered"); // Add this line

    useEffect(() => {
        if (token) {
            const fetchWorkouts = async () => {
                // console.log("Fetching My-workouts...");

                setLoading(true)
                try {
                    const response = await fetch('/api/workouts/myworkouts', {
                        headers: {
                            'Authorization': token
                        }
                    })
                    const data = await response.json()
                    if (!response.ok) {
                        throw new Error(`Failed to fetch workouts: ${response.statusText}`);
                    }
                    dispatch({ type: ACTIONS.SET_WORKOUTS, payload: data })
                } catch (error) {
                    console.error('Error fetching workouts:', 'error:', error, 'error.message:', error.message, 'error.stack:', error.stack);
                } finally {
                    setLoading(false)
                }
            }
            fetchWorkouts()
        }
        return () => {
            dispatch({ type: ACTIONS.SET_WORKOUTS, payload: [] });
        }
    }, [dispatch, token, setLoading])

    return (
        <div className='my-workouts-page'>
            <Typography variant="h1" component="h1" sx={{ fontFamily: "Kanit", fontWeight: 600, fontSize: 48, margin: "30px 0 0 0", textAlign: 'center' }}>
                My Workouts
            </Typography>
            <Typography component="p" sx={{ fontFamily: "Kanit", fontWeight: 500, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
                <br />
                {workouts && workouts.length > 0 ? "Here are your awesome workouts" : "You current have no available workouts, Add your first one today!"}
            </Typography>

            <div className="workouts">
                {workouts &&
                    workouts.map((workout) => {
                        // use String(workout._id) because i kept getting a Each child in a list should have a unique "key" prop. warning
                        return <WorkoutDetails key={String(workout._id)} workout={workout} />;
                    })}
            </div>

            <Button sx={{ p: 2, position: 'fixed', right: 20, bottom: 20 }} variant="contained" color="success" endIcon={<AddCircleIcon />} onClick={() => navigate('/workouts/myworkouts/create/new')} >Create A New Workout</Button>

            <img className='bottom-left-icon' src={logo} alt="logo" />
        </div>
    )
}