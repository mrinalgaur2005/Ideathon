'use client';

import React, { useState } from 'react';

// Import CSS from the relative path
import '../../../app/navbar.css';

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleNav = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div>
      <nav>
        <div className="logo">
          <img src="assets/Logo64x64.png" alt="logo" />
          <h1>LOGO</h1>
        </div>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Blog</a>
          </li>
          <li>
            <a href="#">Contact Us</a>
          </li>
        </ul>
        <div className={`hamburger ${menuActive ? 'hamburger-active' : ''}`} onClick={toggleNav}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </nav>

      <div className={`menubar ${menuActive ? 'active' : ''}`}>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Blog</a>
          </li>
          <li>
            <a href="#">Contact Us</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
