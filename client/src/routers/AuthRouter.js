import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import MyWorkouts from '../pages/MyWorkouts';
import FavoriteWorkouts from '../pages/FavoriteWorkouts';
import WorkoutForm from '../components/WorkoutForm'
import ErrorPage from '../pages/ErrorPage';
import Workouts from '../pages/Workouts';
import SingleWorkout from '../pages/SingleWorkout';
import { useAuthContext } from '../hooks/useAuthContext';

export default function AuthRouter() {
  const { user } = useAuthContext()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/workouts' element={<Workouts />} />
      <Route path="/workouts/:id" element={<SingleWorkout />} />

      {/* Additional check for the user inside the AuthRouter. It provides an extra layer of security. If, for some reason, the AuthRouter is rendered when there's no user, the routes within it won't be accessible due to the conditional rendering.*/}
      {user ? (
        <>
          <Route path='/workouts/myworkouts' element={<MyWorkouts />} />
          <Route path="/workouts/favorite" element={<FavoriteWorkouts />} />
          <Route path='/workouts/myworkouts/new' element={<WorkoutForm />} />
          <Route path='/workouts/myworkouts/:id' element={<WorkoutForm />} />
          {/* <Route path="/account" element={<Account />} /> */}
          {/* <Route path="/profile" element={<Profile />} /> */}
        </>
      ) :
      <Navigate to="/" />
      }

      <Route path="*" element={<ErrorPage />} />
      <Route path="/errorPage" element={<ErrorPage />} />
      {/* <Route path="/about" element={<About />} /> */}
      {/* <Route path="/TermsAndPrivacy" element={<TermsAndPrivacy />} /> */}

      {/* {roleType === RoleTypes.admin &&
        <>
          <Route path="/admin/users/:id" element={<EditUser />} />
          <Route path="/admin/users" element={<UsersManagement />} />
        </>
      } */}

    </Routes>
  )
}
