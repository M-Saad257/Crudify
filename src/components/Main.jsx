import React from 'react'
import heroImage from '../assets/Untitled design.png';
import Signup from './Signup';


const Main = () => {
  return (
      <main id='home' className="hero-section">
        <div className="hero-text">
          <h1><strong>FIRE THE MANAGER.</strong></h1>
          <h2>THIS APP HANDLES IT ALL — SMART, SIMPLE, STRESS-FREE.</h2>
          <p>
            Say goodbye to messy spreadsheets and endless follow-ups. Our app puts full control in your hands — track, manage, and update everything in one place. No manager needed, no stress involved. Just simple, smart organization at your fingertips.
          </p>
          {/* <button>GET STARTED</button> */}
          <a href='/signup'><button>GET STARTED</button></a>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Team Presentation" />
        </div>
      </main>
  )
}

export default Main
