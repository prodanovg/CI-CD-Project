import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                height: '50vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                paddingLeft: '600px',
            }}
        >
            <h1>Welcome!</h1>
            <p>This is the home page.</p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => navigate('/create-post')}>Create Post</button>
                <button onClick={() => navigate('/posts')}>All Posts</button>
            </div>
        </div>
    );
}

export default Home;
