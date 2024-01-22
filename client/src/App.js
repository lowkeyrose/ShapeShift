import { useGlobalContext } from './hooks/useGlobalContext';
import Navbar from './components/Navbar'
import Router from './routers/Router';
import Footer from './components/Footer'
import AuthRouter from './routers/AuthRouter';
import ScrollButton from './components/ScrollButton';

export default function App() {
  const { user } = useGlobalContext()
  return (
    <div className="App">
      <Navbar />
      {user ? <AuthRouter /> : <Router />}
      <ScrollButton /> 
      <Footer />
    </div>
  )
}