import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';
import './style.scss';

function Account() {
    const baseUrl = 'https://back2-1.onrender.com';
    const [userName, setUserName] = useState('');
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.post(baseUrl+'/users/delete', null, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
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
            
            setMessage('Delete successfully');
            navigate('/');
        } catch (error) {
            setMessage(error);
        }
    };

    const handleUpdate = async () => {
        try {
            if(userName.length<8)
                setMessage('UserName must be at least 8 letters');
            else{
                const formData = new FormData();
                formData.append('userName', userName);
                formData.append('file', file);
                formData.append('password', password);

                const res = await axios.post(baseUrl+'/users/update', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(res.data.data === 'Done')
                    setMessage('Update successfully');
                else setMessage('Wrong Password ');
            }
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
    }, [message]);

    return (
        <table className="home-container">
        <tr className='header'>
            <th className='header-th'>
                <Layout/> 
            </th>
        </tr>
        <tr>
            <th className="container">
                <h1 className='ten'>Update Account</h1>
                <div className="login-form">
                    <div className='avatar-file'>
                        <p>Avatar: </p>
                        <input className="file-input" type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                    <input className="userName-input" type="text" placeholder="UserName" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <input className="password-input" type="password" placeholder="Type password to update" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="login-btn" onClick={handleUpdate}>Update</button>
                    <br/> <br/>
                    <button className="signup-btn" onClick={handleDelete}>Delete Account</button>
                </div>
                <p class="message">{message}</p>
            </th>
        </tr>
        </table>
    );
}

export default Account;
