import { CollaborationUser } from '@/contexts/CollaborationContext';
import { MousePointer2 } from 'lucide-react';

interface LiveCursorProps {
  user: CollaborationUser;
  currentPage: number;
}

export default function LiveCursor({ user, currentPage }: LiveCursorProps) {
  // Only show cursor if user is on the same page
  if (!user.cursor || user.cursor.page !== currentPage) {
    return null;
  }

  return (
    <div
      className="absolute pointer-events-none z-50 transition-all duration-100"
      style={{
        left: `${user.cursor.x}px`,
        top: `${user.cursor.y}px`,
        transform: 'translate(-2px, -2px)',
      }}
    >
      {/* Cursor Icon */}
      <MousePointer2
        className="w-5 h-5 drop-shadow-lg"
        style={{ color: user.color }}
        fill={user.color}
      />

      {/* User Name Label */}
      <div
        className="absolute top-6 left-0 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-lg"
        style={{ backgroundColor: user.color }}
      >
        {user.name}
      </div>
    </div>
  );
}
