import React, { useState, useEffect } from 'react';
import './App.css';

const Login = ({ onLoginSuccess, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [message, setMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const loadUsers = () => {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    };

    const saveUsers = (users) => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    const handleAuth = (e) => {
        e.preventDefault();
        setMessage('');
        let users = loadUsers();

        if (isRegistering) {
            if (users.some(user => user.username === username)) {
                setMessage('이미 존재하는 아이디입니다.');
                return;
            }
            users.push({ username, password });
            saveUsers(users);
            setMessage('회원가입 성공! 로그인해주세요.');
            setIsRegistering(false);
        } else {
            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
                setMessage('로그인 성공!');
                onLoginSuccess(true, rememberMe);
            } else {
                setMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h3>{isRegistering ? '회원가입' : '로그인'}</h3>
                <p>환영합니다!</p>
            </div>

            <form onSubmit={handleAuth} className="login-form">
                <input
                    type="text"
                    placeholder="아이디"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    required
                />
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-start' }}>
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ marginRight: '5px' }}
                    />
                    <label htmlFor="rememberMe">로그인 유지</label>
                </div>
                <button type="submit" className="login-btn">
                    {isRegistering ? '회원가입' : '로그인'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="toggle-auth-btn"
                >
                    {isRegistering ? '로그인 화면으로' : '회원가입'}
                </button>
                <button type="button" onClick={onClose} className="toggle-auth-btn" style={{marginTop: '10px'}}>
                    닫기
                </button>
            </form>
            {message && <p className="auth-message">{message}</p>}
        </div>
    );
};

export default Login;