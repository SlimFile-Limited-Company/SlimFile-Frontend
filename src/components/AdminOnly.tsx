import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

/** Headers for admin-only API calls: the signed-in user's token. */
export const adminHeaders = (extra: Record<string, string> = {}) => ({
  Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
  ...extra,
});

/**
 * Shown by an Internal page when the server says the visitor isn't a
 * signed-in admin. Access comes from the admin email list on the server.
 */
export default function AdminOnly({ title }: { title: string }) {
  const signedIn = !!localStorage.getItem('jwt');
  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-12 flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-10 w-full max-w-md text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <span className="mx-auto mb-6 w-14 h-14 rounded-full bg-[#f5f5f7] flex items-center justify-center">
          <Lock className="w-6 h-6 text-red-600" />
        </span>
        <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">{title}</h1>
        <p className="mt-3 text-[15px] text-[#6e6e73]">
          {signedIn
            ? 'This page is for SlimFile admins. Your account is not on the admin list.'
            : 'Sign in with an admin account to open this page.'}
        </p>
        {!signedIn && (
          <Link to="/login" className="mt-8 inline-flex h-11 px-7 rounded-full bg-red-600 hover:bg-red-700 text-white text-[15px] font-medium items-center">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
