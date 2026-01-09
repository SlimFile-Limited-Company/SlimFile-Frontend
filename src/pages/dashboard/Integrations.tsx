import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plug,
  Cloud,
  Webhook,
  Key,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

const fetchIntegrations = async () => {
  const token = localStorage.getItem('jwt');
  const res = await fetch(`${API_BASE_URL}/dashboard/integrations`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch integrations');
  return res.json();
};

export default function DashboardIntegrations() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['dashboard-integrations'],
    queryFn: fetchIntegrations,
  });

  const cloudIntegrations = [
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Compress files directly from Google Drive',
      icon: <Cloud className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      available: true
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Import and compress files from Dropbox',
      icon: <Cloud className="w-8 h-8 text-blue-700" />,
      color: 'bg-blue-50 border-blue-300',
      available: true
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      description: 'Connect your Microsoft OneDrive account',
      icon: <Cloud className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-50 border-blue-100',
      available: true
    }
  ];

  const handleConnect = (integrationId: string) => {
    // This will be implemented with actual OAuth flows
    toast({
      title: 'Coming Soon!',
      description: `${integrationId} integration will be available soon.`
    });
  };

  const handleDisconnect = (integrationId: string) => {
    toast({
      title: 'Disconnected',
      description: `${integrationId} has been disconnected.`
    });
  };

  const isConnected = (id: string) => {
    return integrations?.connected?.includes(id) || false;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600 mt-1">
          Connect SlimFile with your favorite cloud storage and automation tools.
        </p>
      </div>

      {/* Cloud Storage Integrations */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cloud Storage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cloudIntegrations.map((integration) => (
            <Card key={integration.id} className={`border-2 ${integration.color}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    {integration.icon}
                  </div>
                  {isConnected(integration.id) ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Connected</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{integration.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                {isConnected(integration.id) ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDisconnect(integration.id)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                    onClick={() => handleConnect(integration.id)}
                  >
                    Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Get notified via webhook when files are compressed. Perfect for automating workflows.
          </p>
          <div className="space-y-3">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://your-app.com/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (webhookUrl) {
                      toast({ title: 'Webhook saved!' });
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
            {integrations?.webhooks?.map((webhook: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <Webhook className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-mono">{webhook.url}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Active
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Integrate SlimFile compression into your applications using our REST API.
          </p>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border">
            <div>
              <h4 className="font-semibold text-gray-900">API Documentation</h4>
              <p className="text-sm text-gray-600">
                Visit api.slim-file.com for complete API documentation
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open('https://api.slim-file.com', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Docs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* OAuth Apps */}
      <Card>
        <CardHeader>
          <CardTitle>OAuth Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Plug className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No OAuth applications configured</p>
            <Button variant="outline">Create OAuth App</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
