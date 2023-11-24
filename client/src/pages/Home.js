import { useEffect } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
// import { useAuthContext } from '../hooks/useAuthContext'
import { ACTIONS } from '../context/Actions'
import logo from '../assets/spaceman.jpg'
import './style/Home.css'
import '../components/style/WorkoutDetails.css'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'

export default function Home() {
    const { workouts, dispatch } = useWorkoutContext()
    // const { user } = useAuthContext()

    useEffect(() => {
        const fetchWorkouts = async () => {
            const response = await fetch('/api/workouts')
            const json = await response.json()

            if (response.ok) {
                dispatch({ type: ACTIONS.SET_WORKOUTS, payload: json })
            }
        }
        fetchWorkouts()
    }, [dispatch])

    return (
        <div className='home'>
            <Typography variant="h1" component="h1" sx={{ fontFamily: "Pacifico, cursive", fontWeight: 600, fontSize: 48, margin: "30px 0 20px 0", paddingBottom: "10px", textAlign: 'center' }}>
                Your Personal Workout Buddy
                <Typography component="p" sx={{ fontWeight: 600, fontSize: 16 }}>
                    <br />
                    {workouts ? "Here you can find all the workouts created by our users" : "There are no workouts currently available, be the first and create the first workout!"}
                </Typography>
            </Typography>
            <div className="workouts">
                {workouts && workouts.map((workout) => (
                    <WorkoutDetails key={workout._id} workout={workout} />
                ))}
            </div>
            <img className='robot' src={logo} alt="logo" />
        </div>
    )
}
