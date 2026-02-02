import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, X, Copy, Check, Lock, Globe } from 'lucide-react';
import { useCollaboration } from '@/contexts/CollaborationContext';

interface CollaborationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollaborationDialog({ isOpen, onClose }: CollaborationDialogProps) {
  const { createSession, joinSession, session } = useCollaboration();
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [sessionName, setSessionName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdSessionId, setCreatedSessionId] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreateSession = async () => {
    if (!sessionName.trim()) {
      alert('Please enter a session name');
      return;
    }

    if (!isPublic && !password.trim()) {
      alert('Please set a password for private sessions');
      return;
    }

    setIsProcessing(true);
    try {
      const newSessionId = await createSession(
        sessionName,
        isPublic,
        !isPublic ? password : undefined
      );

      setCreatedSessionId(newSessionId);
      alert('Collaboration session created successfully!');
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJoinSession = async () => {
    if (!sessionId.trim()) {
      alert('Please enter a session ID');
      return;
    }

    setIsProcessing(true);
    try {
      await joinSession(sessionId, password || undefined);
      alert('Joined collaboration session successfully!');
      onClose();
    } catch (error) {
      console.error('Error joining session:', error);
      alert('Failed to join session. Please check the session ID and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopySessionId = () => {
    const url = `${window.location.origin}/pdf-editor?session=${createdSessionId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Real-Time Collaboration</h3>
              <p className="text-sm text-gray-600">Work together on PDFs in real-time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selection */}
        {!createdSessionId && (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('create')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  mode === 'create'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium text-sm">Create Session</div>
                <div className="text-xs text-gray-600">Start a new collaboration</div>
              </button>

              <button
                onClick={() => setMode('join')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  mode === 'join'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium text-sm">Join Session</div>
                <div className="text-xs text-gray-600">Join an existing session</div>
              </button>
            </div>
          </div>
        )}

        {/* Create Session Form */}
        {mode === 'create' && !createdSessionId && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="My PDF Collaboration"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Session Type
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all flex items-center gap-3 ${
                    isPublic
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-sm">Public</div>
                    <div className="text-xs text-gray-600">Anyone with the link can join</div>
                  </div>
                </button>

                <button
                  onClick={() => setIsPublic(false)}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all flex items-center gap-3 ${
                    !isPublic
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Lock className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-sm">Private</div>
                    <div className="text-xs text-gray-600">Requires password to join</div>
                  </div>
                </button>
              </div>
            </div>

            {!isPublic && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Join Session Form */}
        {mode === 'join' && !createdSessionId && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session ID or Link
              </label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="session-1234567890 or paste invite link"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password (if required)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}

        {/* Session Created - Share Link */}
        {createdSessionId && (
          <div className="mb-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
              <p className="text-sm text-green-900 font-medium mb-2">
                ✓ Session created successfully!
              </p>
              <p className="text-xs text-green-800">
                Share this link with your team to start collaborating.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invite Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/pdf-editor?session=${createdSessionId}`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <Button
                  onClick={handleCopySessionId}
                  variant="outline"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-900 mb-2">
            <strong>Real-time features:</strong>
          </p>
          <ul className="text-sm text-purple-900 space-y-1 ml-4">
            <li>• Live cursors showing other users</li>
            <li>• Instant annotation sync</li>
            <li>• Team chat and comments</li>
            <li>• Activity feed</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isProcessing}
          >
            {createdSessionId ? 'Done' : 'Cancel'}
          </Button>
          {!createdSessionId && (
            <Button
              onClick={mode === 'create' ? handleCreateSession : handleJoinSession}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === 'create' ? 'Creating...' : 'Joining...'}
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Create Session' : 'Join Session'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
