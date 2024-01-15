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

export default function AuthRouter() {
  const { user } = useGlobalContext()

  return (
    <Routes>
      <Route path="*" element={<ErrorPage />} />
      <Route path="/" element={<Home />} />
      <Route path='/workouts' element={<Workouts />} />
      <Route path="/workouts/workout/:id" element={<SingleWorkout />} />

      {/* Additional check for the user inside the AuthRouter. It provides an extra layer of security. If, for some reason, the AuthRouter is rendered when there's no user, the routes within it won't be accessible due to the conditional rendering.*/}
      {user ? (
        <>
          <Route path='/workouts/myworkouts' element={<MyWorkouts />} user={user} />
          <Route path="/workouts/favorites" element={<FavoriteWorkouts />} user={user} />
          <Route path='/workouts/myworkouts/create/new' element={<WorkoutForm />} />
          <Route path='/workouts/myworkouts/edit/:id' element={<WorkoutForm />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/edit/:id" element={<EditAccount />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </>
      ) :
      <Navigate to="/" />
      }

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
