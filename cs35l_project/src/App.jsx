
import MainPage from './pages/MainPage';
import ErrorPage from './pages/404page';
import Calendar from './pages/Calendar';
import Authentication from "./pages/LoginSignup/Authentication"
import { Routes, Route } from 'react-router-dom';

function App() {
  return(
    <Routes>
      <Route path='/' element = { <Authentication/> }/>
      <Route path='/home' element = { <MainPage/> }/>
      <Route path = "*" element = { <ErrorPage/> }/>
      <Route path = "/calendar" element={<Calendar/>} />
    </Routes>
  );
}

export default App;
