import { useEffect, useState } from 'react';
import { useNavigate, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { isAuthenticated } from "@/lib/auth";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

declare global {
  interface Window {
    google: any;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [loaded, setLoaded] = useState(false); // For logo animation
  const inviteToken = searchParams.get('invite');
  const chatToken  = searchParams.get('chat_token');

  // Store tokens for after login
  useEffect(() => {
    if (inviteToken) {
      sessionStorage.setItem('redirectAfterLogin', `/workspaces/invitations?token=${inviteToken}`);
    }
    if (chatToken) {
      sessionStorage.setItem('pendingChatToken', chatToken);
    }
  }, [inviteToken, chatToken]);

  // Redirect if already authenticated
  if (isAuthenticated()) {
    if (inviteToken) {
      return <Navigate to={`/workspaces/invitations?token=${inviteToken}`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    // Simulate logo load animation
    setTimeout(() => setLoaded(true), 300);

    // Initialize Google Sign-In
    function initializeGoogle() {
      if (window.google && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular' }
        );
      }
    }
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }
    // eslint-disable-next-line
  }, []);

  async function handleCredentialResponse(response) {
    const credential = response.credential;
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('jwt', data.token);
      console.log('JWT set:', localStorage.getItem('jwt'));

      // Silently set up push notifications in background
      // Browser will show native permission dialog if needed
      setTimeout(() => {
        import('@/services/pushNotificationService')
          .then(({ requestNotificationPermission }) => {
            requestNotificationPermission();
          })
          .catch(() => {
            // Silent fail - notifications are optional
          });
      }, 2000); // Wait 2 seconds after login

      // If a pending chat invite token exists, accept it first then go to messages
      const pendingChatToken = sessionStorage.getItem('pendingChatToken');
      if (pendingChatToken) {
        sessionStorage.removeItem('pendingChatToken');
        try {
          const acceptRes = await fetch(`${API_BASE_URL}/dm/request/accept-after-signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.token}` },
            body: JSON.stringify({ token: pendingChatToken }),
          });
          const acceptData = await acceptRes.json();
          if (acceptData.conversationId) {
            window.location.href = `/messages?c=${acceptData.conversationId}`;
            return;
          }
        } catch {}
        window.location.href = '/messages';
        return;
      }

      // Check if there's a redirect path stored (invite tokens etc.)
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
      // ProtectedRoute stores the original URL in location.state.from
      const fromState = (location.state as any)?.from;
      const fromPath = fromState ? (fromState.pathname + (fromState.search || '')) : null;
      const redirectTo = redirectPath || fromPath || '/';

      setTimeout(() => {
        window.location.href = redirectTo;
      }, 100);
    } else {
      alert('Google login failed');
    }
  }

  return (
    <div
      className="login-background"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6', // Fallback gray background
        backgroundImage: 'url("/lovable-uploads/login_image.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* CSS for button hover effect */}
      <style>
        {`
          #google-signin-btn:hover {
            transform: scale(1.05);
            transition: transform 0.2s ease-in-out;
          }
          .login-background {
            background: transparent;
            background-image: url('/lovable-uploads/login_image.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
        `}
      </style>

      {/* Login card with glassmorphism */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          padding: 40,
          maxWidth: 400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src="/lovable-uploads/logo.png"
          alt="SlimFile Logo"
          style={{
            width: 100,
            height: 100,
            marginBottom: 24,
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: loaded ? 'scale(1)' : 'scale(0.8)',
            opacity: loaded ? 1 : 0,
            transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
          }}
        />
        <h2
          style={{
            color: '#1f2937',
            fontWeight: 700,
            fontSize: 30,
            marginBottom: 12,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          Sign in to SlimFile
        </h2>
        <p
          style={{
            color: '#333',
            fontSize: 16,
            marginBottom: 28,
            textAlign: 'center',
            lineHeight: 1.6,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          Compress, convert, and collaborate — everything in one place.
        </p>
        <div
          id="google-signin-btn"
          style={{
            marginTop: 12,
            marginBottom: 12,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            transition: 'transform 0.2s ease-in-out',
          }}
        ></div>
        <div
          style={{
            marginTop: 20,
            color: '#444',
            fontSize: 14,
            textAlign: 'center',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          Please wait a moment after Google authentication to be redirected.
        </div>
      </div>
    </div>
  );
}
