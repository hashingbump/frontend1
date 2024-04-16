import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';
import './style.scss';

function EditPost() {
    const baseUrl = 'https://back2-1.onrender.com';
    const { postId } = useParams();
    const [title, setTitle] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.post(baseUrl+`/users/posts/delete/${postId}`, null);
            setMessage('Delete successfully');
        } catch (error) {
            setMessage(error);
        }
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);

            mediaFiles.forEach(file => {
                formData.append('files', file);
            });

            await axios.post(baseUrl+`/users/posts/${postId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessage(`Post updated successfully`);
        } catch (error) {
            setMessage('Error Update');
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
    }, [handleDelete, handleUpdate]);

    const handleFileChange = (e) => {
        setMediaFiles([...e.target.files]);
    };

    return (
        <table className="home-container">
        <tr className='header'>
            <th className='header-th'>
                <Layout/> 
            </th>
        </tr>
        <tr>
            <th className="container">
                <h1 className='ten'>Update Post</h1>
                <div className="login-form">
                    <input className="userName-input" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <div className='avatar-file'>
                        <p>Files</p>
                        <input className="file-input" type="file" multiple onChange={handleFileChange} />
                    </div>
                    <button className="login-btn" onClick={handleUpdate}>Update</button>
                    <br/> <br/>
                    <button className="signup-btn" onClick={handleDelete}>Delete Post</button>
                </div>
                <p class="message">{message}</p>
            </th>
        </tr>
        </table>
    );
}

export default EditPost;
