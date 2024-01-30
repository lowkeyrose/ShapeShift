import React, { createContext, useCallback, useEffect, useReducer, useMemo, useState, memo } from 'react'
import { ACTIONS } from "./Actions"
import { RoleTypes } from '../components/Navbar-config'
import { useLocation, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { Toaster, toast } from 'sonner'

export const GlobalContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload
      }
    case ACTIONS.LOGOUT:
      return { user: null }
    case ACTIONS.FAVORITE:
      return {
        ...state,
        user: { ...state.user, favorites: [...state.user.favorites, action.payload._id] }
      }
    case ACTIONS.UNFAVORITE:
      return {
        ...state,
        user: {
          ...state.user,
          favorites: state.user.favorites.filter(w => w._id !== action.payload._id)
        }
      }
    default:
      return state
  }
}

export const GlobalContextProvider = memo(({ children }) => {
  const token = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  const location = useLocation()
  const [exerciseFormModal, setExerciseFormModal] = useState(false)
  const [editExerciseModal, setEditExerciseModal] = useState(false)
  const [roleType, setRoleType] = useState(RoleTypes.none)
  const [filteredData, setFilteredData] = useState([])
  const [sortOption, setSortOption] = useState(null)
  const [searchWord, setSearchWord] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    filterByLikes: null,
    filterByExercises: null
  })

  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })
  const memoizedDispatch = useCallback(dispatch, [dispatch])

  const authenticate = useCallback(async () => {
    try {
      const response = await fetch('/api/user/authenticate', {
        method: 'POST',
        headers: {
          'Authorization': token
        }
      })

      if (!response.ok) {
        showToastError('Session expired');
        memoizedDispatch({ type: ACTIONS.LOGOUT })
        localStorage.removeItem('token')
        setRoleType(RoleTypes.none)
        navigate('/')
      } else {
        const newToken = response.headers.get('Authorization');
        if (newToken) {
          // Update the token
          setTimeout(() => {
            localStorage.setItem('token', JSON.stringify(newToken))
          }, 15 * 1000);
        }
        const json = await response.json()
        memoizedDispatch({ type: ACTIONS.SET_USER, payload: json })
        const userRoleType = json.roleType
        const mappedRoleType = RoleTypes[userRoleType]
        setRoleType(mappedRoleType)
      }
    } catch (error) {
      console.log("The Promise is rejected!", error)
    }
  }, [memoizedDispatch, navigate, token])

  useEffect(() => {
    if (token) {
      authenticate()
    }
  }, [authenticate, location.pathname, token])
  
  const openMenu = useCallback(() => {
    setIsActive(!isActive)
  }, [isActive])

  const handleFilterToggle = useCallback(() => {
    setIsActive(false)
  }, [])

  const handleSortByToggle = useCallback(() => {
    setIsActive(false)
  }, [])

  const showToastError = text => {
    toast.error(text)
  }

  const showToastSuccess = text => {
    toast.success(text)
  }

  const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/
    return objectIdPattern.test(id)
  }

  const handleFilterChange = ({ filterByLikes, filterByExercises }) => {
    setActiveFilters({
      filterByLikes,
      filterByExercises
    })
  }

  const applyFilters = useCallback((workouts) => {
    return workouts.filter((workout) =>
      (activeFilters.filterByLikes === null || workout.likes >= activeFilters.filterByLikes) &&
      (activeFilters.filterByExercises === null || workout.exercises.length >= activeFilters.filterByExercises)
    )
  }, [activeFilters])

  const handleSortChange = (option) => {
    setSortOption(option)
  }

  const sortWorkouts = useCallback((data) => {
    if (sortOption === 'exercises-asc') {
      return data.slice().sort((a, b) => a.exercises.length - b.exercises.length)
    } else if (sortOption === 'exercises-desc') {
      return data.slice().sort((a, b) => b.exercises.length - a.exercises.length)
    } else if (sortOption === 'likes-asc') {
      return data.slice().sort((a, b) => a.likes - b.likes)
    } else if (sortOption === 'likes-desc') {
      return data.slice().sort((a, b) => b.likes - a.likes)
    } else if (sortOption === 'oldest') {
      return data.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortOption === 'newest') {
      return data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return data
  }, [sortOption])

  const memoizedValue = useMemo(() => ({
    ...state,
    dispatch,
    token,
    navigate,
    location,
    roleType,
    setRoleType,
    loading,
    showToastError,
    showToastSuccess,
    setLoading,
    searchWord,
    setSearchWord,
    isValidObjectId,
    handleFilterChange,
    applyFilters,
    handleSortChange,
    sortWorkouts,
    filteredData,
    setFilteredData,
    isActive,
    openMenu,
    handleFilterToggle,
    handleSortByToggle,
    exerciseFormModal,
    setExerciseFormModal,
    editExerciseModal,
    setEditExerciseModal
  }), [state, token, navigate, location, roleType, loading, searchWord, applyFilters, filteredData, sortWorkouts, isActive, handleSortByToggle, handleFilterToggle, openMenu, exerciseFormModal, editExerciseModal])

  return (
    <GlobalContext.Provider value={memoizedValue}>
      <Toaster richColors />
      {loading && <Loader />}
      {children}
    </GlobalContext.Provider>
  )
})