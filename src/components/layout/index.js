import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.scss'

function Layout() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            if(localStorage.getItem('token'))
                localStorage.removeItem('token');
            if(localStorage.getItem('refreshToken')){
                await axios.post('/users/refreshToken/delete', null, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                    }
                });
                localStorage.removeItem('refreshToken');
            }
            if(localStorage.getItem('userId'))
                localStorage.removeItem('userId');
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <table class="navigation-buttons">
            <tr>
                <th> <button class="btn btn-home-layout" onClick={() => { navigate('/home'); }}>Home</button> </th>
                <th> <button class="btn btn-personal-layout" onClick={() => { navigate('/personal'); }}>Personal</button> </th>
                <th> <button class="btn btn-account-layout" onClick={() => { navigate('/account'); }}>Account</button> </th>
                <th>
                    {localStorage.getItem('token') ? (
                    <button class="btn btn-signout" onClick={handleLogout}>Logout</button>
                    ) : (
                        <button class="btn btn-signin" onClick={() => {navigate('/'); }}>Login</button>
                    )} 
                </th>
            </tr>
        </table>
    );
}

export default Layout;
