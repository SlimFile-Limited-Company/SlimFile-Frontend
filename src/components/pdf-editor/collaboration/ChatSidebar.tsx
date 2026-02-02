import { useState, useRef, useEffect } from 'react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X } from 'lucide-react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { chatMessages, sendChatMessage, currentUser } = useCollaboration();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendChatMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-300 shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center gap-2 text-white">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">Team Chat</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">No messages yet</p>
            <p className="text-gray-500 text-xs mt-1">Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((message) => {
            const isOwnMessage = message.userId === currentUser?.id;

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: message.userColor }}
                >
                  {message.userName.charAt(0).toUpperCase()}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${isOwnMessage ? 'text-right' : ''}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-sm font-medium text-gray-900 ${isOwnMessage ? 'order-2' : ''}`}>
                      {isOwnMessage ? 'You' : message.userName}
                    </span>
                    <span className={`text-xs text-gray-500 ${isOwnMessage ? 'order-1' : ''}`}>
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`inline-block px-3 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="bg-purple-600 hover:bg-purple-700 self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
