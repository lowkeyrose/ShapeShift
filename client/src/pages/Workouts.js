import { useCallback, useEffect } from 'react'
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
    const {
        setLoading,
        searchWord,
        handleFilterChange,
        applyFilters,
        handleSortChange,
        sortWorkouts,
        filteredData,
        setFilteredData,
        isActive,
        openMenu,
        handleFilterToggle,
        handleSortByToggle
    } = useGlobalContext()


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

    useEffect(() => {
        if (workouts) {
            const filteredWorkouts = applyFilters(workouts);
            const sortedWorkouts = sortWorkouts(filteredWorkouts);
            setFilteredData(sortedWorkouts);
        }
    }, [applyFilters, sortWorkouts, workouts, setFilteredData]);

    return (
        <div className='workouts-page'>
            <Typography variant="h1" component="h1" sx={{ fontFamily: "Kanit", fontWeight: 600, fontSize: 48, margin: "30px 0 0 0", textAlign: 'center' }}>
                Workouts Page
            </Typography>
            <Typography component="p" sx={{ fontFamily: "Kanit", fontWeight: 500, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
                <br />
                {workouts && workouts.length > 0 ? "Here you can find all the public workouts created by our users" : "There are no workouts currently available, be the first and create the first workout!"}
            </Typography>
            {(workouts && workouts.length > 0) &&
                <>
                    <div className="workouts">
                        {filteredData.filter(workout => search(searchWord, workout.title)).map((workout) => {
                            if (!workout.Private) {
                                return <WorkoutDetails key={workout._id} workout={workout} />;
                            } else {
                                return null;
                            }
                        })}
                    </div>
                    <div className="sort-filter-button">
                        <button className='setting-btn' onClick={openMenu}>
                            <span className="bar bar1"></span>
                            <span className="bar bar2"></span>
                            <span className="bar bar1"></span>
                        </button>
                    </div>
                    <div className={isActive ? 'sort-filter-active' : 'sort-filter'}>
                        <SortBy onSortChange={handleSortChange} onSortyByToggle={handleSortByToggle} />
                        <Filter onFilterChange={handleFilterChange} onFilterToggle={handleFilterToggle} />
                    </div>
                </>
            }
            <img className='bottom-left-icon' src={logo} alt="logo" />
        </div>
    )
}
