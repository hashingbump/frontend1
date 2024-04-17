import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';
import './style.scss';

function Home() {
    const baseUrl = 'https://back2-1.onrender.com';
    const [title, setTitle] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();
    
    const handleCreatePost = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);

            mediaFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await axios.post(baseUrl+'/users/posts/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPosts(prevPosts => [...prevPosts, response.data.data]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try{
                if(!localStorage.getItem('token') && !localStorage.getItem('refreshToken')) navigate('/');

                let checkAT = false, checkRT = false;
                let typeToken = 'AT';
                if(localStorage.getItem('token')){
                    const res = await axios.post(baseUrl+'/users/verifyToken',{typeToken},{
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if(res.data.data === 'Token valid') checkAT=true;
                }
                typeToken = 'RT';
                if(localStorage.getItem('refreshToken')){
                    const res = await axios.post(baseUrl+'/users/verifyToken',{typeToken},{
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                        }
                    });
                    if(res.data.data === 'RFToken valid') checkRT=true;
                }

                if(!checkAT && checkRT){
                    const response = await axios.post(baseUrl+'/users/addAccessToken', { userId: localStorage.getItem('userId')});
                    if(response.data.token){
                        localStorage.setItem('token', response.data.token);
                    }
                }else if(checkAT && !checkRT){
                    if(localStorage.getItem('refreshToken')){
                        await axios.post(baseUrl+'/users/refreshToken/delete', null, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                            }
                        });
                    }
                    const response = await axios.post(baseUrl+'/users/addRefreshToken', { userId: localStorage.getItem('userId')});
                    if(response.data.refreshToken){
                        localStorage.setItem('refreshToken', response.data.token);
                    }
                }else if(checkAT && checkRT){

                }else{
                    if(localStorage.getItem('token'))
                        localStorage.removeItem('token');
                    if(localStorage.getItem('refreshToken')){
                        await axios.post(baseUrl+'/users/refreshToken/delete', null, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                            }
                        });
                        localStorage.removeItem('refreshToken');
                    }
                    if(localStorage.getItem('userId'))
                        localStorage.removeItem('userId');
                    navigate('/');
                }
            } catch (error) {
                console.error(error);
                navigate('/');
            }
        };
        fetchData();
        fetchPosts();
    }, [posts]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(baseUrl+'/users/posts');
            setPosts(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (e) => {
        setMediaFiles([...e.target.files]);
    };

    const handleEditPost = (post) => {
        navigate(`/editPost/${post._id}`);
    };

    const isVideo = (url) => {
        const a = ['.jpg','.jpeg','.png','.gif','.raw'];
        for(let i=0; i<a.length; i++)
            if(url.endsWith(a[i])) return false;
    
        return true;
    };

    return (
        <table className="home-container">
        <tr className='header'>
            <th className='header-th'>
                <Layout/> 
            </th>
        </tr>
        <tr className="create-post-section">
            <th>
                <input className="create-post-text-input" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input className="create-post-input" type="file" multiple onChange={handleFileChange} />
                <button className="create-post-button" onClick={handleCreatePost}>Create Post</button>
            </th>
        </tr>
        <tr className="post-list">
                {posts.map(post => (
                    <table key={post._id} className="post-item">
                            <tr>
                                <th className='avatar-cot'>
                                    <img className="avatar" src={post.avatar} /> 
                                    <p className="user-name">{post.userName}</p> 
                                    {localStorage.getItem('userId') === post.userId ? (
                                    <button className="edit-post-button" onClick={() => handleEditPost(post)}>⋮</button>
                                    ) : null}
                                </th>
                            </tr>
                            <tr> <th> <p className="post-title">{post.title}</p> </th> </tr>
                            <tr className="post-media">
                                <th>
                                {post.album.map((url, index) => (
                                    <div key={index} className="media-item">
                                        {isVideo(url) ? (
                                            <video className="video-player" controls>
                                                <source src={url} />
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
