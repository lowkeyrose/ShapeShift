import { useEffect, useState } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import logo from '../assets/spaceman.jpg'
import './style/Home.css'
import '../components/style/WorkoutDetails.css'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'
// import { useGeneralContext } from '../hooks/useGeneralContext'

export default function Home() {
    const { workouts, dispatch } = useWorkoutContext()
    // const [favoritesCount, setFavoritesCounts] = useState([]);
    // const { setLoading } = useGeneralContext()

    useEffect(() => {
        // setLoading(true)
        const fetchWorkouts = async () => {
            const response = await fetch('/api/workouts')
            const json = await response.json()

            console.log('json', json);

            if (response.ok) {
                dispatch({ type: ACTIONS.SET_WORKOUTS, payload: json })
                // dispatch({ type: ACTIONS.SET_WORKOUTS, payload: json.workouts })
                // setFavoritesCounts(json.workoutsWithFavoritesCount);
            }
        }
        fetchWorkouts()
        // setLoading(false)
    }, [dispatch])

    return (
        <div className='home'>
            <Typography variant="h1" component="h1" sx={{ fontFamily: "Pacifico, cursive", fontWeight: 600, fontSize: 48, margin: "30px 0 0 0", textAlign: 'center' }}>
                Your Personal Workout Buddy
            </Typography>
            <Typography component="p" sx={{ fontWeight: 600, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
                <br />
                {workouts && workouts.length > 0 ? "Here you can find all the workouts created by our users" : "There are no workouts currently available, be the first and create the first workout!"}
            </Typography>
            <div className="workouts">
                {workouts && workouts.map((workout) => {
                    if (!workout.Private) {
                        // return <WorkoutDetails key={workout._id} workout={workout} favoriteCount={favoritesCount[workout._id].favoritesCount}/>
                        // const favoritesCount = favoritesCount.find((count) => count.workout._id === workout._id)?.favoritesCount || 0;
                        // const favoritesCountForWorkout = favoritesCount.find((count) => count.workout._id === workout._id)?.favoritesCount || 0;
                        // return <WorkoutDetails key={workout._id} workout={workout} favoriteCount={favoritesCountForWorkout}/>
                        return <WorkoutDetails key={workout._id} workout={workout}/>
                    } else {
                        return null
                    }
                }
                )}
            </div>
            <img className='robot' src={logo} alt="logo" />
        </div>
    )
}
