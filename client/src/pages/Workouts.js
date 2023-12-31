import { useEffect } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import logo from '../assets/robots/workouts.png'
import './style/Pages.css'
import '../components/style/WorkoutDetails.css'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'
import { useGlobalContext } from '../hooks/useGlobalContext'

export default function Workouts() {
    const { workouts, dispatch } = useWorkoutContext()
    const { setLoading } = useGlobalContext()

    useEffect(() => {
        const fetchWorkouts = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/workouts')
                const json = await response.json()

                if (response.ok) {
                    dispatch({ type: ACTIONS.SET_WORKOUTS, payload: json })
                }
            } catch (error) {
                console.log("The Promise is rejected!", error)
            } finally {
                setLoading(false)
            }
        }
        fetchWorkouts()
    }, [dispatch, setLoading])

    return (
        <div className='workouts-page'>
            <Typography variant="h1" component="h1" sx={{  fontFamily: "Kanit", fontWeight: 600, fontSize: 48, margin: "30px 0 0 0", textAlign: 'center' }}>
                Workouts Page
            </Typography>
            <Typography component="p" sx={{  fontFamily: "Kanit", fontWeight: 500, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
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
            <img className='bottom-left-icon' src={logo} alt="logo" />
        </div>
    )
}
