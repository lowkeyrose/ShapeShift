import { useCallback, useEffect, useState } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import logo from '../assets/robots/workouts.png'
import '../components/style/WorkoutDetails.css'
import './style/Pages.css'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { useGlobalContext } from '../hooks/useGlobalContext'
import { search } from '../components/Searchbar'
import { Typography } from '@mui/material'
import Filter from '../components/Filter'
import SortBy from '../components/SortBy'

export default function Workouts() {
    const { workouts, dispatch } = useWorkoutContext()
    const { setLoading, searchWord } = useGlobalContext()
    const [filteredData, setFilteredData] = useState([]);
    const [activeFilters, setActiveFilters] = useState({
        filterByLikes: null,
        filterByExercises: null,
    });
    const [sortOption, setSortOption] = useState(null);

    const fetchWorkouts = useCallback(async () => {
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
    }, [dispatch, setLoading])

    useEffect(() => {
        console.log('fetch useEffect');
        fetchWorkouts()
        return () => {
            dispatch({ type: ACTIONS.SET_WORKOUTS, payload: [] });
        }
    }, [dispatch, fetchWorkouts])

    const handleFilterChange = ({ filterByLikes, filterByExercises }) => {
        setActiveFilters({
            filterByLikes,
            filterByExercises,
        });
    };

    const applyFilters = useCallback((workouts) => {
        return workouts.filter((workout) =>
            (activeFilters.filterByLikes === null ||
                workout.likes >= activeFilters.filterByLikes) &&
            (activeFilters.filterByExercises === null ||
                workout.exercises.length >= activeFilters.filterByExercises)
        );
    }, [activeFilters])

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const sortWorkouts = useCallback((data) => {
        if (sortOption === 'exercises-asc') {
            return data.slice().sort((a, b) => a.exercises.length - b.exercises.length);
        } else if (sortOption === 'exercises-desc') {
            return data.slice().sort((a, b) => b.exercises.length - a.exercises.length);
        } else if (sortOption === 'likes-asc') {
            return data.slice().sort((a, b) => a.likes - b.likes);
        } else if (sortOption === 'likes-desc') {
            return data.slice().sort((a, b) => b.likes - a.likes);
        } else if (sortOption === 'oldest') {
            return data.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortOption === 'newest') {
            return data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return data;
    }, [sortOption]);

    useEffect(() => {
        if (workouts) {
            const filteredWorkouts = applyFilters(workouts);
            const sortedWorkouts = sortWorkouts(filteredWorkouts);
            setFilteredData(sortedWorkouts);
        }
    }, [applyFilters, sortWorkouts, workouts]);

    return (
        <div className='workouts-page'>
            <Typography variant="h1" component="h1" sx={{ fontFamily: "Kanit", fontWeight: 600, fontSize: 48, margin: "30px 0 0 0", textAlign: 'center' }}>
                Workouts Page
            </Typography>
            <Typography component="p" sx={{ fontFamily: "Kanit", fontWeight: 500, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
                <br />
                {workouts && workouts.length > 0 ? "Here you can find all the workouts created by our users" : "There are no workouts currently available, be the first and create the first workout!"}
            </Typography>
            <SortBy onSortChange={handleSortChange} />
            <Filter onFilterChange={handleFilterChange} />
            <div className="workouts">
                {workouts && filteredData
                    .filter(workout => search(searchWord, workout.title))
                    .map((workout) => {
                        if (!workout.Private) {
                            return <WorkoutDetails key={workout._id} workout={workout} />;
                        } else {
                            return null;
                        }
                    })
                }
            </div>
            <img className='bottom-left-icon' src={logo} alt="logo" />
        </div>
    )
}
