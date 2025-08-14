import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  Send, 
  Search, 
  User,
  Building2,
  Clock
} from 'lucide-react';
import { Message, User as UserType } from '../types';
import { mockMessages, mockUsers, mockProperties } from '../data/mockData';

export function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = () => {
    // Filter messages for current user
    const userMessages = mockMessages.filter(
      m => m.sender_id === user?.id || m.receiver_id === user?.id
    );
    
    setMessages(userMessages);
    
    // Group messages by conversation
    const conversationMap = new Map();
    
    userMessages.forEach(message => {
      const otherUserId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
      const otherUser = mockUsers.find(u => u.id === otherUserId);
      const property = message.property_id ? mockProperties.find(p => p.id === message.property_id) : null;
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          user: otherUser,
          property,
          messages: [],
          lastMessage: null,
          unreadCount: 0,
        });
      }
      
      const conversation = conversationMap.get(otherUserId);
      conversation.messages.push(message);
      
      // Update last message
      if (!conversation.lastMessage || new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
        conversation.lastMessage = message;
      }
      
      // Count unread messages
      if (!message.is_read && message.receiver_id === user?.id) {
        conversation.unreadCount++;
      }
    });
    
    // Convert to array and sort by last message time
    const conversationList = Array.from(conversationMap.values()).sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime();
    });
    
    setConversations(conversationList);
    
    // Select first conversation if none selected
    if (conversationList.length > 0 && !selectedConversation) {
      setSelectedConversation(conversationList[0].userId);
    }
    
    setLoading(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender_id: user!.id,
      receiver_id: selectedConversation,
      content: newMessage,
      is_read: false,
      created_at: new Date().toISOString(),
      sender: user!,
      receiver: mockUsers.find(u => u.id === selectedConversation),
    };
    
    // Add to messages
    setMessages(prev => [...prev, newMsg]);
    
    // Update conversations
    setConversations(prev => prev.map(conv => {
      if (conv.userId === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: newMsg,
        };
      }
      return conv;
    }));
    
    setNewMessage('');
  };

  const getSelectedConversation = () => {
    return conversations.find(conv => conv.userId === selectedConversation);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length > 0 ? (
                conversations
                  .filter(conv => 
                    !searchTerm || 
                    conv.user?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    conv.property?.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((conversation) => (
                    <div
                      key={conversation.userId}
                      onClick={() => setSelectedConversation(conversation.userId)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conversation.userId ? 'bg-emerald-50 border-emerald-200' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
                          <User className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900 truncate">
                              {conversation.user?.full_name}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-emerald-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          {conversation.property && (
                            <div className="flex items-center space-x-1 mb-1">
                              <Building2 className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-500 truncate">
                                {conversation.property.title}
                              </p>
                            </div>
                          )}
                          {conversation.lastMessage && (
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage.content}
                              </p>
                              <span className="text-xs text-gray-400 ml-2">
                                {formatTime(conversation.lastMessage.created_at)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No conversations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getSelectedConversation()?.user?.full_name}
                      </p>
                      {getSelectedConversation()?.property && (
                        <p className="text-sm text-gray-600">
                          About: {getSelectedConversation()?.property?.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {getSelectedConversation()?.messages.map((message: Message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <Clock className="h-3 w-3 opacity-70" />
                          <span className="text-xs opacity-70">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}