import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';

function Account() {
    const [userName, setUserName] = useState('');
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            formData.append('userName', userName);
            formData.append('file', file);
            formData.append('email', email);
            formData.append('password', password);

            const response = await axios.post('/users/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setMessage('Update successfully');
        } catch (error) {
            setMessage('Error Update');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.post('/users/delete', null, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(localStorage.getItem('token')){
                localStorage.removeItem('token');
            }
            navigate('/');
            setMessage('Delete successfully');
        } catch (error) {
            setMessage(error);
        }
    };

    return (
        <div>
            <div><Layout/></div>
            <div>
                <h2>Cap nhap Tai Khoan</h2>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <br/>
                <input type="text" placeholder="UserName" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <br/>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br/>
                <button onClick={handleUpdate}>Cap Nhap</button>
                <button onClick={handleDelete}>Xoa tai khoan</button>
            </div>
            <p>{message}</p>
        </div>
    );
}

export default Account;
