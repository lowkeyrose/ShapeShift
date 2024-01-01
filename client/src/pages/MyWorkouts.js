import React, { useEffect } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import '../components/style/WorkoutDetails.css'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'
import { useGeneralContext } from '../hooks/useGeneralContext'

export default function MyWorkouts() {
    const { navigate, setLoading } = useGeneralContext()
    const { workouts, dispatch } = useWorkoutContext()
    const token = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        if (token) {
            setLoading(true)
            const fetchWorkouts = async () => {
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
                    console.error('Error fetching workouts:', error);
                } finally {
                    setLoading(false)
                }
            }
            fetchWorkouts()
        }
    }, [dispatch, token, setLoading])

    return (
        <div className='home'>
            <div className="workouts">
                <Typography variant="h1" component="h1" sx={{ fontFamily: "Pacifico, cursive", fontWeight: 600, fontSize: 48, margin: "30px 0 0 0", textAlign: 'center' }}>
                    My Workouts
                </Typography>
                <Typography component="p" sx={{ fontWeight: 600, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
                    <br />
                    {workouts && workouts.length > 0 ? "Here are your awesome workouts" : "You current have no available workouts, Add your first one today!"}
                </Typography>

                {workouts && workouts.map((workout) =>
                    <WorkoutDetails key={workout._id} workout={workout} />
                )}

                <Button sx={{ p: 2, position: 'fixed', right: 20, bottom: 20 }} variant="contained" color="success" endIcon={<AddCircleIcon />} onClick={() => navigate('/workouts/myworkouts/new')} >Create A New Workout</Button>

            </div>
        </div>
    )
}