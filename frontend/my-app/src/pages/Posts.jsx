import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {backendUrl} from '../config';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const navigate = useNavigate();


    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/posts`);
            console.log('Fetched posts:', response.data);

            setPosts(response.data || []);
        } catch (err) {
            setError('Failed to load posts');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`${backendUrl}/posts/${postId}`);
            setPosts(posts.filter(post => post.id !== postId));
        } catch {
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
            await axios.put(`${backendUrl}/posts/${postId}`, {
                title: editTitle,
                content: editContent,
            }, {
                headers: {'Content-Type': 'application/json'},
            });
            setPosts(posts.map(post =>
                post.id === postId ? {...post, title: editTitle, content: editContent} : post
            ));
            cancelEditing();
        } catch {
            setError('Failed to update post');
        }
    };

    return (
        <div style={{
            minHeight: '50vh',
            maxWidth: '700px',
            margin: '20px auto',
            padding: '20px',
            textAlign: 'center',
        }}>
            <h2>All Posts</h2>
            <button onClick={fetchPosts}>Fetch Posts</button>
            <button type="button" onClick={() => navigate('/')}>Home</button>


            {error && <p style={{color: 'red'}}>{error}</p>}
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                posts.map(post => (
                    <div
                        key={post.id}
                        style={{border: '1px solid #ccc', marginBottom: '15px', padding: '10px', textAlign: 'left'}}
                    >
                        {editingPostId === post.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={e => setEditTitle(e.target.value)}
                                    style={{width: '100%', marginBottom: '8px'}}
                                />
                                <textarea
                                    value={editContent}
                                    onChange={e => setEditContent(e.target.value)}
                                    rows={4}
                                    style={{width: '100%', marginBottom: '8px'}}
                                />
                                <button onClick={() => submitUpdate(post.id)}>Save</button>
                                <button onClick={cancelEditing} style={{marginLeft: '10px'}}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                {post.author ? (
                                    <p style={{fontSize: '0.8em', color: '#555'}}>
                                        By: {post.author} at {new Date(post.created_at).toLocaleString()}
                                    </p>
                                ) : (
                                    <p style={{fontSize: '0.8em', color: '#555'}}>
                                        Created at: {new Date(post.created_at).toLocaleString()}
                                    </p>
                                )}
                                <button onClick={() => startEditing(post)}>Update</button>
                                <button onClick={() => handleDelete(post.id)} style={{marginLeft: '10px'}}>Delete
                                </button>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Posts;
