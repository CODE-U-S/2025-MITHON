import React from 'react';

const FriendProfileDisplay = ({ friend, onClose, addFriend, removeFriend }) => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>{friend.name}의 프로필</h2>
            <p><strong>이름:</strong> {friend.name}</p>
            <p><strong>친밀도:</strong> {friend.intimacy}</p>
            <p><strong>상태:</strong> {friend.status}</p>
            {friend.isFriend ? (
                <button onClick={() => removeFriend(friend.id)} style={{ marginTop: '20px', padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    친구 삭제
                </button>
            ) : (
                <button onClick={() => addFriend(friend.id)} style={{ marginTop: '20px', padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    친구 추가
                </button>
            )}
            <button onClick={onClose} style={{ marginTop: '20px', marginLeft: '10px', padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                닫기
            </button>
        </div>
    );
};

export default FriendProfileDisplay;
