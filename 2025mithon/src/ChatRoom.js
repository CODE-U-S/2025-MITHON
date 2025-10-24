import React, { useState, useRef, useEffect } from 'react';

const ChatRoom = ({ chatTarget, messages, updateChatHistory, friendIntimacy }) => {
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        const text = messageInput.trim();
        if (text === '') return;

        const now = new Date();
        const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });

        const userMessage = { type: 'sent', content: text, time: time };
        const newMessages = [...messages, userMessage];
        updateChatHistory(newMessages);

        setMessageInput('');

        setTimeout(() => {
            const replyTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
            const autoReply = { type: 'received', content: `안녕하세요, ${chatTarget}입니다.`, time: replyTime };
            updateChatHistory([...newMessages, autoReply]);
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #ccc', width: '100%', maxWidth: '400px' }}>
            <div style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
                <h3>{chatTarget ? `${chatTarget}님과의 채팅` : '채팅방'}</h3>
                <p>친밀도: {friendIntimacy}</p>
            </div>

            <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '10px', textAlign: msg.type === 'sent' ? 'right' : 'left' }}>
                        <div style={{ display: 'inline-block', padding: '8px 12px', borderRadius: '10px', background: msg.type === 'sent' ? '#dcf8c6' : '#f0f0f0' }}>
                            {msg.content}
                            <div style={{ fontSize: '10px', color: '#888', marginTop: '5px' }}>{msg.time}</div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex' }}>
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요..."
                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                />
                <button onClick={sendMessage} style={{ marginLeft: '10px', padding: '8px 15px', border: 'none', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;