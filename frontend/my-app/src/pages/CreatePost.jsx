import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            const response = await axios.post('http://localhost:5000/posts', {
                title,
                content,
            }, {
                withCredentials: true,
            });
            console.log(response.data)

            setSuccess('Post created successfully!');
            setTitle('');
            setContent('');

            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to create post. Please try again.');
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
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
                <h2>Create a New Post</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={6}
                    style={{ width: '100%', marginBottom: '10px', padding: '8px', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button type="submit">Create Post</button>
                    <button type="button" onClick={() => navigate('/')}>Back</button>
                </div>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
            </form>
        </div>
    );
}

export default CreatePost;
