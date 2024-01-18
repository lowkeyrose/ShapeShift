import React, { useCallback, useEffect } from 'react'
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
import { search } from '../components/Searchbar';

export default function MyWorkouts() {
    const { navigate, setLoading, token, searchWord } = useGlobalContext()
    const { workouts, dispatch } = useWorkoutContext()
    // console.log("MyWorkouts component rendered"); // Add this line

    const fetchWorkouts = useCallback(async () => {
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
    }, [dispatch, setLoading, token])

    useEffect(() => {
        if (token) {
            fetchWorkouts()
        }
        return () => {
            dispatch({ type: ACTIONS.SET_WORKOUTS, payload: [] });
        }
    }, [dispatch, token, fetchWorkouts])

    return (
        <div className='my-workouts-page'>
            <Typography variant="h1" component="h1" sx={{ fontFamily: "Kanit", fontWeight: 600, fontSize: 48, margin: "30px 0 0 0", textAlign: 'center' }}>
                My Workouts
            </Typography>
            <Typography component="p" sx={{ fontFamily: "Kanit", fontWeight: 500, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
                <br />
                {workouts && workouts.length > 0 ? "Here are the awesome workouts you've created!" : "You current have no available workouts, Add your first one today!"}
            </Typography>

            <div className="workouts">
                {workouts &&
                    workouts.filter(workout => search(searchWord, workout.title)).map((workout) => {
                        // use String(workout._id) because i kept getting a Each child in a list should have a unique "key" prop. warning
                        return <WorkoutDetails key={String(workout._id)} workout={workout} />;
                    })}
            </div>

            <Button sx={{ display:'flex', justifyContent:'center', alignItems:'center', position: 'fixed', right: 20, bottom: 20, borderRadius:'100%', padding:0,  zIndex:999, minWidth: 'unset', backgroundColor: '#409c45', color:'#b2dbb6'}} variant="contained" color="success" onClick={() => navigate('/workouts/myworkouts/create/new')} >
            <AddCircleIcon sx={{fontSize:'60px', m:0, p:0}} />
            </Button>
            <img className='bottom-left-icon' src={logo} alt="logo" />
        </div>
    )
}