import { useEffect } from 'react'
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
    const { navigate } = useGeneralContext()
    const { workouts, dispatch } = useWorkoutContext()
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            const fetchWorkouts = async () => {
                try {
                    const response = await fetch('/api/workouts/myworkouts', {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })

                    if (!response.ok) {
                        throw new Error(`Failed to fetch workouts: ${response.statusText}`);
                    }
                    
                    const data = await response.json()

                    dispatch({ type: ACTIONS.SET_WORKOUTS, payload: data })

                } catch (error) {
                    console.error('Error fetching workouts:', error);
                }
            }
            fetchWorkouts()
        }
    }, [dispatch])

    return (
        <div className='home'>
            <div className="workouts">
                <Typography variant="h1" component="h1" sx={{ fontFamily: "Pacifico, cursive", fontWeight: 600, fontSize: 48, margin: "30px 0 20px 0", paddingBottom: "10px", textAlign: 'center' }}>
                    My Workouts
                    <Typography component="p" sx={{ fontWeight: 600, fontSize: 16 }}>
                        <br />
                        {workouts ? "Here are your awesome workouts" : "You current have no available workouts, Add your first one today!"}
                    </Typography>
                </Typography>

                {workouts && workouts.map((workout) => (
                    <WorkoutDetails key={workout._id} workout={workout} />
                ))}

                <Button sx={{ p: 2, position: 'fixed', right: 20, bottom: 20 }} variant="contained" color="success" endIcon={<AddCircleIcon />} onClick={() => navigate('/workouts/myworkouts/new')} >Create A New Workout</Button>

            </div>
        </div>
    )
}