import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/posts', { withCredentials: true });
            setPosts(response.data.posts);
        } catch (err) {
            setError('Failed to load posts');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:5000/posts/${postId}`, { withCredentials: true });
            setPosts(posts.filter(post => post.id !== postId));
        } catch (err) {
            setError('Failed to delete post');
        }
    };

    const startEditing = (post) => {
        setEditingPostId(post.id);
        setEditTitle(post.title);
        setEditContent(post.content);
    };

    const cancelEditing = () => {
        setEditingPostId(null);
        setEditTitle('');
        setEditContent('');
    };

    const submitUpdate = async (postId) => {
        try {
            await axios.put(
                `http://localhost:5000/posts/${postId}`,
                { title: editTitle, content: editContent },
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );
            // Update post in state
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, title: editTitle, content: editContent } : post
            ));
            cancelEditing();
        } catch (err) {
            setError('Failed to update post');
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
            }}>
            <h2>All Posts</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                posts.map(post => (
                    <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: '15px', padding: '10px' }}>
                        {editingPostId === post.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    style={{ width: '100%', marginBottom: '8px' }}
                                />
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={4}
                                    style={{ width: '100%', marginBottom: '8px' }}
                                />
                                <button onClick={() => submitUpdate(post.id)}>Save</button>
                                <button onClick={cancelEditing} style={{ marginLeft: '10px' }}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                <p><small>By: {post.author} at {new Date(post.created_at).toLocaleString()}</small></p>
                                <button onClick={() => startEditing(post)}>Update</button>
                                <button onClick={() => handleDelete(post.id)} style={{ marginLeft: '10px' }}>Delete</button>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Posts;
