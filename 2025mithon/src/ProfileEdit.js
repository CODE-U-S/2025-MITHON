import React, { useState, useEffect } from 'react';

const ProfileEdit = ({ profile, onSaveProfile, onCancelEdit }) => {
    const [name, setName] = useState(profile.name || '');

    const handleSave = () => {
        onSaveProfile({ name });
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>프로필 편집</h2>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>이름:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '80%' }}
                />
            </div>
            <button onClick={handleSave} style={{ marginRight: '10px', padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                저장
            </button>
            <button onClick={onCancelEdit} style={{ padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                취소
            </button>
        </div>
    );
};

export default ProfileEdit;