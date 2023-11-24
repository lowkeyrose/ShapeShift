import { useContext, useEffect } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { ACTIONS } from '../context/Actions'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import '../components/style/WorkoutDetails.css'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'
import { GeneralContext } from '../App'

export default function MyWorkouts() {
    const { navigate } = useContext(GeneralContext)
    const { workouts, dispatch } = useWorkoutContext()
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchWorkouts = async () => {
            const response = await fetch('/api/workouts/myworkouts', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const data = await response.json()

            if (response.ok) {
                dispatch({ type: ACTIONS.SET_WORKOUTS, payload: data })
            }
        }
        if (user) {
            fetchWorkouts()
        }
    }, [dispatch, user])

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