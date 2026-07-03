import { Routes, Route } from 'react-router-dom'
import SignUpPage from './pages/SignUp'
import SignIn from './pages/SignIn'


const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />}/>
      <Route path="/signin" element={<SignIn />}/>

    </Routes>
  )
}

export default App