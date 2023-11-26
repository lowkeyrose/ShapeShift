import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/Signup';
import Home from '../pages/Home';
// import { useAuthContext } from '../hooks/useAuthContext';
import ErrorPage from '../pages/ErrorPage';

export default function Router() {
  // const { user } = useAuthContext()

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path="*" element={<ErrorPage />} />
      <Route path="/errorPage" element={<ErrorPage />} />

      {/* <Route path="/workouts/:id" element={<SingleWorkout />} /> */}
      {/* <Route path="/about" element={<About />} /> */}
      {/* <Route path="/TermsAndPrivacy" element={<TermsAndPrivacy />} /> */}
    </Routes>
  )
}