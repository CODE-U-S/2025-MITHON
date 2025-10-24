import React from 'react';

const ProfileDisplay = ({ profile, onEditProfile }) => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>내 프로필</h2>
            <p><strong>이름:</strong> {profile.name}</p>
            <button onClick={onEditProfile} style={{ marginTop: '20px', padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                프로필 편집
            </button>
        </div>
    );
};

export default ProfileDisplay;