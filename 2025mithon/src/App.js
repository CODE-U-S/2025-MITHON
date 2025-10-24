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
  const [allUsers, setAllUsers] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [showFriendListModal, setShowFriendListModal] = useState(false);
  const [selectedFriendProfile, setSelectedFriendProfile] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [randomFriendProfiles, setRandomFriendProfiles] = useState([]);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }

    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      const dummyProfile = { name: '사용자', profilePic: 'https://placehold.co/60x60' };
      setUserProfile(dummyProfile);
      localStorage.setItem('userProfile', JSON.stringify(dummyProfile));
    }

    let initialAllUsers;
    try {
        const storedUsers = localStorage.getItem('allUsers');
        if (storedUsers) {
            initialAllUsers = JSON.parse(storedUsers);
        }
    } catch (error) {
        console.error("Error parsing allUsers from localStorage", error);
        initialAllUsers = null;
    }

    if (!initialAllUsers || initialAllUsers.length === 0) {
        initialAllUsers = [
            { id: 1, name: '친구1', intimacy: 0, status: '온라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 2, name: '친구2', intimacy: 0, status: '오프라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 3, name: '친구3', intimacy: 0, status: '온라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 4, name: '친구4', intimacy: 0, status: '온라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 5, name: '친구5', intimacy: 0, status: '오프라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 6, name: '친구6', intimacy: 0, status: '온라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 7, name: '친구7', intimacy: 0, status: '온라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 8, name: '친구8', intimacy: 0, status: '오프라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 9, name: '친구9', intimacy: 0, status: '온라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 10, name: '친구10', intimacy: 0, status: '온라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 11, name: '친구11', intimacy: 0, status: '오프라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 12, name: '친구12', intimacy: 0, status: '온라인', isFriend: true, profilePic: 'https://placehold.co/60x60' },
            { id: 13, name: '추천친구1', intimacy: 0, status: '온라인', isFriend: false, profilePic: 'https://placehold.co/60x60' },
            { id: 14, name: '추천친구2', intimacy: 0, status: '오프라인', isFriend: false, profilePic: 'https://placehold.co/60x60' }
        ];
        localStorage.setItem('allUsers', JSON.stringify(initialAllUsers));
    }

    const finalAllUsers = initialAllUsers.map(user => ({ ...user, intimacy: user.isFriend ? user.intimacy : 0 }));
    setAllUsers(finalAllUsers);
    setFriendList(finalAllUsers.filter(user => user.isFriend));
    const storedChatHistories = localStorage.getItem('chatHistories');
    if (storedChatHistories) {
      setChatHistories(JSON.parse(storedChatHistories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
    localStorage.setItem('friendList', JSON.stringify(friendList));
  }, [chatHistories, friendList]);

  useEffect(() => {
    const recommendedFriends = allUsers.filter(user => !user.isFriend);
    const shuffled = [...recommendedFriends].sort(() => 0.5 - Math.random());
    setRandomFriendProfiles(shuffled.slice(0, 10));
  }, [allUsers]);


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

  const addFriend = (userId) => {
    setAllUsers(prevAllUsers => {
        const newAllUsers = prevAllUsers.map(user => {
            if (user.id === userId) {
                return { ...user, isFriend: true };
            }
            return user;
        });
        localStorage.setItem('allUsers', JSON.stringify(newAllUsers));
        setFriendList(newAllUsers.filter(user => user.isFriend));
        setCurrentScreen('home');
        return newAllUsers;
    });
  };

  const removeFriend = (userId) => {
    setAllUsers(prevAllUsers => {
        const newAllUsers = prevAllUsers.map(user => {
            if (user.id === userId) {
                return { ...user, isFriend: false, intimacy: 0 };
            }
            return user;
        });
        localStorage.setItem('allUsers', JSON.stringify(newAllUsers));
        setFriendList(newAllUsers.filter(user => user.isFriend));
        setCurrentScreen('home');
        return newAllUsers;
    });
  };

  const updateFriendChatHistory = (friendName, newMessages) => {
    setChatHistories(prevHistories => ({
      ...prevHistories,
      [friendName]: newMessages
    }));

    setFriendList(prevFriendList => {
      return prevFriendList.map(friend => {
        if (friend.name === friendName) {
          const intimacyIncrease = Math.random() < 0.5 ? 0 : 1;
          return { ...friend, intimacy: friend.intimacy + intimacyIncrease };
        }
        return friend;
      });
    });
  };

  const currentFriend = friendList.find(friend => friend.name === chatTarget);
  const currentFriendIntimacy = currentFriend ? currentFriend.intimacy : 0;


  return (
    <div className="App">
      {currentScreen === 'home' && isLoggedIn ? (
        <div style={{ width: '402px', height: '874px', position: 'relative', background: 'white', overflow: 'hidden' }}>
          <div style={{ width: '402px', height: '47px', padding: '17px', left: '0px', top: '105px', position: 'absolute', overflow: 'hidden', borderBottom: '1px #C7C7C7 solid', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', display: 'inline-flex' }}>
            <div style={{ width: '101px', height: '22px', position: 'relative' }}>
              <div style={{ left: '0px', top: '0px', position: 'absolute', color: 'black', fontSize: '24px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '22px', wordWrap: 'break-word' }}>마인드맵</div>
            </div>
          </div>
          <div style={{ width: '402px', height: '56px', left: '0px', top: '49px', position: 'absolute', background: 'white', overflow: 'hidden', borderBottom: '1px #C7C7C7 solid' }}>
            <div style={{ left: '14px', top: '17px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '22px', wordWrap: 'break-word' }}>우</div>
            <div style={{ left: '369.80px', top: '17px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '22px', wordWrap: 'break-word' }}>선</div>
            <img style={{ width: '56px', height: '56px', left: '170px', top: '0px', position: 'absolute', borderBottom: '1px #C7C7C7 solid' }} src="https://placehold.co/56x56" alt="profile" />
          </div>
          <div style={{ width: '402px', height: '84px', left: '0px', top: '790px', position: 'absolute', background: 'white', borderTop: '0.50px rgba(60, 60, 67, 0.36) solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
            <div style={{ alignSelf: 'stretch', height: '53px', paddingLeft: '26px', paddingRight: '26px', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex' }}>
              <div onClick={() => setCurrentScreen('home')} style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '3px', display: 'inline-flex', cursor: 'pointer' }}>
                <div style={{ width: '24px', height: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: '17.98px', height: '18px', left: '3.01px', top: '3px', position: 'absolute', background: 'black' }}></div>
                </div>
                <div style={{ alignSelf: 'stretch', textAlign: 'center', color: '#007AFF', fontSize: '10px', fontFamily: 'Pretendard', fontWeight: '500', wordWrap: 'break-word' }}>홈</div>
              </div>
              <div onClick={handleOpenChatSelection} style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '3px', display: 'inline-flex', cursor: 'pointer' }}>
                <div style={{ width: '24px', height: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: '18px', height: '18px', left: '3px', top: '3px', position: 'absolute', background: 'rgba(0, 0, 0, 0.40)' }}></div>
                </div>
                <div style={{ alignSelf: 'stretch', textAlign: 'center', color: '#007AFF', fontSize: '10px', fontFamily: 'Pretendard', fontWeight: '500', wordWrap: 'break-word' }}>대화</div>
              </div>
            </div>
            <div style={{ alignSelf: 'stretch', height: '31px', position: 'relative' }}>
              <div style={{ width: '134px', height: '5px', left: '134px', top: '18px', position: 'absolute', background: 'black', borderRadius: '100px' }}></div>
            </div>
          </div>
          <div style={{ width: '24.87px', height: '135.32px', left: '172.67px', top: '240.32px', position: 'absolute', opacity: 0.40, borderRadius: '20px', outline: '3px black solid', outlineOffset: '-1.50px' }}></div>
          <img style={{ width: '50.51px', height: '238.56px', left: '93px', top: '481.05px', position: 'absolute', opacity: 0.40, background: '#EEEEEE', borderRadius: '20px', outline: '3px black solid', outlineOffset: '-1.50px' }} src="https://placehold.co/51x239" alt="" />
          <img style={{ width: '35.47px', height: '246.58px', left: '215.27px', top: '513.42px', position: 'absolute', opacity: 0.40, background: '#EEEEEE', borderRadius: '20px', outline: '3px black solid', outlineOffset: '-1.50px' }} src="https://placehold.co/35x247" alt="" />
          <img style={{ width: '64.31px', height: '61.55px', left: '73.18px', top: '365.93px', position: 'absolute', opacity: 0.40, background: '#EEEEEE', borderRadius: '20px', outline: '3px black solid', outlineOffset: '-1.50px' }} src="https://placehold.co/64x62" alt="" />
          <div style={{ width: '105.57px', height: '78.60px', left: '266.43px', top: '365.93px', position: 'absolute', opacity: 0.40, borderRadius: '20px', outline: '3px black solid', outlineOffset: '-1.50px' }}></div>
          <div style={{ width: '111.64px', height: '118.56px', left: '17.36px', top: '456.62px', position: 'absolute', opacity: 0.40, borderRadius: '20px', outline: '3px black solid', outlineOffset: '-1.50px' }}></div>
          <div style={{ width: '8.53px', height: '78.29px', left: '189px', top: '513.42px', position: 'absolute', opacity: 0.40, borderRadius: '20px', outline: '3px black solid', outlineOffset: '-1.50px' }}></div>
          <div style={{ width: '63.24px', height: '204.21px', left: '261.76px', top: '210.32px', position: 'absolute', opacity: 0.40, borderRadius: '20px', outline: '3px black solid', outlineOffset: '-1.50px' }}></div>
          <div style={{ width: '104.64px', height: '136.46px', left: '243.02px', top: '456.62px', position: 'absolute', opacity: 0.40, borderRadius: '20px', outline: '3px black solid', outlineOffset: '-1.50px' }}></div>
          <div style={{ width: '156.49px', height: '156.49px', left: '122.76px', top: '362.76px', position: 'absolute', cursor: 'pointer' }} onClick={() => setCurrentScreen('profile')}>
            <img style={{ width: '60px', height: '60px', left: '6.24px', top: '198.95px', position: 'absolute', background: '#EEEEEE', borderRadius: '9999px' }} src="https://placehold.co/60x60" alt="" />
            <img style={{ width: '60px', height: '60px', left: '194.91px', top: '230.33px', position: 'absolute', background: '#EEEEEE', borderRadius: '9999px' }} src="https://placehold.co/60x60" alt="" />
            <img style={{ width: '60px', height: '60px', left: '219.24px', top: '-56.83px', position: 'absolute', background: '#EEEEEE', borderRadius: '9999px' }} src="https://placehold.co/60x60" alt="" />
            <img style={{ width: '60px', height: '60px', left: '176.91px', top: '-182.44px', position: 'absolute', background: '#EEEEEE', borderRadius: '9999px' }} src="https://placehold.co/60x60" alt="" />
            <img style={{ width: '60px', height: '60px', left: '110.24px', top: '367.24px', position: 'absolute', background: '#EEEEEE', borderRadius: '9999px' }} src="https://placehold.co/60x60" alt="" />
            <img style={{ width: '60px', height: '60px', left: '-88.42px', top: '-39.78px', position: 'absolute', background: '#EEEEEE', borderRadius: '9999px' }} src="https://placehold.co/60x60" alt="" />
            <img style={{ width: '60px', height: '60px', left: '-10.09px', top: '-152.44px', position: 'absolute', background: '#EEEEEE', borderRadius: '9999px' }} src="https://placehold.co/60x60" alt="" />
            <img style={{ width: '60px', height: '60px', left: '-51.76px', top: '320.33px', position: 'absolute', background: '#EEEEEE', borderRadius: '9999px' }} src="https://placehold.co/60x60" alt="" />
            <img style={{ width: '60px', height: '60px', left: '-135.76px', top: '200.33px', position: 'absolute', background: '#EEEEEE', borderRadius: '9999px' }} src="https://placehold.co/60x60" alt="" />
            <div style={{ width: '156.49px', height: '156.49px', left: '0px', top: '0px', position: 'absolute', background: '#999999', borderRadius: '9999px' }}></div>
            <div style={{ width: '137.79px', height: '137.79px', left: '9.35px', top: '9.35px', position: 'absolute', background: '#F2F2F2', borderRadius: '9999px' }}></div>
            <div style={{ width: '56.93px', left: '49.78px', top: '45.24px', position: 'absolute', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
              <div style={{ width: '56.93px', height: '56.95px', background: '#119DE3' }}></div>
              <div style={{ alignSelf: 'stretch', textAlign: 'center', color: '#119DE3', fontSize: '14px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '22px', wordWrap: 'break-word' }}>profile</div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                <p>로그인이 필요합니다.</p>
              </div>
            )}

            {currentScreen === 'chat' && isLoggedIn && chatTarget && (
              <ChatRoom
                chatTarget={chatTarget}
                messages={chatHistories[chatTarget] || []}
                updateChatHistory={(newMessages) => updateFriendChatHistory(chatTarget, newMessages)}
                friendIntimacy={currentFriendIntimacy}
              />
            )}
            {currentScreen === 'profile' && isLoggedIn && userProfile && (
              <ProfileDisplay profile={userProfile} onEditProfile={() => setCurrentScreen('editProfile')} />
            )}
            {currentScreen === 'editProfile' && isLoggedIn && userProfile && (
              <ProfileEdit profile={userProfile} onSaveProfile={handleSaveProfile} onCancelEdit={() => setCurrentScreen('profile')} />
            )}
            {currentScreen === 'friendProfileDisplay' && isLoggedIn && selectedFriendProfile && (
              <FriendProfileDisplay friend={selectedFriendProfile} onClose={() => setCurrentScreen('home')} addFriend={addFriend} removeFriend={removeFriend} />
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
        </>
      )}

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