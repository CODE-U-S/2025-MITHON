import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import ChatRoom from './ChatRoom';
import ProfileDisplay from './ProfileDisplay';
import ProfileEdit from './ProfileEdit';
import FriendListModal from './FriendListModal';
import FriendProfileDisplay from './FriendProfileDisplay';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [chatTarget, setChatTarget] = useState('');
  const [friendList, setFriendList] = useState([]);
  const [showFriendListModal, setShowFriendListModal] = useState(false);
  const [selectedFriendProfile, setSelectedFriendProfile] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [randomFriendProfile, setRandomFriendProfile] = useState(null);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }

    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      const dummyProfile = { name: '사용자' };
      setUserProfile(dummyProfile);
      localStorage.setItem('userProfile', JSON.stringify(dummyProfile));
    }

    const storedFriendList = localStorage.getItem('friendList');
    let initialFriendList;
    if (storedFriendList) {
      initialFriendList = JSON.parse(storedFriendList);
      setFriendList(initialFriendList);
    } else {
      const dummyFriendList = [
        { id: 1, name: '친구1', intimacy: '70', status: '온라인' },
        { id: 2, name: '친구2', intimacy: '85', status: '오프라인' },
        { id: 3, name: '친구3', intimacy: '60', status: '온라인' },
      ];
      initialFriendList = dummyFriendList;
      setFriendList(initialFriendList);
      localStorage.setItem('friendList', JSON.stringify(dummyFriendList));
    }

    if (initialFriendList && initialFriendList.length > 0) {
      const randomIndex = Math.floor(Math.random() * initialFriendList.length);
      setRandomFriendProfile(initialFriendList[randomIndex]);
    }

    const storedChatHistories = localStorage.getItem('chatHistories');
    if (storedChatHistories) {
      setChatHistories(JSON.parse(storedChatHistories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
  }, [chatHistories]);


  const handleLoginSuccess = (status, rememberMe) => {
    setIsLoggedIn(status);
    setShowLoginModal(false);
    if (rememberMe) {
      localStorage.setItem('isLoggedIn', 'true');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setCurrentScreen('home');
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleSaveProfile = (updatedProfile) => {
    setUserProfile({ name: updatedProfile.name });
    localStorage.setItem('userProfile', JSON.stringify({ name: updatedProfile.name }));
    setCurrentScreen('profile');
  };

  const handleOpenChatSelection = () => {
    if (isLoggedIn) {
      setShowFriendListModal(true);
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  const handleSelectChatTarget = (friendName) => {
    setChatTarget(friendName);
    setCurrentScreen('chat');
    setShowFriendListModal(false);
  };

  const handleViewFriendProfile = (friend) => {
    setSelectedFriendProfile(friend);
    setCurrentScreen('friendProfileDisplay');
    setShowFriendListModal(false);
  };

  const updateFriendChatHistory = (friendName, newMessages) => {
    setChatHistories(prevHistories => ({
      ...prevHistories,
      [friendName]: newMessages
    }));
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <button onClick={handleLogout} className="main-logout-btn">
          로그아웃
        </button>
      ) : (
        <button onClick={openLoginModal} className="main-login-btn">
          로그인
        </button>
      )}

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', paddingBottom: '60px' }}>
        {currentScreen === 'home' && (
          <div style={{ textAlign: 'center' }}>
            <h1>메인 화면</h1>
            {isLoggedIn ? (
              <>
                <p>환영합니다! 로그인에 성공하셨습니다.</p>
                <button onClick={() => setCurrentScreen('editProfile')} style={{ marginTop: '20px', padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  프로필 편집
                </button>
                {randomFriendProfile && (
                  <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h3>오늘의 추천 친구</h3>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{randomFriendProfile.name}</p>
                    <button onClick={() => handleViewFriendProfile(randomFriendProfile)} style={{ marginTop: '10px', padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      자세히 보기
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>로그인이 필요합니다.</p>
            )}
          </div>
        )}

        {currentScreen === 'chat' && isLoggedIn && chatTarget && (
          <ChatRoom
            chatTarget={chatTarget}
            messages={chatHistories[chatTarget] || []}
            updateChatHistory={(newMessages) => updateFriendChatHistory(chatTarget, newMessages)}
          />
        )}
        {currentScreen === 'profile' && isLoggedIn && userProfile && (
          <ProfileDisplay profile={userProfile} onEditProfile={() => setCurrentScreen('editProfile')} />
        )}
        {currentScreen === 'editProfile' && isLoggedIn && userProfile && (
          <ProfileEdit profile={userProfile} onSaveProfile={handleSaveProfile} onCancelEdit={() => setCurrentScreen('profile')} />
        )}
        {currentScreen === 'friendProfileDisplay' && isLoggedIn && selectedFriendProfile && (
          <FriendProfileDisplay friend={selectedFriendProfile} onClose={() => setCurrentScreen('home')} />
        )}

        {(!isLoggedIn && currentScreen !== 'home') && (
            <p>로그인이 필요합니다.</p>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: '0', width: '100%', display: 'flex', justifyContent: 'space-around', padding: '10px', background: '#f8f8f8', borderTop: '1px solid #eee', zIndex: 999 }}>
        <button onClick={() => setCurrentScreen('home')} style={{ padding: '8px 15px', background: currentScreen === 'home' ? '#e0e0e0' : 'none', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>홈</button>
        <button onClick={handleOpenChatSelection} style={{ padding: '8px 15px', background: currentScreen === 'chat' ? '#e0e0e0' : 'none', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>채팅</button>
        <button onClick={() => setCurrentScreen('profile')} style={{ padding: '8px 15px', background: currentScreen === 'profile' || currentScreen === 'editProfile' ? '#e0e0e0' : 'none', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>프로필</button>
      </div>

      {showLoginModal && (
        <div className="modal-overlay">
          <Login onLoginSuccess={handleLoginSuccess} onClose={closeLoginModal} />
        </div>
      )}

      {showFriendListModal && (
        <div className="modal-overlay">
          <FriendListModal
            friendList={friendList}
            onSelectChatTarget={handleSelectChatTarget}
            onViewFriendProfile={handleViewFriendProfile}
            onClose={() => setShowFriendListModal(false)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
