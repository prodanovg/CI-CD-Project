import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/posts?page=${page}&per_page=5`);
        setPosts(response.data.posts);
        setPages(response.data.pages);
      } catch (err) {
        setError('Failed to load posts.');
      }
    };

    fetchPosts();
  }, [page]);

  const nextPage = () => {
    if (page < pages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
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
        <h2>Posts</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <ul>
          {posts.map(post => (
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>By: {post.author} | {new Date(post.created_at).toLocaleString()}</small>
              </li>
          ))}
        </ul>
        <button onClick={prevPage} disabled={page <= 1}>Previous</button>
        <button onClick={nextPage} disabled={page >= pages}>Next</button>
      </div>
  );
}

export default Posts;
