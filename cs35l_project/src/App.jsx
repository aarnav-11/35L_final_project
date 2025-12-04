
import MainPage from './pages/MainPage';
import ErrorPage from './pages/404page';
import Authentication from "./pages/LoginSignup/Authentication"
import { Routes, Route } from 'react-router-dom';
import Spaces from './pages/Spaces';
import ForgotPassword from "./pages/LoginSignup/ForgotPassword";
import ResetPassword from "./pages/LoginSignup/ResetPassword";

function App() {
  return(
    <Routes>
      <Route path='/' element = { <Authentication/> }/>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path='/home' element = { <MainPage/> }/>
      <Route path="/spaces" element = { < Spaces />}/>
      <Route path = "*" element = { <ErrorPage/> }/>
    </Routes>
  );
}

export default App;
