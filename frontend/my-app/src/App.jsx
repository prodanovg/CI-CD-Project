import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/posts" element={<Posts/>}/>
            <Route path="/create-post" element={<CreatePost/>}/>
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}

export default App;
