import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';
import './style.scss';

function Home() {
    const [title, setTitle] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try{
                if(localStorage.getItem('token')){
                    const res = await axios.get('/users/verifyToken',{
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if(res.data.data === 'Token valid'){
                        return null;
                    }else if(localStorage.getItem('refreshToken')){
                        const response = await axios.post('/users/refreshToken', { userId: localStorage.getItem('userId')}, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                            }
                        });
                        if(response.data.token)
                            localStorage.setItem('token', response.data.token);
                        else navigate('/');
                    }else{
                        navigate('/');
                    }
                }else{
                    navigate('/');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/users/posts');
            setPosts(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreatePost = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);

            mediaFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await axios.post('/users/posts/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPosts(prevPosts => [...prevPosts, response.data.data]);
            setMessage(`Post created successfully`);
        } catch (error) {
            setMessage('Error creating post');
        }
    };

    const handleFileChange = (e) => {
        setMediaFiles([...e.target.files]);
    };

    const handleEditPost = (post) => {
        navigate(`/editPost/${post._id}`);
    };

    const isVideo = (url) => {
        return url.endsWith('.mp4');
    };

    return (
        <table className="home-container">
        <tr className='header'>
            <th className='header-th'>
                <Layout/> 
            </th>
        </tr>
        <tr className="create-post-section">
                <input className="create-post-text-input" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input className="create-post-input" type="file" multiple onChange={handleFileChange} />
                <button className="create-post-button" onClick={handleCreatePost}>Create Post</button>
                <p>{message}</p>
        </tr>
        <tr className="post-list">
                {posts.map(post => (
                    <table key={post._id} className="post-item">
                            <tr>
                                <th className='avatar-cot'>
                                    <img className="avatar" src={post.avatar} /> 
                                    <h5 className="user-name">{post.userName}</h5> 
                                    {localStorage.getItem('userId') === post.userId ? (
                                    <button className="edit-post-button" onClick={() => handleEditPost(post)}>Sửa</button>
                                    ) : null}
                                </th>
                            </tr>
                            <tr> <th> <h4 className="post-title">{post.title}</h4> </th> </tr>
                            <tr className="post-media">
                                <th>
                                {post.album.map((url, index) => (
                                    <div key={index} className="media-item">
                                        {isVideo(url) ? (
                                            <video className="video-player" controls>
                                                <source src={url} type="video/mp4" />
                                            </video>
                                        ) : (
                                            <img className="image" src={url} alt={`Image ${index}`} />
                                        )}
                                    </div>
                                ))}
                                </th>
                            </tr>
                    </table>
                ))}
        </tr>
        </table>
    );
}

export default Home;
