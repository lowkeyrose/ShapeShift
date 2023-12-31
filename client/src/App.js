import { useGlobalContext } from './hooks/useGlobalContext';
import Navbar from './components/Navbar'
import Router from './routers/Router';
import AuthRouter from './routers/AuthRouter';

export default function App() {
  const { user } = useGlobalContext()
  return (
    <div className="App">
      <Navbar />
      {user ? <AuthRouter /> : <Router />}
    </div>
  )
}