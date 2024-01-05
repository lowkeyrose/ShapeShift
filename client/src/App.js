import { useGeneralContext } from './hooks/useGeneralContext';
import Navbar from './components/Navbar'
import Router from './routers/Router';
import AuthRouter from './routers/AuthRouter';
import './App.css'


export default function App() {
  const { user } = useGeneralContext()
  return (
    <div className="App">
      <Navbar />
      {user ? <AuthRouter /> : <Router />}
    </div>
  )
}