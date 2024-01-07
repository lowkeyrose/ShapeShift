import React, { createContext, useCallback, useEffect, useReducer, useMemo, useState } from 'react';
import { ACTIONS } from "./Actions";
import { RoleTypes } from '../components/Navbar-config';
import { useLocation, useNavigate } from 'react-router-dom';
import Snackbar from '../components/Snackbar';
import Loader from '../components/Loader';

export const GlobalContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case ACTIONS.LOGOUT:
      return { user: null };
    case ACTIONS.FAVORITE:
      return {
        ...state,
        user: { ...state.user, favorites: [...state.user.favorites, action.payload._id] }
      };
    case ACTIONS.UNFAVORITE:
      return {
        ...state,
        user: {
          ...state.user,
          favorites: state.user.favorites.filter(w => w._id !== action.payload._id)
        }
      };
    default:
      return state;
  }
};

export const GlobalContextProvider = ({ children }) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();
  const [snackbarText, setSnackbarText] = useState('');
  const [roleType, setRoleType] = useState(RoleTypes.none);
  const [loading, setLoading] = useState(false);

  const snackbar = text => {
    setSnackbarText(text);
    setTimeout(() => setSnackbarText(''), 3 * 1000);
  };

  const [state, dispatch] = useReducer(authReducer, {
    user: null
  });

  const memoizedDispatch = useCallback(dispatch, [dispatch]);

  useEffect(() => {
    if (token) {
      const authenticate = async () => {
        try {
          const response = await fetch('/api/user/authenticate', {
            method: 'POST',
            headers: {
              'Authorization': token
            }
          });

          if (response.ok) {
            const json = await response.json();
            memoizedDispatch({ type: ACTIONS.SET_USER, payload: json });
            const userRoleType = json.roleType;
            const mappedRoleType = RoleTypes[userRoleType];
            setRoleType(mappedRoleType);
          } else {
            snackbar('Session expired');
            memoizedDispatch({ type: ACTIONS.LOGOUT });
            localStorage.removeItem('token')
            setRoleType(RoleTypes.none);
            navigate('/');
          }
        } catch (error) {
          console.log("The Promise is rejected!", error);
        }
      };

      authenticate();
    }
  }, [memoizedDispatch, location.pathname, token, navigate, setRoleType]);

  console.log('GlobalContextProvider state: ', state);

  const memoizedValue = useMemo(() => ({
    ...state,
    dispatch,
    token,
    navigate,
    location,
    snackbarText,
    setSnackbarText,
    roleType,
    setRoleType,
    snackbar,
    loading,
    setLoading
  }), [state, token, navigate, location, snackbarText, roleType, loading]);

  return (
    <GlobalContext.Provider value={memoizedValue}>
      {snackbarText && <Snackbar text={snackbarText} />}
      {loading && <Loader />}
      {children}
    </GlobalContext.Provider>
  );
};
