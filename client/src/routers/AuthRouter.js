import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import MyWorkouts from '../pages/MyWorkouts';
import WorkoutForm from '../components/WorkoutForm'
// import { useAuthContext } from '../hooks/useAuthContext';
import ErrorPage from '../pages/ErrorPage';

export default function AuthRouter() {
  // const { user } = useAuthContext()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/workouts/myworkouts' element={<MyWorkouts />} />
      <Route path='/workouts/myworkouts/new' element={<WorkoutForm />} />


      {/* <Route path="/workouts/favorite" element={<FavoriteWorkouts />} /> */}
      {/* <Route path="/workouts/:id" element={<SingleWorkout />} /> */}

      <Route path="*" element={<ErrorPage />} />
      <Route path="/errorPage" element={<ErrorPage />} />
      {/* <Route path="/about" element={<About />} /> */}
      {/* <Route path="/TermsAndPrivacy" element={<TermsAndPrivacy />} /> */}
      

      {/* {roleType === RoleTypes.admin && <Route path="/admin/users/:id" element={<EditUser />} />}
      {roleType === RoleTypes.admin && <Route path="/admin/users" element={<UsersManagement />} />}
      {roleType !== RoleTypes.user && <Route path="/workouts/myworkouts" element={<MyWorkouts />} />}
      {roleType !== RoleTypes.user && <Route path="/workouts/myworkouts/:id" element={<EditWorkout />} />}
      {roleType !== RoleTypes.user && <Route path="/workouts/myworkouts/new" element={<CreateWorkout />} />}
      {roleType !== RoleTypes.admin && <Route path="/account" element={<Account />} />}
      {roleType !== RoleTypes.admin && <Route path="/profile" element={<Profile />} />} */}
    </Routes>
  )
}
