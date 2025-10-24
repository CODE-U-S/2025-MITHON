import React from 'react';

const FriendListModal = ({ friendList, onSelectChatTarget, onViewFriendProfile, onClose }) => {
    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '90%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>친구 목록</h2>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '5px' }}>
                {friendList.length > 0 ? (
                    friendList.map(friend => (
                        <li key={friend.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                            <span style={{ flex: 1, cursor: 'pointer' }} onClick={() => onViewFriendProfile(friend)}>
                                {friend.name} ({friend.status})
                            </span>
                            <button onClick={() => onSelectChatTarget(friend.name)} style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                채팅
                            </button>
                        </li>
                    ))
                ) : (
                    <li style={{ padding: '10px', textAlign: 'center', color: '#888' }}>친구가 없습니다.</li>
                )}
            </ul>
            <button onClick={onClose} style={{ marginTop: '15px', padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                닫기
            </button>
        </div>
    );
};

export default FriendListModal;
