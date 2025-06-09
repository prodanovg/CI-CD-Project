import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Login({setUser}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            }, {
                withCredentials: true,
            });

            if (response.data && response.data.user) {
                setUser(response.data.user);
                navigate('/');
            } else {
                setError('Unexpected response from server.');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        <div style={{
            height: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            paddingLeft: '600px'
        }}>
            <form onSubmit={handleSubmit} style={{maxWidth: '400px', width: '100%'}}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{width: '100%', marginBottom: '10px', padding: '8px'}}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{width: '100%', marginBottom: '10px', padding: '8px'}}
                />
                <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                    <button type="submit">Login</button>
                    <button type="button" onClick={() => navigate('/')}>Back</button>
                </div>
                {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;
