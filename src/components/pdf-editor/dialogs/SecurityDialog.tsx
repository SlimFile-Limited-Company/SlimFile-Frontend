import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, X, Eye, EyeOff } from 'lucide-react';

interface SecurityDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type EncryptionLevel = '128-AES' | '256-AES';

interface Permission {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function SecurityDialog({ isOpen, onClose }: SecurityDialogProps) {
  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [encryptionLevel, setEncryptionLevel] = useState<EncryptionLevel>('256-AES');
  const [isProcessing, setIsProcessing] = useState(false);

  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'print',
      label: 'Allow Printing',
      description: 'Users can print the document',
      enabled: true,
    },
    {
      id: 'modify',
      label: 'Allow Modifications',
      description: 'Users can edit the document',
      enabled: false,
    },
    {
      id: 'copy',
      label: 'Allow Copying',
      description: 'Users can copy text and images',
      enabled: true,
    },
    {
      id: 'annotate',
      label: 'Allow Annotations',
      description: 'Users can add comments and annotations',
      enabled: true,
    },
    {
      id: 'fillForms',
      label: 'Allow Form Filling',
      description: 'Users can fill in form fields',
      enabled: true,
    },
    {
      id: 'extract',
      label: 'Allow Content Extraction',
      description: 'Users can extract pages and content',
      enabled: false,
    },
  ]);

  if (!isOpen) return null;

  const togglePermission = (id: string) => {
    setPermissions(permissions.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const handleApplySecurity = async () => {
    if (!userPassword && !ownerPassword) {
      alert('Please set at least one password');
      return;
    }

    if (userPassword && userPassword.length < 6) {
      alert('User password must be at least 6 characters');
      return;
    }

    if (ownerPassword && ownerPassword.length < 6) {
      alert('Owner password must be at least 6 characters');
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement actual encryption API call
      const enabledPermissions = permissions
        .filter(p => p.enabled)
        .map(p => p.id);

      console.log('Applying security:', {
        userPassword: userPassword ? '***' : '',
        ownerPassword: ownerPassword ? '***' : '',
        encryptionLevel,
        permissions: enabledPermissions,
      });

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Security settings applied successfully!');
      onClose();
    } catch (error) {
      console.error('Error applying security:', error);
      alert('Failed to apply security settings. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveSecurity = async () => {
    if (!confirm('Remove all security settings from this PDF?')) {
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement actual remove security API call
      console.log('Removing security');

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert('Security settings removed successfully!');
      onClose();
    } catch (error) {
      console.error('Error removing security:', error);
      alert('Failed to remove security. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">PDF Security</h3>
              <p className="text-sm text-gray-600">Add password protection and permissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passwords */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Password (Required to Open)
            </label>
            <div className="relative">
              <input
                type={showUserPassword ? 'text' : 'password'}
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Enter password to open PDF"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowUserPassword(!showUserPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showUserPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Users must enter this password to view the PDF</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Password (Required to Modify Permissions)
            </label>
            <div className="relative">
              <input
                type={showOwnerPassword ? 'text' : 'password'}
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                placeholder="Enter owner password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOwnerPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Required to change security settings or permissions</p>
          </div>
        </div>

        {/* Encryption Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Encryption Level
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setEncryptionLevel('128-AES')}
              className={`p-4 border-2 rounded-lg transition-all ${
                encryptionLevel === '128-AES'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">128-bit AES</div>
              <div className="text-xs text-gray-600">Standard encryption</div>
            </button>

            <button
              onClick={() => setEncryptionLevel('256-AES')}
              className={`p-4 border-2 rounded-lg transition-all ${
                encryptionLevel === '256-AES'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-sm">256-bit AES</div>
              <div className="text-xs text-gray-600">High security (Recommended)</div>
            </button>
          </div>
        </div>

        {/* Permissions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Document Permissions
          </label>
          <div className="space-y-2">
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  permission.enabled
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
                onClick={() => togglePermission(permission.id)}
              >
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={permission.enabled}
                    onChange={() => togglePermission(permission.id)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{permission.label}</div>
                  <div className="text-xs text-gray-600">{permission.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-900">
            <strong>Important:</strong> Keep your passwords safe! If you forget the owner password,
            you won't be able to change security settings later.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRemoveSecurity}
            variant="outline"
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isProcessing}
          >
            Remove Security
          </Button>
          <Button
            onClick={handleApplySecurity}
            className="flex-1 bg-red-600 hover:bg-red-700"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Applying...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Apply Security
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
