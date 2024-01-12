import { useEffect } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import { memo } from 'react'
import logo from '../assets/robots/home.png'
import './style/Pages.css'
import '../components/style/WorkoutDetails.css'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'
import { useGlobalContext } from '../hooks/useGlobalContext'

const Home = () => {
    const { workouts, dispatch } = useWorkoutContext()
    const { setLoading } = useGlobalContext()
    // console.log("Home component rendered"); // Add this line

    useEffect(() => {
        const fetchWorkouts = async () => {
            // console.log("Fetching workouts...");
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
        return () => {
            dispatch({ type: ACTIONS.SET_WORKOUTS, payload: [] });
        }
    }, [dispatch, setLoading])

    return (
        <div className='home'>
            <Typography variant="h1" component="h1" sx={{ fontFamily: "Kanit", margin: "30px 0 0 0", fontWeight: 600, fontSize: 48, textAlign: 'center' }}>
                Your Personal Workout Buddy
            </Typography>
            <Typography component="p" sx={{ fontFamily: "Kanit", fontWeight: 500, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
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
            <img className='home-icon' src={logo} alt="logo" />
        </div>
    )
}
export default memo(Home)
