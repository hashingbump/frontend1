import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';
import './style.scss';

function Home() {
    const baseUrl = 'https://back1-fs9h.onrender.com';
    const navigate = useNavigate();

    const [selectedMovies, setSelectedMovies] = useState([]);
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;
  
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    useEffect(() => {
        const checkToken = async () => {
            try {
                if(localStorage.getItem('token')) {
                    const response = await axios.get(baseUrl+'/verifyToken', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if(response.data.data !== 'Token valid') {
                        localStorage.removeItem('token');
                        navigate('/');
                    }
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkToken();
        fetchPosts();
    }, [navigate]);
    
    const fetchPosts = async () => {
        try {
            const response = await axios.get(baseUrl+'/users/movies/all',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPosts(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageClick = (index) => {
        const newSelectedMovies = [...selectedMovies];
        newSelectedMovies[index] = true;
        setSelectedMovies(newSelectedMovies);
    };

    return (
        <table className="home-container">
        <tr className='header'>
            <th className='header-th'>
                <Layout/> 
            </th>
        </tr>
        <tr> <th> <p className='t1'> Most Popular Movies </p> </th> </tr>
        <tr className="post-list">
                {posts.slice(indexOfFirstPost, indexOfLastPost).map((post, index) => (
                    <table key={post._id} className="post-item">
                            <tr className="post-media">
                                <th>
                                    <img className="image" onClick={() => handleImageClick(index)} src={post.image} alt='Error' />
                                </th>
                            </tr>
                            <tr> <th className='k1'> <p className="post-name">{post.name}</p> </th> </tr>
                            <tr> 
                                <th>
                                    <div className='last'>
                                        <p className="post-time">{post.time}</p>
                                        <p className="post-year">{post.year}</p>
                                    </div> 
                                </th> 
                            </tr>
                            {selectedMovies[index] && (
                                <div className="movie-detail-popup">
                                    <div className='pop1'>
                                        <img className="image2" src={post.image} alt='Error' />
                                    </div>
                                    <div className="pop2">
                                        <div className='pop3'>
                                            <label className='close-btn' onClick={() => setSelectedMovies(prevState => prevState.map((value, idx) => idx === index ? false : value))}>X</label>
                                        </div>
                                        <p className='n1'>{post.name}</p>
                                        <div className='n2'>
                                            <p className="n2-1">{post.time}</p>
                                            <p className="n2-2">{post.year}</p>
                                        </div> 
                                        <p className='n3'>{post.introduce}</p>
                                        <button className='n4'>PLAY MOVIE</button>
                                    </div>
                                </div>
                            )}
                    </table>
                ))}
        </tr>
        <tr>
            <th>
                {posts.length > postsPerPage && (
                    <div className="pagination">
                        <button  onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            Prev
                        </button>
                        <button className='next' onClick={() => paginate(currentPage + 1)} disabled={indexOfLastPost >= posts.length}>
                            Next
                        </button>
                    </div>
                )}
            </th>
        </tr>
        </table>
    );
}

export default Home;
