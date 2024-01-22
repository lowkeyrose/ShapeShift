import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import MyWorkouts from '../pages/MyWorkouts';
import FavoriteWorkouts from '../pages/FavoriteWorkouts';
import WorkoutForm from '../components/WorkoutForm'
import ErrorPage from '../pages/ErrorPage';
import Workouts from '../pages/Workouts';
import SingleWorkout from '../pages/SingleWorkout';
import { useGlobalContext } from '../hooks/useGlobalContext';
import Account from '../pages/Account';
import EditAccount from '../pages/EditAccount';
import About from '../pages/About';
import AdminPanel from '../pages/AdminPanel';
import InDevelopment from '../pages/InDevelopment';

export default function AuthRouter() {
  const { user } = useGlobalContext()

  return (
    <Routes>
      <Route path="*" element={<ErrorPage />} />
      <Route path="/in-development" element={<InDevelopment />} />
      <Route path="/" element={<Home />} />
      <Route path='/workouts' element={<Workouts />} />
      <Route path="/workouts/workout/:id" element={<SingleWorkout />} />

      {user ? (
        <>
          <Route path='/workouts/myworkouts' element={<MyWorkouts />} user={user} />
          <Route path="/workouts/favorites" element={<FavoriteWorkouts />} user={user} />
          <Route path='/workouts/myworkouts/create/new' element={<WorkoutForm />} />
          <Route path='/workouts/myworkouts/edit/:id' element={<WorkoutForm />} />
          <Route path="/account" element={<Account />} />
          {user.roleType !== 'admin' && <Route path="/account/edit/:id" element={<EditAccount />} />}
          {/* <Route path="/profile" element={<Profile />} /> */}
        </>
      ) :
        <Navigate to="/" />
      }

      <Route path="/errorPage" element={<ErrorPage />} />
      <Route path="/about" element={<About />} />

      {user.roleType === 'admin' &&
        <>
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/admin-panel/user/:id" element={<EditAccount />} />
        </>
      }

    </Routes>
  )
}
