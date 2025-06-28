import React, { useEffect } from 'react'; // ✅ this was missing
import { Routes, Route } from 'react-router-dom';
import './canva.css';
import About from './components/About';
import Contact from './components/Contact';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dboard from './components/Dboard';

function App() {
  useEffect(() => {
    const checkServerBoot = async () => {
      try {
        const res = await fetch("http://localhost:3000/server-boot");
        const data = await res.json();
        
        const previousBootId = localStorage.getItem("serverBootId");
        const currentBootId = String(data.bootId);

        if (!previousBootId) {
          localStorage.setItem("serverBootId", currentBootId);
        } else if (previousBootId !== currentBootId) {
          alert("⚠️ Server restarted. You have been logged out.");
          localStorage.clear();
          window.location.href = "/"; // or /signin
        }
      } catch (err) {
        console.error("🛑 Server boot check failed:", err);
      }
    };

    checkServerBoot();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Main />
              <About />
              <Contact />
            </>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard/:userId" element={<Dboard />} />
      </Routes>
    </>
  );
}

export default App;
