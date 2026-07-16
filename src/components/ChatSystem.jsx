import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, CheckCircle, ChevronLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API_URL from '../config';
import { useToast } from '../context/ToastContext';

const ChatSystem = ({ compact = false, initialChatPartnerId = null }) => {
    const { user, token } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const chatWithId = queryParams.get('chatWith') || initialChatPartnerId;

    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showChatMobile, setShowChatMobile] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Fetch Conversations List
    useEffect(() => {
        const fetchConversations = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${API_URL}/chat/conversations.php`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setConversations(data.conversations);

                    // If we need to start a chat with someone specific
                    if (chatWithId) {
                        const existingConv = data.conversations.find(c => c.id == chatWithId);
                        if (existingConv) {
                            setActiveChat(existingConv);
                        } else {
                            // If conversation doesn't exist yet, we might need to fetch user details to show a "New Chat" header
                            // For now, we'll try to fetch their details
                            fetchPartnerDetails(chatWithId);
                        }
                    } else if (data.conversations.length > 0 && !activeChat) {
                        setActiveChat(data.conversations[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
        // Poll for new conversations every 10 seconds? Or rely on manual refresh/socket in future
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, [user, token, chatWithId]);

    const fetchPartnerDetails = async (partnerId) => {
        try {
            // Re-using vendor details endpoint if they are a vendor, or user details if client
            // Ideally we need a generic user details endpoint. For now assuming vendor.
            const response = await fetch(`${API_URL}/vendors/details.php?id=${partnerId}`);
            const data = await response.json();
            if (data.status === 'success' && data.vendor) {
                const newChat = {
                    id: data.vendor.user_id || partnerId, // Ensure we use user_id not vendor_id table id if different
                    name: data.vendor.business_name || data.vendor.name,
                    image: data.vendor.image ? (data.vendor.image && data.vendor.image.startsWith('http') ? data.vendor.image : `${API_URL.replace('/api', '')}/${data.vendor.image}`) : "https://via.placeholder.com/150",
                    isNew: true
                };
                setActiveChat(newChat);
                setConversations(prev => [newChat, ...prev]);
            }
        } catch (e) {
            console.error("Could not fetch new chat partner details", e);
        }
    };

    // Fetch Messages for Active Chat
    useEffect(() => {
        let interval;
        const fetchMessages = async () => {
            if (!activeChat || !user) return;
            try {
                // If it's a "new" chat that hasn't started, don't fetch messages
                if (activeChat.isNew) {
                    setMessages([]);
                    return;
                }

                const response = await fetch(`${API_URL}/chat/messages.php?partner_id=${activeChat.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setMessages(data.messages);

                    // Mark as read silently whenever we fetch messages for the open conversation
                    fetch(`${API_URL}/chat/mark_read.php`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ partner_id: activeChat.id })
                    }).catch(() => { });

                    // Clear badge locally for this conversation
                    setConversations(prev =>
                        prev.map(c => c.id === activeChat.id ? { ...c, unread_count: 0 } : c)
                    );
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
        if (activeChat && !activeChat.isNew) {
            scrollToBottom();
            interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        }
        return () => clearInterval(interval);
    }, [activeChat, user, token]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSelectChat = async (conv) => {
        setActiveChat(conv);
        setShowChatMobile(true);

        // Immediately clear the unread badge in the conversations list (optimistic update)
        if (conv.unread_count > 0) {
            setConversations(prev =>
                prev.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c)
            );

            // Tell the backend to mark all messages from this partner as read
            try {
                await fetch(`${API_URL}/chat/mark_read.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ partner_id: conv.id })
                });
            } catch (err) {
                console.error("Could not mark messages as read:", err);
            }
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        if (user.id == activeChat.id) {
            showToast("You cannot message yourself.", 'warning');
            return;
        }

        const tempMsg = {
            id: 'temp-' + Date.now(),
            sender_id: user.id,
            receiver_id: activeChat.id,
            message: newMessage,
            created_at: new Date().toISOString(),
            isTemp: true
        };

        // Optimistic update
        setMessages(prev => [...prev, tempMsg]);
        setNewMessage("");

        try {
            const response = await fetch(`${API_URL}/chat/send.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiver_id: activeChat.id,
                    message: tempMsg.message
                })
            });
            const data = await response.json();

            if (data.status === 'success') {
                // Replace temp message with real one or just let the poller fetch it
                // For now, let's just update the list to ensure ID is correct
                setMessages(prev => prev.map(m => m.id === tempMsg.id ? data.data : m));

                // If this was a new conversation, mark it as established
                if (activeChat.isNew) {
                    const updatedChat = { ...activeChat, isNew: false, lastMessage: tempMsg.message, time: 'Just now' };
                    setActiveChat(updatedChat);
                    setConversations(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
                }
            } else {
                showToast("Failed to send message", 'error');
            }
        } catch (error) {
            console.error("Send error:", error);
            showToast("Connection error", 'error');
        }
    };

    return (
        <div className={`chat-system-container ${compact ? 'compact' : ''}`}>
            <div className={`chat-sidebar ${showChatMobile ? 'hidden-mobile' : ''}`}>
                {/* Sidebar Header */}
                <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '0',
                        padding: '0.6rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: '1px solid #e2e8f0'
                    }}>
                        <Search size={16} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No conversations yet.</p>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => handleSelectChat(conv)}
                                style={{
                                    padding: '1rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    cursor: 'pointer',
                                    background: activeChat?.id === conv.id ? 'white' : 'transparent',
                                    borderLeft: activeChat?.id === conv.id ? '4px solid var(--primary)' : '4px solid transparent',
                                    borderBottom: '1px solid #f1f5f9',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <img
                                    src={conv.image ? (conv.image && conv.image.startsWith('http') ? conv.image : `${API_URL.replace('/api', '')}/${conv.image}`) : "https://via.placeholder.com/150"}
                                    alt={conv.name}
                                    style={{ width: '44px', height: '44px', borderRadius: '0', objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h4 style={{ fontSize: '0.9rem', margin: 0, fontWeight: '600', color: '#1e293b' }}>{conv.name || `User ${conv.id}`}</h4>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                            {conv.created_at ? new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: '0.8rem',
                                        color: '#64748b',
                                        margin: 0,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {conv.sender_id === user.id ? `You: ${conv.message}` : conv.message || "Start a conversation"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`chat-main ${!showChatMobile ? 'hidden-mobile' : ''}`}>
                {activeChat ? (
                    <>
                        <div style={{ padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button className="mobile-back-btn" onClick={() => setShowChatMobile(false)}>
                                    <ChevronLeft size={24} />
                                </button>
                                <img src={activeChat.image ? (activeChat.image.startsWith('http') ? activeChat.image : (activeChat.image && activeChat.image.startsWith('http') ? activeChat.image : `${API_URL.replace('/api', '')}/${activeChat.image}`)) : "https://via.placeholder.com/150"} style={{ width: '40px', height: '40px', borderRadius: '0', objectFit: 'cover' }} />
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>{activeChat.name || `User ${activeChat.id}`}</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Active Now</span>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={chatContainerRef}
                            style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}
                        >
                            {messages.map((msg, index) => {
                                const isSender = msg.sender_id === user.id;
                                return (
                                    <div key={msg.id || index} style={{
                                        alignSelf: isSender ? 'flex-end' : 'flex-start',
                                        maxWidth: '70%',
                                    }}>
                                        <div style={{
                                            background: isSender ? 'var(--primary)' : 'white',
                                            color: isSender ? 'white' : '#1e293b',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '0',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            fontSize: '0.9rem',
                                        }}>
                                            {msg.message}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', textAlign: isSender ? 'right' : 'left' }}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div style={{ padding: '1.25rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
                            <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Write your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{
                                        flex: 1,
                                        background: '#f1f5f9',
                                        border: 'none',
                                        borderRadius: '0',
                                        padding: '0.75rem 1.25rem',
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    style={{
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        opacity: !newMessage.trim() ? 0.6 : 1
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
            <style>{`
                .chat-system-container {
                    display: flex;
                    height: calc(100vh - 12rem);
                    background: white;
                    border-radius: 0;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }
                .chat-system-container.compact {
                    height: 600px;
                }
                .chat-sidebar {
                    width: 320px;
                    border-right: 1px solid #e2e8f0;
                    display: flex;
                    flex-direction: column;
                    background: #f8fafc;
                }
                .chat-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .mobile-back-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    padding-right: 0.5rem;
                }
                @media (max-width: 768px) {
                    .chat-system-container {
                        height: calc(100vh - 10rem) !important;
                        border-radius: 0;
                        border: none;
                    }
                    .chat-sidebar {
                        width: 100%;
                        border-right: none;
                    }
                    .chat-main {
                        width: 100%;
                    }
                    .hidden-mobile {
                        display: none !important;
                    }
                    .mobile-back-btn {
                        display: block;
                    }
                }
            `}</style>
        </div>
    );
};

export default ChatSystem;
