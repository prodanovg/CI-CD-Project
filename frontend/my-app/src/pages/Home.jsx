import React from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function Home({user, setUser}) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/logout', {}, {withCredentials: true});
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

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
            <h1>Welcome, {user || 'Guest'}!</h1>
            <p>This is the home page.</p>

            {user ? (
                <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                    <button onClick={() => navigate('/create-post')}>Create Post</button>
                    <button onClick={() => navigate('/posts')}>All Posts</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/register')}>Register</button>
                </div>
            )}
        </div>
    );
}

export default Home;
