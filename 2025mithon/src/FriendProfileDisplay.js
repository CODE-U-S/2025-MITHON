import React from 'react';

const FriendProfileDisplay = ({ friend, onClose }) => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>{friend.name}의 프로필</h2>
            <p><strong>이름:</strong> {friend.name}</p>
            <p><strong>친밀도:</strong> {friend.intimacy}</p>
            <p><strong>상태:</strong> {friend.status}</p>
            <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                닫기
            </button>
        </div>
    );
};

export default FriendProfileDisplay;
