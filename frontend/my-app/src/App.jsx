import React, {useEffect, useState} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost'; // import your new page
import axios from 'axios';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/current_user', {withCredentials: true})
            .then(response => {
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            })
            .catch(err => {
                console.error('Failed to fetch current user', err);
                setUser(null);
            });
    }, []);

    return (
        <Routes>
            <Route
                path="/login"
                element={!user ? <Login setUser={setUser}/> : <Navigate to="/" replace/>}
            />
            <Route
                path="/register"
                element={!user ? <Register/> : <Navigate to="/" replace/>}
            />
            <Route
                path="/"
                element={<Home user={user} setUser={setUser}/>}
            />
            <Route
                path="/posts"
                element={user ? <Posts/> : <Navigate to="/login" replace/>}
            />
            <Route
                path="/create-post"
                element={user ? <CreatePost/> : <Navigate to="/login" replace/>}
            />
        </Routes>
    );
}

export default App;
