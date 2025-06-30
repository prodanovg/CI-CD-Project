import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../config';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await axios.post(`${backendUrl}/posts`, { title, content });
            setSuccess('Post created successfully!');
            setTitle('');
            setContent('');
            setTimeout(() => navigate('/posts'), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post. Please try again.');
        }
    };

    return (
        <div style={{
            minHeight: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
        }}>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <h2>Create a New Post</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                    rows={6}
                    style={{ width: '100%', marginBottom: '10px', padding: '8px', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button type="submit">Create Post</button>
                    <button type="button" onClick={() => navigate('/')}>Home</button>
                </div>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
            </form>
        </div>
    );
}

export default CreatePost;
