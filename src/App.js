import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Account from './pages/account';
import Login from './pages/login';
import Register from './pages/register';
import EditPost from './pages/editPost';
import Personal from './pages/personal';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/home' element={<Home />} />
                <Route path='/account' element={<Account />} />
                <Route path='/personal' element={<Personal />} />
                <Route path='/editPost/:postId' element={<EditPost />} />
                <Route path='*' element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
