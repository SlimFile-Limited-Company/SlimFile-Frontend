import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Gift,
  Users,
  Copy,
  Share2,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

const fetchReferrals = async () => {
  const token = localStorage.getItem('jwt');
  const res = await fetch(`${API_BASE_URL}/dashboard/referrals`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch referrals');
  return res.json();
};

export default function DashboardReferrals() {
  const [copied, setCopied] = useState(false);

  const { data: referrals, isLoading } = useQuery({
    queryKey: ['dashboard-referrals'],
    queryFn: fetchReferrals,
  });

  const referralCode = referrals?.referralCode || 'LOADING...';
  const referralLink = `https://www.slim-file.com?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = () => {
    const text = `Check out SlimFile - the best file compression tool! Join using my referral link: ${referralLink}`;
    if (navigator.share) {
      navigator.share({ title: 'Join SlimFile', text, url: referralLink });
    } else {
      copyToClipboard();
    }
  };

  const totalReferrals = referrals?.totalReferrals || 0;
  const activeReferrals = referrals?.activeReferrals || 0;
  const totalRewards = referrals?.totalRewards || 0;
  const pendingRewards = referrals?.pendingRewards || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-600 mt-1">
          Invite friends and earn rewards for every successful referral!
        </p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Referrals
            </CardTitle>
            <Users className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalReferrals}</div>
            <p className="text-sm text-gray-600 mt-1">Friends invited</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Users
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{activeReferrals}</div>
            <p className="text-sm text-gray-600 mt-1">Using SlimFile</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Earned
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">${totalRewards}</div>
            <p className="text-sm text-gray-600 mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">${pendingRewards}</div>
            <p className="text-sm text-gray-600 mt-1">Awaiting payout</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-red-600" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Share this link with friends. When they sign up and compress their first file, you
            both get rewards!
          </p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={referralLink}
              className="font-mono text-sm bg-white"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-red-600 hover:bg-red-700 flex-shrink-0"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button
              onClick={shareReferral}
              variant="outline"
              className="flex-shrink-0"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Share Your Link</h3>
              <p className="text-sm text-gray-600">
                Send your unique referral link to friends via email, social media, or messaging
                apps
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Friends Sign Up</h3>
              <p className="text-sm text-gray-600">
                Your friends create an account and compress their first file using SlimFile
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Earn Rewards</h3>
              <p className="text-sm text-gray-600">
                You both receive rewards! Get bonus compression credits and exclusive features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Referral Tiers & Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                tier: 'Bronze',
                referrals: '1-5',
                reward: '$5 per referral',
                color: 'bg-orange-100 text-orange-700 border-orange-300'
              },
              {
                tier: 'Silver',
                referrals: '6-20',
                reward: '$7 per referral',
                color: 'bg-gray-100 text-gray-700 border-gray-300'
              },
              {
                tier: 'Gold',
                referrals: '21-50',
                reward: '$10 per referral',
                color: 'bg-yellow-100 text-yellow-700 border-yellow-300'
              },
              {
                tier: 'Platinum',
                referrals: '50+',
                reward: '$15 per referral',
                color: 'bg-purple-100 text-purple-700 border-purple-300'
              }
            ].map((tier) => (
              <div
                key={tier.tier}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${tier.color}`}
              >
                <div className="flex items-center gap-4">
                  <Award className="w-8 h-8" />
                  <div>
                    <h4 className="font-semibold">{tier.tier} Tier</h4>
                    <p className="text-sm opacity-80">{tier.referrals} referrals</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {tier.reward}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : !referrals?.recentReferrals || referrals.recentReferrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No referrals yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start sharing your referral link to earn rewards!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.recentReferrals.map((referral: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {referral.name || 'Anonymous User'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Joined {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      referral.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {referral.active ? 'Active' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
