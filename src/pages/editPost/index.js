import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';

function EditPost() {
    const { postId } = useParams();
    const [title, setTitle] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
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
    }, []);

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);

            mediaFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await axios.post(`/users/posts/${postId}`, formData, {
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

    const handleFileChange = (e) => {
        setMediaFiles([...e.target.files]);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.post(`/users/posts/delete/${postId}`, null);
            setMessage('Delete successfully');
        } catch (error) {
            setMessage(error);
        }
    };

    return (
        <div>
            <div><Layout/></div>
            <div>
                <h2>Cap nhap Bai Post</h2>
                <br/>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <br/>
                <input type="file" multiple onChange={handleFileChange} />
                <br/>
                <button onClick={handleUpdate}>Cap Nhap</button>
                <button onClick={handleDelete}>Xoa Bai Post</button>
            </div>
            <p>{message}</p>
        </div>
    );
}

export default EditPost;
