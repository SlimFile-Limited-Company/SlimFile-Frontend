import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type Period = 'today' | '7d' | '30d' | '90d' | 'all';

export default function CEODashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('30d');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [searchConsoleConnected, setSearchConsoleConnected] = useState(false);

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [usersAnalytics, setUsersAnalytics] = useState<any>(null);
  const [compressionAnalytics, setCompressionAnalytics] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [engagement, setEngagement] = useState<any>(null);
  const [security, setSecurity] = useState<any>(null);
  const [mobileStats, setMobileStats] = useState<any>(null);
  const [searchConsoleData, setSearchConsoleData] = useState<any>(null);

  useEffect(() => {
    fetchData();
    checkSearchConsoleStatus();
  }, [period]);

  const checkSearchConsoleStatus = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const res = await fetch(`${API_BASE_URL}/search-console/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSearchConsoleConnected(data.connected);

      if (data.connected) {
        fetchSearchConsoleData();
      }
    } catch (error) {
      console.error('Search Console status error:', error);
    }
  };

  const fetchSearchConsoleData = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const [summaryRes, queriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/search-console/summary?startDate=${getDateDaysAgo(30)}&endDate=${getDateDaysAgo(0)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/search-console/top-queries?limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (summaryRes.ok && queriesRes.ok) {
        const summary = await summaryRes.json();
        const queries = await queriesRes.json();
        setSearchConsoleData({ summary, queries: queries.queries });
      }
    } catch (error) {
      console.error('Search Console data error:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('jwt');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [
        overviewRes,
        globalStatsRes,
        usersRes,
        compressionRes,
        revenueRes,
        engagementRes,
        securityRes,
        mobileRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/ceo-dashboard/overview?period=${period}`, { headers }),
        fetch(`${API_BASE_URL}/feed/stats`),
        fetch(`${API_BASE_URL}/ceo-dashboard/users-analytics?period=${period}`, { headers }),
        fetch(`${API_BASE_URL}/ceo-dashboard/compression-analytics?period=${period}`, { headers }),
        fetch(`${API_BASE_URL}/ceo-dashboard/revenue?period=${period}`, { headers }),
        fetch(`${API_BASE_URL}/ceo-dashboard/engagement?period=${period}`, { headers }),
        fetch(`${API_BASE_URL}/ceo-dashboard/security?period=${period}`, { headers }),
        fetch(`${API_BASE_URL}/ceo-dashboard/mobile-stats?period=${period}`, { headers })
      ]);

      if (overviewRes.status === 403) {
        alert('Access denied. CEO/Admin only.');
        navigate('/');
        return;
      }

      setOverview(await overviewRes.json());
      setGlobalStats(await globalStatsRes.json());
      setUsersAnalytics(await usersRes.json());
      setCompressionAnalytics(await compressionRes.json());
      setRevenue(await revenueRes.json());
      setEngagement(await engagementRes.json());
      setSecurity(await securityRes.json());
      setMobileStats(await mobileRes.json());
    } catch (error) {
      console.error('Error fetching CEO dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-black border-b lg:border-b-0 lg:border-r border-white/10 flex-shrink-0">
        <div className="p-4 lg:p-6 border-b border-white/10">
          <h1 className="text-lg lg:text-xl font-semibold">SlimFile CEO</h1>
          <p className="text-white/40 text-xs lg:text-sm mt-1">Analytics Dashboard</p>
        </div>

        <nav className="p-2 lg:p-4 flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'compressions', label: 'Compressions' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'engagement', label: 'Engagement' },
            { id: 'mobile', label: 'Mobile' },
            { id: 'security', label: 'Security' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'search', label: 'Search' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`whitespace-nowrap lg:whitespace-normal lg:w-full text-left px-3 lg:px-4 py-2 lg:py-3 rounded-lg mb-0 lg:mb-1 mr-2 lg:mr-0 transition-colors text-sm ${
                activeSection === item.id
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Header */}
        <header className="bg-black border-b border-white/10 px-4 lg:px-8 py-3 lg:py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold capitalize">{activeSection}</h2>
            <p className="text-white/40 text-xs lg:text-sm mt-1">
              {period === 'today' ? 'Today' : period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : period === '90d' ? 'Last 90 days' : 'All time'}
            </p>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto">
            {(['today', '7d', '30d', '90d', 'all'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm transition-colors whitespace-nowrap ${
                  period === p
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {p === 'today' ? 'Today' : p === '7d' ? '7D' : p === '30d' ? '30D' : p === '90d' ? '90D' : 'All'}
              </button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {activeSection === 'overview' && overview && globalStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatCard
                  label="Total Users"
                  value={overview.users.total.toLocaleString()}
                  subtitle={`${overview.users.web} web, ${overview.users.mobile} mobile`}
                />
                <StatCard
                  label="Compressions"
                  value={globalStats.totalCompressions.toLocaleString()}
                  subtitle={`${(globalStats.totalSpaceSaved / (1024 * 1024 * 1024)).toFixed(2)} GB saved`}
                />
                <StatCard
                  label="B2B Customers"
                  value={overview.revenue.b2bCustomers}
                  subtitle={`${overview.revenue.apiKeys} API keys`}
                />
                <StatCard
                  label="Avg Rating"
                  value={overview.engagement.avgRating}
                  subtitle={`${overview.engagement.reviews} reviews`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <StatCard
                  label="Guest Actions"
                  value={overview.engagement.guestActions.toLocaleString()}
                />
                <StatCard
                  label="PWA Installs"
                  value={overview.engagement.pwaInstalls}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
                {/* User Growth Chart */}
                {usersAnalytics && usersAnalytics.growth.web.length > 0 && (
                  <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
                    <h3 className="text-base lg:text-lg font-semibold mb-4">User Growth Trend</h3>
                    <div className="h-48 flex items-end gap-1">
                      {usersAnalytics.growth.web.slice(-30).map((day: any, i: number) => {
                        const maxCount = Math.max(...usersAnalytics.growth.web.slice(-30).map((d: any) => d.count));
                        const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                        return (
                          <div key={i} className="flex-1 flex flex-col justify-end">
                            <div
                              className="bg-white rounded-sm transition-all hover:bg-white/80"
                              style={{ height: `${height}%`, minHeight: height > 0 ? '2px' : '0' }}
                              title={`${day._id}: ${day.count} users`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-white/40 mt-2">Last 30 days</p>
                  </div>
                )}

                {/* Compression Trend Chart */}
                {compressionAnalytics && compressionAnalytics.trend.length > 0 && (
                  <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
                    <h3 className="text-base lg:text-lg font-semibold mb-4">Compression Trend</h3>
                    <div className="h-48 flex items-end gap-1">
                      {compressionAnalytics.trend.slice(-30).map((day: any, i: number) => {
                        const maxCount = Math.max(...compressionAnalytics.trend.slice(-30).map((d: any) => d.count));
                        const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                        return (
                          <div key={i} className="flex-1 flex flex-col justify-end">
                            <div
                              className="bg-white rounded-sm transition-all hover:bg-white/80"
                              style={{ height: `${height}%`, minHeight: height > 0 ? '2px' : '0' }}
                              title={`${day._id}: ${day.count} compressions`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-white/40 mt-2">Last 30 days</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'users' && usersAnalytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <StatCard label="Web Users" value={usersAnalytics.growth.web.reduce((sum: number, d: any) => sum + d.count, 0)} />
                <StatCard label="Mobile Users" value={usersAnalytics.growth.mobile.reduce((sum: number, d: any) => sum + d.count, 0)} />
                <StatCard label="Top Users" value={usersAnalytics.topUsers.length} />
              </div>

              <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
                <h3 className="text-base lg:text-lg font-semibold mb-4">Top Users by Compressions</h3>
                <div className="space-y-2 overflow-x-auto">
                  {usersAnalytics.topUsers.slice(0, 10).map((user: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-white/40 text-xs truncate">{user.email}</p>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="font-semibold text-sm">{user.totalFilesCompressed}</p>
                        <p className="text-white/40 text-xs">{(user.totalSpaceSaved / (1024 * 1024)).toFixed(1)} MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'compressions' && compressionAnalytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <StatCard
                  label="Total Compressions"
                  value={compressionAnalytics.trend.reduce((sum: number, d: any) => sum + d.count, 0)}
                />
                <StatCard
                  label="Avg Compression Ratio"
                  value={(compressionAnalytics.averages.avgCompressionRatio || 0).toFixed(1) + '%'}
                />
              </div>

              <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
                <h3 className="text-base lg:text-lg font-semibold mb-4">File Types</h3>
                <div className="space-y-2">
                  {compressionAnalytics.fileTypes.map((ft: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="font-semibold text-sm">{ft._id}</span>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{ft.count.toLocaleString()}</p>
                        <p className="text-white/40 text-xs">{ft.avgCompressionRatio.toFixed(1)}% avg ratio</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'revenue' && revenue && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <StatCard label="Total Customers" value={revenue.b2b.total} />
                <StatCard label="Active" value={revenue.b2b.active} />
                <StatCard label="Inactive" value={revenue.b2b.inactive} />
              </div>

              <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
                <h3 className="text-base lg:text-lg font-semibold mb-4">B2B Customers</h3>
                <div className="space-y-2 overflow-x-auto">
                  {revenue.b2b.customers.map((customer: any, i: number) => (
                    <div key={i} className="flex flex-col lg:flex-row lg:items-center justify-between p-3 bg-white/5 rounded-lg gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm">{customer.customerName}</p>
                        <p className="text-white/40 text-xs">{customer.customerCompany || 'N/A'}</p>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <div>
                          <p className="text-white/40">Usage</p>
                          <p className="font-semibold">{customer.usageCount}</p>
                        </div>
                        <div>
                          <p className="text-white/40">Status</p>
                          <p className={customer.isActive ? 'text-green-400' : 'text-red-400'}>
                            {customer.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'engagement' && engagement && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <StatCard label="PWA Installs" value={engagement.pwa.byPlatform.reduce((sum: number, p: any) => sum + p.count, 0)} />
                <StatCard label="Reviews" value={engagement.reviews.recent.length} />
                <StatCard label="Total Guests" value={engagement.guests.totalGuests || 0} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
                  <h3 className="text-base lg:text-lg font-semibold mb-4">PWA by Platform</h3>
                  <div className="space-y-2">
                    {engagement.pwa.byPlatform.map((p: any, i: number) => (
                      <div key={i} className="flex justify-between p-2 bg-white/5 rounded">
                        <span className="capitalize text-sm">{p._id || 'Unknown'}</span>
                        <span className="font-semibold text-sm">{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
                  <h3 className="text-base lg:text-lg font-semibold mb-4">Review Breakdown</h3>
                  <div className="space-y-2">
                    {engagement.reviews.breakdown.map((r: any, i: number) => (
                      <div key={i} className="flex justify-between p-2 bg-white/5 rounded">
                        <span className="text-sm">{r._id} Stars</span>
                        <span className="font-semibold text-sm">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'mobile' && mobileStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <StatCard label="Total Users" value={mobileStats.total} />
                <StatCard label="Active (30d)" value={mobileStats.active} />
                <StatCard label="Top Users" value={mobileStats.topUsers.length} />
              </div>

              <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
                <h3 className="text-base lg:text-lg font-semibold mb-4">Top Mobile Users</h3>
                <div className="space-y-2 overflow-x-auto">
                  {mobileStats.topUsers.slice(0, 10).map((user: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-white/40 text-xs truncate">{user.email}</p>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="font-semibold text-sm">{user.totalFilesCompressed}</p>
                        <p className="text-white/40 text-xs">{(user.totalSpaceSaved / (1024 * 1024)).toFixed(1)} MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && security && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <StatCard label="Security Events" value={security.events.length} />
                <StatCard label="Security Accesses" value={security.accesses.length} />
              </div>

              <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
                <h3 className="text-base lg:text-lg font-semibold mb-4">Recent Events</h3>
                <div className="space-y-2 overflow-x-auto max-h-96 overflow-y-auto">
                  {security.events.slice(0, 20).map((event: any, i: number) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg text-xs">
                      <p className="font-semibold">{event.type || 'Unknown'}</p>
                      <p className="text-white/40 mt-1">{new Date(event.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="bg-white/5 rounded-lg p-1 h-full min-h-[600px] lg:min-h-[800px]">
              <iframe
                src="https://datastudio.google.com/embed/reporting/336ae76d-a21e-493c-b697-d936274fcb5a/page/kIV1C"
                className="w-full h-full rounded-lg"
                style={{ minHeight: '600px' }}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}

          {activeSection === 'search' && (
            <div className="space-y-6">
              {!searchConsoleConnected ? (
                <div className="text-center py-12">
                  <p className="text-white/40 mb-4">Connect Google Search Console to see analytics</p>
                  <button
                    className="px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 text-sm lg:text-base"
                    onClick={() => window.location.href = `${API_BASE_URL}/search-console/auth`}
                  >
                    Connect Search Console
                  </button>
                </div>
              ) : searchConsoleData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
                    <StatCard label="Total Clicks" value={searchConsoleData.summary.totalClicks} />
                    <StatCard label="Impressions" value={searchConsoleData.summary.totalImpressions} />
                    <StatCard label="Avg CTR" value={searchConsoleData.summary.avgCTR} />
                    <StatCard label="Avg Position" value={searchConsoleData.summary.avgPosition} />
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
                    <h3 className="text-base lg:text-lg font-semibold mb-4">Top Search Queries</h3>
                    <div className="space-y-2 overflow-x-auto">
                      {searchConsoleData.queries.map((query: any, i: number) => (
                        <div key={i} className="flex flex-col lg:flex-row lg:items-center justify-between p-3 bg-white/5 rounded-lg gap-2">
                          <span className="font-semibold text-sm min-w-0 flex-1 truncate">{query.query}</span>
                          <div className="flex gap-4 text-xs flex-shrink-0">
                            <div>
                              <p className="text-white/40">Clicks</p>
                              <p className="font-semibold">{query.clicks}</p>
                            </div>
                            <div>
                              <p className="text-white/40">CTR</p>
                              <p className="font-semibold">{query.ctr}</p>
                            </div>
                            <div>
                              <p className="text-white/40">Position</p>
                              <p className="font-semibold">{query.position}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-white/40">
                  Loading Search Console data...
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="text-center py-12 text-white/40">
              Loading data...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, subtitle }: { label: string; value: string | number; subtitle?: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-4 lg:p-6 border border-white/10">
      <p className="text-white/40 text-xs lg:text-sm uppercase tracking-wide">{label}</p>
      <p className="text-2xl lg:text-4xl font-semibold mt-2">{value}</p>
      {subtitle && <p className="text-white/40 text-xs lg:text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
