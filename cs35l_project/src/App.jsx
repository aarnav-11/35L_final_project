
import MainPage from './pages/MainPage';
import ErrorPage from './pages/404page';
import Authentication from "./pages/Authentication"
import { Routes, Route } from 'react-router-dom';

function App() {
  return(
    <Routes>
      <Route path='/' element = { <Authentication/> }/>
      <Route path='/home' element = { <MainPage/> }/>
      <Route path = "*" element = { <ErrorPage/> }/>
    </Routes>
  );
}

export default App;
