import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';

function Personal() {
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
            const response = await axios.get('/users/posts/personal', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
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

    return (
        <div>
            <div><Layout/></div>
            <h2>Create a New Post</h2>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleCreatePost}>Create Post</button>
            <p>{message}</p>
            <div>
                <h2>Cac bai post:</h2>
                {posts.map(post => (
                    <div key={post._id}>
                        {localStorage.getItem('userId') === post.userId ? (
                            <button onClick={() => handleEditPost(post)}>Chỉnh Sửa</button>
                        ) : ''}
                        <h3>{post.title}</h3>
                        {post.album.map(e => (
                            <img src={e}/>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Personal;
