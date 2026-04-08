import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface WorkspaceMember {
  user: {
    _id: string;
    name: string;
    picture?: string;
  };
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  members: WorkspaceMember[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MentionInput({
  value,
  onChange,
  onKeyDown,
  members,
  placeholder,
  disabled,
  className
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter members based on query
  const filteredMembers = members.filter(m =>
    m.user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [mentionQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    onChange(newValue);

    // Check if user typed @ symbol
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtSymbol + 1);

      // Check if there's no space after @
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionQuery(textAfterAt);
        setMentionPosition(lastAtSymbol);
        setShowSuggestions(true);
        return;
      }
    }

    setShowSuggestions(false);
  };

  const insertMention = (member: WorkspaceMember) => {
    const beforeMention = value.substring(0, mentionPosition);
    const afterMention = value.substring(
      mentionPosition + mentionQuery.length + 1
    );

    // Format: @Display Name (clean, readable format)
    const mention = `@${member.user.name}`;
    const newValue = beforeMention + mention + ' ' + afterMention;

    onChange(newValue);
    setShowSuggestions(false);

    // Focus and move cursor after mention
    setTimeout(() => {
      textareaRef.current?.focus();
      const newCursorPos = beforeMention.length + mention.length + 1;
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && filteredMembers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredMembers.length - 1 ? prev + 1 : 0
        );
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredMembers.length - 1
        );
        return;
      }

      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredMembers[selectedIndex]);
        return;
      }

      if (e.key === 'Escape') {
        setShowSuggestions(false);
        return;
      }
    }

    onKeyDown?.(e);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative flex-1">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`min-h-0 max-h-[120px] resize-none w-full leading-normal ${className || ''}`}
      />

      {showSuggestions && filteredMembers.length > 0 && (
        <div
          className="absolute bottom-full left-0 mb-2 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden z-50"
          style={{ background: '#17212b', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="max-h-48 overflow-y-auto">
            {filteredMembers.map((member, index) => (
              <button
                key={member.user._id}
                onClick={() => insertMention(member)}
                className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left"
                style={{
                  background: index === selectedIndex ? 'rgba(82,136,193,0.15)' : 'transparent',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = index === selectedIndex ? 'rgba(82,136,193,0.15)' : 'transparent'; }}
              >
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={member.user.picture} />
                  <AvatarFallback className="text-[10px] bg-gradient-to-br from-[#5288c1] to-[#3a6d9e] text-white font-bold">
                    {getInitials(member.user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white/85">
                  {member.user.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
