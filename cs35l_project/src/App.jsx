
import MainPage from './pages/MainPage';
import ErrorPage from './pages/404page';
import { Routes, Route } from 'react-router-dom';

function App() {
  return(
    <Routes>
      <Route path='/' element = { <MainPage/> }/>
      <Route path = "*" element = { <ErrorPage/> }/>
    </Routes>
  );
}

export default App;
