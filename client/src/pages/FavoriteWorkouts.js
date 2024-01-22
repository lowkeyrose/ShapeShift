import React, { useCallback, useEffect } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { ACTIONS } from '../context/Actions'
import logo from '../assets/robots/favorites.png'
import '../components/style/WorkoutDetails.css'
import './style/Pages.css'

// components
import WorkoutDetails from '../components/WorkoutDetails'
import { Typography } from '@mui/material'
import { useGlobalContext } from '../hooks/useGlobalContext'
import { search } from '../components/Searchbar'
import SortBy from '../components/SortBy'
import Filter from '../components/Filter'

export default function FavoirteWorkouts() {
  const {
    token,
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
  const { workouts, dispatch } = useWorkoutContext()

  const favoriteWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/workouts/favoriteworkouts', {
        headers: {
          'Authorization': token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to fetch workouts: ${response.statusText}`)
      }
      dispatch({ type: ACTIONS.SET_WORKOUTS, payload: data });
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, setLoading, token])

  useEffect(() => {
    if (token) {
      favoriteWorkouts()
    }
    return () => {
      dispatch({ type: ACTIONS.SET_WORKOUTS, payload: [] });
    }
  }, [favoriteWorkouts, dispatch, token]);

  useEffect(() => {
    if (workouts) {
      const filteredWorkouts = applyFilters(workouts);
      const sortedWorkouts = sortWorkouts(filteredWorkouts);
      setFilteredData(sortedWorkouts);
    }
  }, [applyFilters, sortWorkouts, workouts, setFilteredData]);

  return (
    <div className='favorites-page'>
      <Typography variant="h1" component="h1" sx={{ fontFamily: "Kanit", margin: "30px 0 0 0", fontWeight: 600, fontSize: 48, textAlign: 'center' }}>
        Favorite Workouts
      </Typography>
      <Typography component="p" sx={{ fontFamily: "Kanit", fontWeight: 500, fontSize: 16, paddingBottom: "10px", textAlign: 'center' }}>
        <br />
        {workouts && workouts.length > 0 ? "We've kept all you're favorite workouts ready for you!" : "You current have no available workouts, Add your first one today!"}
      </Typography>
      {(workouts && workouts.length > 0) &&
        <>
          <div className="workouts">
            {filteredData.filter(workout => search(searchWord, workout.title)).map((workout) => {
              return <WorkoutDetails key={workout._id} workout={workout} />;
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