import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import ChatRoom from './ChatRoom';
import ProfileDisplay from './ProfileDisplay';
import ProfileEdit from './ProfileEdit';
import FriendListModal from './FriendListModal';
import FriendProfileDisplay from './FriendProfileDisplay';
import ProfileEditLogo from './assets/myProfileEdit.png'; // 중앙 아이콘
import ProgramLogo from './assets/Logo.png'; // 상단 로고
import peopleMyeonsang from './assets/peopleMyeonsang.png';
import HomeIcon from './assets/home.png';
import ChatIcon from './assets/chat.png';

function App() {
  // --- 기존 State 및 useEffect, 핸들러 함수들 (변경 없음) ---
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
            { id: 1, name: '친구1', intimacy: 0, status: '온라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 2, name: '친구2', intimacy: 0, status: '오프라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 3, name: '친구3', intimacy: 0, status: '온라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 4, name: '친구4', intimacy: 0, status: '온라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 5, name: '친구5', intimacy: 0, status: '오프라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 6, name: '친구6', intimacy: 0, status: '온라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 7, name: '친구7', intimacy: 0, status: '온라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 8, name: '친구8', intimacy: 0, status: '오프라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 9, name: '친구9', intimacy: 0, status: '온라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 10, name: '친구10', intimacy: 0, status: '온라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 11, name: '친구11', intimacy: 0, status: '오프라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 12, name: '친구12', intimacy: 0, status: '온라인', isFriend: true, profilePic:peopleMyeonsang},
            { id: 13, name: '추천친구1', intimacy: 0, status: '온라인', isFriend: false, profilePic:peopleMyeonsang},
            { id: 14, name: '추천친구2', intimacy: 0, status: '오프라인', isFriend: false, profilePic:peopleMyeonsang}
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

  // --- [추가] 좌표 계산 로직 ---
  // 중앙 노드 좌표 (Figma 기준)
  const centerNode = {
    cx: 122.76 + 156.49 / 2, // left + width/2
    cy: 362.76 + 156.49 / 2, // top + height/2
    style: { // 중앙 노드 스타일 (Figma 원본 + zIndex)
      width: '156.49px',
      height: '156.49px',
      left: '122.76px',
      top: '362.76px',
      position: 'absolute',
      cursor: 'pointer',
      zIndex: 10 // 친구 노드/선보다 위에
    }
  };

  // 친구 노드들 정보 (Figma 좌표 기반 중심 계산)
  // [ {left, top, width, height}, ... ] -> 각 사각형의 정보
  const friendRects = [
    { left: 172.67, top: 240.32, width: 24.87, height: 135.32 }, // 1번
    { left: 93, top: 481.05, width: 50.51, height: 238.56 },      // 2번
    { left: 215.27, top: 513.42, width: 35.47, height: 246.58 }, // 3번
    { left: 70.18, top: 305.93, width: 64.31, height: 61.55 },   // 4번
    { left: 266.43, top: 365.93, width: 105.57, height: 78.60 }, // 5번
    { left: 17.36, top: 456.62, width: 111.64, height: 118.56 }, // 6번
    { left: 189, top: 700.42, width: 8.53, height: 78.29 },      // 7번
    { left: 261.76, top: 210.32, width: 63.24, height: 204.21 }, // 8번
    { left: 243.02, top: 456.62, width: 104.64, height: 136.46 } // 9번
  ];

  // 친구 노드 원형 이미지 스타일 계산 (60x60 크기)
  const friendNodeLayout = friendRects.map(rect => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nodeSize = 60; // 친구 원 크기
    return {
      cx: cx,
      cy: cy,
      style: {
        width: `${nodeSize}px`,
        height: `${nodeSize}px`,
        left: `${cx - nodeSize / 2}px`, // 중심에서 반지름만큼 빼기
        top: `${cy - nodeSize / 2}px`,  // 중심에서 반지름만큼 빼기
      }
    };
  });
  // --- 좌표 계산 로직 끝 ---

  return (
    <div className="App">
      {currentScreen === 'home' && isLoggedIn ? (
        // --- 홈 화면 (로그인 상태) ---
        <div style={{ width: '402px', height: '874px', position: 'relative', background: 'white', overflow: 'hidden' }}>
          {/* 상단바, 하단 네비 등 원본 코드 유지 */}
          <div style={{ width: '402px', height: '47px', padding: '17px', left: '0px', top: '105px', position: 'absolute', overflow: 'hidden', borderBottom: '1px #C7C7C7 solid', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', display: 'inline-flex' }}>
            <div style={{ width: '101px', height: '22px', position: 'relative' }}>
              <div style={{ left: '0px', top: '0px', position: 'absolute', color: 'black', fontSize: '24px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '22px', wordWrap: 'break-word' }}>마인드맵</div>
            </div>
          </div>
          <div style={{ width: '402px', height: '56px', left: '0px', top: '49px', position: 'absolute', background: 'white', overflow: 'hidden', borderBottom: '1px #C7C7C7 solid' }}>
            <div style={{ left: '14px', top: '17px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '22px', wordWrap: 'break-word' }}>우</div>
            <div style={{ left: '369.80px', top: '17px', position: 'absolute', textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '22px', wordWrap: 'break-word' }}>선</div>
            <img style={{ width: '56px', height: '56px', left: '170px', top: '0px', position: 'absolute', borderBottom: '1px #C7C7C7 solid', objectFit:'contain' }} src={ProgramLogo} alt="Program Logo" />
          </div>
          <div style={{ width: '402px', height: '84px', left: '0px', top: '790px', position: 'absolute', background: 'white', borderTop: '0.50px rgba(60, 60, 67, 0.36) solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
            <div style={{ alignSelf: 'stretch', height: '53px', paddingLeft: '26px', paddingRight: '26px', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex' }}>
              <div onClick={() => setCurrentScreen('home')} style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '3px', display: 'inline-flex', cursor: 'pointer' }}>
                <img
                  src={HomeIcon} // import한 이미지 변수 사용
                  alt="홈"
                  style={{ width: '24px', height: '24px' }} // 아이콘 크기 지정
                />
                <div style={{ alignSelf: 'stretch', textAlign: 'center', color: '#007AFF', fontSize: '10px', fontFamily: 'Pretendard', fontWeight: '500', wordWrap: 'break-word' }}>홈</div>
              </div>
              <div onClick={handleOpenChatSelection} style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '3px', display: 'inline-flex', cursor: 'pointer' }}>
                {/* [수정] div 대신 img 태그 사용 */}
                <img
                  src={ChatIcon} // import한 이미지 변수 사용
                  alt="대화"
                  style={{ width: '24px', height: '24px' }} // 아이콘 크기 지정
              />
                <div style={{ alignSelf: 'stretch', textAlign: 'center', color: '#007AFF', fontSize: '10px', fontFamily: 'Pretendard', fontWeight: '500', wordWrap: 'break-word' }}>대화</div>
              </div>
            </div>
            <div style={{ alignSelf: 'stretch', height: '31px', position: 'relative' }}>
              <div style={{ width: '134px', height: '5px', left: '134px', top: '18px', position: 'absolute', background: 'black', borderRadius: '100px' }}></div>
            </div>
          </div>

          {/* [삭제] 1. 기존 사각형 div/img 태그들 (원본 249~257줄) 삭제 */}
          {/* <div style={{ width: '24.87px', ... }}></div> */}
          {/* <img style={{ width: '50.51px', ... }} /> */}
          {/* ... (이하 7개 더 삭제) ... */}

          {/* [추가] 4. SVG 선 그리기 */}
          <svg
            width="402px" // 부모 div 크기에 맞춤
            height="874px"
            style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}
          >
            {friendList.slice(0, 9).map((friend, index) => {
              const layout = friendNodeLayout[index];
              if (!layout) return null;
              return (
                <line
                  key={`line-${friend.id}`}
                  x1={centerNode.cx}
                  y1={centerNode.cy}
                  x2={layout.cx}
                  y2={layout.cy}
                  stroke="#C7C7C7" // 선 색상
                  strokeWidth="2"   // 선 두께
                />
              );
            })}
          </svg>

          {/* [삭제] 1. 중앙 노드 원본 코드의 img 9개 삭제 */}
          {/* [수정] 2. 중앙 노드 로고 변경 및 스타일 적용 */}
          <div style={centerNode.style} onClick={() => setCurrentScreen('profile')}>
            {/* 원본의 회색/흰색 배경 원은 유지 */}
            <div style={{ width: '100%', height: '100%', left: '0px', top: '0px', position: 'absolute', background: '#999999', borderRadius: '9999px' }}></div>
            <div style={{ width: 'calc(100% - 18.7px)', height: 'calc(100% - 18.7px)', left: '9.35px', top: '9.35px', position: 'absolute', background: '#F2F2F2', borderRadius: '9999px' }}></div>
            {/* 파란 사각형 대신 ProfileEditLogo 이미지 삽입 */}
            <img
              src={ProfileEditLogo}
              alt="My Profile"
              style={{
                position: 'absolute', // 부모 기준 배치
                width: '150px', // Figma 크기 유지 또는 조절
                height: '150px',
                left: '50%', // 중앙 정렬
                top: '50%',
                transform: 'translate(-50%, -50%)', // 중앙 정렬
                objectFit: 'contain' // 이미지 비율 유지
              }}
            />
            {/* 'profile' 텍스트는 로고에 포함되어 있으므로 삭제 */}
          </div>

          {/* [추가] 5. 친구 노드 (원형 이미지) 9개 그리기 */}
          {friendList.slice(0, 9).map((friend, index) => {
            const layout = friendNodeLayout[index];
            if (!layout) return null;
            return (
              <img
                key={`friend-${friend.id}`}
                src={friend.profilePic}
                alt={friend.name}
                title={friend.name}
                onClick={() => handleViewFriendProfile(friend)}
                style={{
                  ...layout.style, // 계산된 left, top, width, height
                  position: 'absolute',
                  borderRadius: '9999px', // 원형
                  objectFit: 'cover',   // 이미지 꽉 채우기
                  cursor: 'pointer',
                  zIndex: 10,           // 선보다 위에
                  border: '2px solid white' // 테두리 (선택 사항)
                }}
              />
            );
          })}

        </div>
      ) : (
        // --- 그 외 화면 (로그인 안됨, 채팅, 프로필 등) ---
        // --- 원본 코드 그대로 유지 ---
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
            <button onClick={handleOpenChatSelection} style={{ padding: '8px 15px', background: currentScreen === 'chat' ? '#e0e0e0' : 'none', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>채팅</button>
            <button onClick={() => setCurrentScreen('profile')} style={{ padding: '8px 15px', background: currentScreen === 'profile' || currentScreen === 'editProfile' ? '#e0e0e0' : 'none', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>프로필</button>
          </div>
        </>
      )}

      {/* --- 모달 창 (원본 코드 그대로) --- */}
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