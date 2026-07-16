import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, CheckCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_CONVERSATIONS = [
    {
        id: 1,
        name: "DJ K-Wise",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
        lastMessage: "I've checked the date, I'm available!",
        time: "10:30 AM",
        unread: 1,
        online: true,
        category: "DJ"
    },
    {
        id: 2,
        name: "Pixel Perfect Photography",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
        lastMessage: "The photos are ready for review.",
        time: "Yesterday",
        unread: 0,
        online: false,
        category: "Photographer"
    },
    {
        id: 3,
        name: "Glam by Titi",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
        lastMessage: "Sure, we can do a trial session.",
        time: "Monday",
        unread: 0,
        online: true,
        category: "Makeup Artist"
    }
];

const MOCK_MESSAGES = [
    { id: 1, sender: "receiver", text: "Hello! I saw your inquiry about working together.", time: "10:25 AM" },
    { id: 2, sender: "sender", text: "Hi! Yes, we are planning a corporate event for December 15th.", time: "10:26 AM" },
    { id: 3, sender: "receiver", text: "That sounds great! I've checked the date, I'm available!", time: "10:30 AM" },
];

const Messages = () => {
    const [activeChat, setActiveChat] = useState(MOCK_CONVERSATIONS[0]);
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState("");
    const [showChat, setShowChat] = useState(false);
    const navigate = useNavigate();

    const handleSelectChat = (conv) => {
        setActiveChat(conv);
        setShowChat(true);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: messages.length + 1,
            sender: "sender",
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, msg]);
        setNewMessage("");

        setTimeout(() => {
            const reply = {
                id: messages.length + 2,
                sender: "receiver",
                text: "Thanks for the message! I'll get back to you shortly.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    return (
        <div style={{ paddingTop: '5.5rem', height: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
            <div className="messages-container">

                {/* Conversations Sidebar */}
                <div className={`conversations-sidebar ${showChat ? 'hidden-mobile' : ''}`}>
                    <div style={{ padding: '1rem', background: '#fafafa', borderBottom: '1px solid #eee' }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '0',
                            padding: '0.5rem 0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            border: '1px solid #ddd'
                        }}>
                            <Search size={16} color="#999" />
                            <input
                                type="text"
                                placeholder="Search messages"
                                style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {MOCK_CONVERSATIONS.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => handleSelectChat(conv)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    display: 'flex',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    background: activeChat.id === conv.id ? '#e8f5e9' : 'transparent',
                                    borderBottom: '1px solid #f5f5f5',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <img
                                    src={conv.image}
                                    alt={conv.name}
                                    style={{ width: '48px', height: '48px', borderRadius: '0', objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                        <h4 style={{ fontSize: '0.9rem', margin: 0, fontWeight: '600', color: '#333' }}>{conv.name}</h4>
                                        <span style={{ fontSize: '0.7rem', color: '#999' }}>{conv.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: '#666',
                                            margin: 0,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`chat-main-area ${!showChat ? 'hidden-mobile' : ''}`}>
                    {/* Chat Header */}
                    <div style={{ padding: '0.75rem 1rem', background: 'white', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowChat(false)}
                                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginRight: '0.5rem' }}
                                className="mobile-only"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <img
                                src={activeChat.image}
                                alt={activeChat.name}
                                style={{ width: '40px', height: '40px', borderRadius: '0', objectFit: 'cover' }}
                            />
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>{activeChat.name}</h4>
                                <span style={{ fontSize: '0.75rem', color: activeChat.online ? 'var(--primary)' : '#999' }}>
                                    {activeChat.online ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={{
                                background: 'var(--primary)',
                                border: 'none',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '0',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer'
                            }}>
                                <Phone size={16} fill="white" /> Call
                            </button>
                            <button className="jiji-icon-btn"><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Safety Alert (Enterra Style) */}
                    <div style={{ background: '#e3f2fd', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #bbdefb' }}>
                        <div style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>!</div>
                        <p style={{ fontSize: '0.85rem', color: '#0d47a1', margin: 0 }}>
                            <strong>Enterra Safety:</strong> Check the vendor's verified badge and previous reviews before reaching an agreement. We do not hold payments.
                        </p>
                    </div>

                    {/* Vendor Box (Small Card) */}
                    <div style={{ margin: '1rem 1rem 0', background: 'white', border: '1px solid #ddd', borderRadius: '0', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={activeChat.image} style={{ width: '50px', height: '50px', borderRadius: '0', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>Professional service by {activeChat.name}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary)' }}>Verified Vendor • Professional {activeChat.category}</p>
                        </div>
                        <button style={{ border: '1px solid var(--primary)', color: 'var(--primary)', background: 'none', padding: '4px 12px', borderRadius: '0', fontSize: '0.8rem', fontWeight: '700' }}>View Profile</button>
                    </div>

                    {/* Chat Messages */}
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{
                                alignSelf: msg.sender === 'sender' ? 'flex-end' : 'flex-start',
                                maxWidth: '75%',
                            }}>
                                <div style={{
                                    background: msg.sender === 'sender' ? '#e1f5fe' : 'white',
                                    color: '#333',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '0',
                                    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                                    fontSize: '0.9rem',
                                    border: '1px solid #eee'
                                }}>
                                    {msg.text}
                                    <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#999', marginTop: '2px' }}>{msg.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid #eee' }}>
                        <form
                            onSubmit={handleSendMessage}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <button type="button" className="jiji-icon-btn"><Paperclip size={20} /></button>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: '#f5f5f5',
                                        border: '1px solid #ddd',
                                        borderRadius: '0',
                                        padding: '0.75rem 1rem',
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    opacity: !newMessage.trim() ? 0.6 : 1
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Safety Sidebar (Jiji Style) */}
                <div className="safety-sidebar">
                    <div>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#333' }}>Safety Tips</h4>
                        <ul style={{ padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li style={{ fontSize: '0.8rem', color: '#666', display: 'flex', gap: '0.5rem' }}>
                                <div style={{ color: 'var(--primary)' }}>•</div> Verify vendor's identity badge
                            </li>
                            <li style={{ fontSize: '0.8rem', color: '#666', display: 'flex', gap: '0.5rem' }}>
                                <div style={{ color: 'var(--primary)' }}>•</div> Check recent client reviews
                            </li>
                            <li style={{ fontSize: '0.8rem', color: '#666', display: 'flex', gap: '0.5rem' }}>
                                <div style={{ color: 'var(--primary)' }}>•</div> Agreement is made directly
                            </li>
                            <li style={{ fontSize: '0.8rem', color: '#666', display: 'flex', gap: '0.5rem' }}>
                                <div style={{ color: 'var(--primary)' }}>•</div> No escrow or platform holds
                            </li>
                            <li style={{ fontSize: '0.8rem', color: '#666', display: 'flex', gap: '0.5rem' }}>
                                <div style={{ color: 'var(--primary)' }}>•</div> Report unprofessional behavior
                            </li>
                        </ul>
                    </div>
                    <button style={{ background: 'none', border: '1px solid #eee', color: '#ef5350', padding: '0.5rem', borderRadius: '0', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Report User</button>
                </div>

            </div>

            <style>{`
                .messages-container {
                    flex: 1;
                    display: flex;
                    gap: 1px;
                    padding: 0;
                    max-width: 1400px;
                    border: 1px solid #e2e8f0;
                    border-radius: 0;
                    overflow: hidden;
                    margin: 1.5rem auto;
                    background: white;
                    width: calc(100% - 3rem);
                }
                .conversations-sidebar {
                    width: 350px;
                    background: white;
                    border-right: 1px solid #eee;
                    display: flex;
                    flex-direction: column;
                }
                .chat-main-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: #f0f0f0;
                }
                .safety-sidebar {
                    width: 250px;
                    background: #fafafa;
                    border-left: 1px solid #eee;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .jiji-icon-btn {
                    background: none;
                    border: none;
                    color: #999;
                    width: 40px;
                    height: 40px;
                    border-radius: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .icon-btn-ghost:hover {
                    background: var(--surface-hover);
                    color: var(--primary);
                }
                .mobile-only {
                    display: none;
                }
                
                @media (max-width: 1024px) {
                    .safety-sidebar {
                        display: none;
                    }
                }
                
                @media (max-width: 768px) {
                    .messages-container {
                        margin: 0;
                        border: none;
                        border-radius: 0;
                        width: 100%;
                        height: calc(100vh - 5.5rem);
                    }
                    .conversations-sidebar {
                        width: 100%;
                        border-right: none;
                    }
                    .chat-main-area {
                        width: 100%;
                    }
                    .hidden-mobile {
                        display: none !important;
                    }
                    .mobile-only {
                        display: block;
                    }
                }
            `}</style>
        </div>
    );
};

export default Messages;
