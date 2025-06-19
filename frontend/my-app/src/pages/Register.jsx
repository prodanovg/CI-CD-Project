import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await axios.post('http://localhost:5000/register', {
                email,
                username,
                password,
                role,
            });

            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div
            style={{
                minHeight: '50vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                paddingLeft: '600px'

            }}
        >
            <form onSubmit={handleSubmit} style={{maxWidth: '400px', width: '100%'}}>
                <h2>Register</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{width: '100%', marginBottom: '10px', padding: '8px'}}
                    aria-label="Email"
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{width: '100%', marginBottom: '10px', padding: '8px'}}
                    aria-label="Username"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{width: '100%', marginBottom: '10px', padding: '8px'}}
                    aria-label="Password"
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{width: '100%', marginBottom: '10px', padding: '8px'}}
                    aria-label="Role"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                    <button type="submit">Register</button>
                    <button type="button" onClick={() => navigate('/')}>
                        Back
                    </button>
                </div>
                {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
                {success && <p style={{color: 'green', marginTop: '10px'}}>{success}</p>}
            </form>
        </div>
    );
}

export default Register;
