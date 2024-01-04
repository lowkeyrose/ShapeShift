import { useEffect } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import logo from '../assets/spaceman.jpg'
import './style/Pages.css'
import '../components/style/WorkoutDetails.css'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'
import { useGeneralContext } from '../hooks/useGeneralContext'

export default function Home() {
    const { workouts, dispatch } = useWorkoutContext()
    const { setLoading } = useGeneralContext()

    useEffect(() => {
        const fetchWorkouts = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/workouts')
                const data = await response.json()
                if (response.ok) {
                    dispatch({ type: ACTIONS.SET_WORKOUTS, payload: data })
                }
            } catch (error) {
                console.error('Error fetching workouts:', error);
            } finally {
                setLoading(false)
            }
        }
        fetchWorkouts()
    }, [dispatch, setLoading])

    return (
        <div className='home'>
            <Typography variant="h1" component="h1" sx={{ fontFamily: "Pacifico, cursive", fontWeight: 600, fontSize: 48, textAlign: 'center' }}>
                Your Personal Workout Buddy
            </Typography>
            <Typography component="p" sx={{ fontWeight: 600, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
                <br />
                {workouts && workouts.length > 0 ? "Here you can find all the workouts created by our users" : "There are no workouts currently available, be the first and create the first workout!"}
            </Typography>
            <div className="workouts">
                {workouts && workouts.map((workout) => {
                    if (!workout.Private) {
                        return <WorkoutDetails key={workout._id} workout={workout} />
                    } else {
                        return null
                    }
                }
                )}
            </div>
            <img className='bottom-right-icon' src={logo} alt="logo" />
        </div>
    )
}
