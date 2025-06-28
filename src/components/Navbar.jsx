import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScroll } from '../ScrollToSectionContext';
import crudifyLogo from '../assets/CRUDIFY-Logo.png';
import defaultProfile from '../assets/profile.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSectionToScroll } = useScroll();

  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null); // ✅ used to detect outside click

  useEffect(() => {
    const filename = localStorage.getItem("profileImage");
    const storedEmail = localStorage.getItem("email");
    const storedUsername = localStorage.getItem("username");

    if (storedEmail) {
      setEmail(storedEmail);
      setUsername(storedUsername);
    }

    if (filename) {
      setProfileImage(`http://localhost:3000/uploads/${filename}`);
    }
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (sectionId) => {
    if (location.pathname !== '/') {
      setSectionToScroll(sectionId);
      navigate('/');
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !email) return;

    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("email", email);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.filename) {
        localStorage.setItem("profileImage", data.filename);
        setProfileImage(`http://localhost:3000/uploads/${data.filename}`);
        setShowDropdown(false);
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Profile upload failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setEmail(null);
    setUsername('');
    setProfileImage(defaultProfile);
    setShowDropdown(false);
    navigate('/signin');
  };

  return (
    <header className="navbar">
      <div className="logo">
        <img src={crudifyLogo} alt="CRUDIFY Logo" />
      </div>
      <span className="title">CRUDIFY</span>

      <nav>
        <ul>
          <li><a href="#home" onClick={(e) => { e.preventDefault(); handleClick('home'); }}>Home</a></li>
          <li><a href="#about" onClick={(e) => { e.preventDefault(); handleClick('about'); }}>About Us</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); handleClick('contact'); }}>Contact Us</a></li>
        </ul>
      </nav>

      <div className="profile-image" style={{ position: 'relative' }} ref={dropdownRef}>
        <img
          src={profileImage}
          alt="User Profile"
          className="avatar"
          style={{ cursor: email ? 'pointer' : 'default' }}
          onClick={() => email && setShowDropdown(!showDropdown)}
        />

        {showDropdown && (
          <div className="dropdown-box">
            <p style={{ margin: 0, width: '100px', padding: '5px 10px', fontWeight: 'bold' }}>{username}</p>
            <button
              onClick={() => document.getElementById('profile-upload').click()}
              className="dropdown-item"
            >
              📷 Update Photo
            </button>
            <button onClick={handleLogout} className="dropdown-item">
              🚪 Logout
            </button>
          </div>
        )}

        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleProfileUpload}
        />
      </div>
    </header>
  );
};

export default Navbar;
