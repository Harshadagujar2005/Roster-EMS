import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const AppLayout = () => (
  <div className="app-shell">
    <Navbar />
    <div className="app-main">
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppLayout;
