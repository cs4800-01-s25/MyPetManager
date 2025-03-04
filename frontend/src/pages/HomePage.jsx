// src/pages/HomePage.jsx
import React from 'react';
import '../styles/home.css'; // We'll update this file name too

const HomePage = () => {
  return (
    <div className="App">
      {/* Header Section */}
      <header>
        <h1>Introducing Our Project</h1>
        <p className="goal">
          🐾 A web service that includes a health portal and an appointment scheduler for pet owners to register their pet information.
        </p>
      </header>

      {/* Section 1: Health Portal */}
      <section className="features">
        <div className="feature-card pastel-pink">
          <a href="#healthportal">
            <div className="feature-number">01</div>
            <h2>Health Portal</h2>
            <p>📋 Keep track of medication & refill reminders</p>
          </a>
        </div>

        {/* Section 2: Scheduler */}
        <div className="feature-card pastel-blue" id="scheduler">
          <div className="feature-number">02</div>
          <a href="#scheduler">
            <h2>Scheduler</h2>
            <p>📅 Book appointments for pet services</p>
          </a>
        </div>

        {/* Section 3: Forum page */}
        <div className="feature-card pastel-yellow" id="forum">
          <div className="feature-number">03</div>
          <a href="#forum">
            <h2>Bonus</h2>
            <p>💬 Add a forum page for local discussions</p>
          </a>
        </div>

        {/* Section 4: Pet Profile */}
        <div className="feature-card pastel-green">
          <div className="feature-number">04</div>
          <a href="#petprofile">
            <h2>Pet Profile</h2>
            <p>✏️ Create/remove/edit pets on your account</p>
          </a>
        </div>
      </section>

      {/* Team Member Section */}
      <div className="member-names">
        <p>Team Members: My Lien Tan, Brandon Vo, Gian David Marquez, Cheyenne Chavis</p>
      </div>

      {/* Footer Section */}
      <footer>
        <p>🐶🐾 Pet Care Management | By CacheMeIfYouCan</p>
      </footer>
    </div>
  );
}

export default HomePage