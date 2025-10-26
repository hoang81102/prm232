import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route} from "react-router-dom";

import Login from './page/Login';
import HomePage from './page/HomePage';
import HowItWorks from './page/HomePage';

function App() {
  return (
   <>
        <Routes>
         <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/how-it-works" element={<HowItWorks />} />

          
        </Routes>

       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
</>
  );
}

export default App
