import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import Home from './components/Home/Home'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
