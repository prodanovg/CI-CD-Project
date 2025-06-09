import React from 'react';

function Home({ user }) {
  return (
    <div>
      <h1>Welcome, {user || 'Guest'}!</h1>
      <p>This is the home page.</p>
    </div>
  );
}

export default Home;
