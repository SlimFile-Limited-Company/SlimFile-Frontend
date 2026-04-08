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
              className={`font-semibold px-1 py-0.5 rounded text-xs ${
                isOwnMessage
                  ? part.userId === currentUserId
                    ? 'text-white bg-white/25'
                    : 'text-sky-200 bg-white/15'
                  : part.userId === currentUserId
                  ? 'text-[#5288c1] bg-[#5288c1]/20'
                  : 'text-sky-400 bg-sky-500/15'
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
