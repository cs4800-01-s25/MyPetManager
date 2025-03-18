import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation */}
        <nav>
          <ul style={{ 
            display: 'flex', 
            listStyle: 'none', 
            padding: '1rem', 
            backgroundColor: '#C9E4FF', 
            margin: 0 
          }}>
            <li style={{ marginRight: '1rem' }}>
              <Link to="/" style={{ color: '#5A7184', fontWeight: 'bold' }}>Home</Link>
            </li>
            <li>
              <Link to="/log-in" style={{ color: '#5A7184', fontWeight: 'bold' }}>Log In</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
