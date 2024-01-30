import { useGlobalContext } from './hooks/useGlobalContext'
import Navbar from './components/Navbar'
import Router from './routers/Router'
import Footer from './components/Footer'
import AuthRouter from './routers/AuthRouter'
import ScrollButton from './components/ScrollButton'

export default function App() {
  const { user, token } = useGlobalContext()

  return (
    <div className="App">
      <Navbar />
      {(user || token) ? <AuthRouter /> : <Router />}
      <ScrollButton />
      <Footer />
    </div>
  )
}