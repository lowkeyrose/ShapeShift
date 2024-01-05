import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/Signup';
import Home from '../pages/Home';
import ErrorPage from '../pages/ErrorPage';
import Workouts from '../pages/Workouts';
import SingleWorkout from '../pages/SingleWorkout';

export default function Router() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/workouts' element={<Workouts />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path="*" element={<ErrorPage />} />
      <Route path="/errorPage" element={<ErrorPage />} />
      <Route path="/workouts/workout/:id" element={<SingleWorkout />} />

      {/* <Route path="/about" element={<About />} /> */}
      {/* <Route path="/TermsAndPrivacy" element={<TermsAndPrivacy />} /> */}
    </Routes>
  )
}