import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Leftsidebar from '../Pages/Comnponent/Leftsidebar/Leftsidebar';
import Navbar from '../Pages/Comnponent/Navbar/navbar';
import Rightsidebar from '../Pages/Comnponent/Rightsidebar/Rightsidebar'

const Layout = () => {
  const [slidein, setSlidein] = useState(true);

  const handleSlideIn = () => {
    setSlidein(!slidein);
  };

  return (
    <div className="app-container">
      <Navbar handleslidein={handleSlideIn} />
      <div className="content-container">
        {/* Pass the slidein state here */}
        <Leftsidebar slidein={slidein} />
        <main className="main-content">
          {/* Main content area */}
          <Outlet />
        </main>
        <Rightsidebar></Rightsidebar>
      </div>
    </div>
  );
};

export default Layout;
