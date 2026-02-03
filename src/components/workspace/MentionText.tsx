import { Fragment } from 'react';

interface MentionTextProps {
  text: string;
  currentUserId: string;
  className?: string;
  isOwnMessage?: boolean;
}

export function MentionText({ text, currentUserId, className = '', isOwnMessage = false }: MentionTextProps) {
  // Parse mentions: @[Display Name](userId)
  const mentionRegex = /@\[([^\]]+)\]\(([a-f0-9]{24})\)/g;
  const parts: Array<{ type: 'text' | 'mention'; content: string; userId?: string; name?: string }> = [];

  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }

    // Add mention
    parts.push({
      type: 'mention',
      content: `@${match[1]}`,
      name: match[1],
      userId: match[2]
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }

  // If no mentions found, return plain text
  if (parts.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part.type === 'text' ? (
            part.content
          ) : (
            <span
              className={`font-semibold ${
                isOwnMessage
                  ? part.userId === currentUserId
                    ? 'text-white bg-white/20 px-1 rounded'
                    : 'text-white underline'
                  : part.userId === currentUserId
                  ? 'text-blue-600 bg-blue-100 px-1 rounded'
                  : 'text-blue-600'
              }`}
              title={part.name}
            >
              {part.content}
            </span>
          )}
        </Fragment>
      ))}
    </span>
  );
}
