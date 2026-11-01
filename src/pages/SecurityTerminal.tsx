import { useState, useEffect, useRef } from 'react';
import { useSEO } from '@/hooks/useSEO';
import AdminOnly, { adminHeaders } from '@/components/AdminOnly';

// Hide the footer on mount
const useFullScreen = () => {
  useEffect(() => {
    // Hide the footer; the site header stays
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');

    if (footer) footer.style.display = 'none';
    if (main) {
      main.style.padding = '0';
      main.style.margin = '0';
    }

    // Set body to full screen
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore on unmount
      if (footer) footer.style.display = '';
      if (main) {
        main.style.padding = '';
        main.style.margin = '';
      }
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);
};

interface SessionStats {
  total: number;
  authenticated: number;
  guest: number;
  suspicious: number;
}

interface ThreatStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface SecurityEvent {
  _id: string;
  type: string;
  severity: string;
  ipAddress: string;
  description: string;
  timestamp: string;
  blocked: boolean;
}

interface DashboardStats {
  sessions: SessionStats;
  threats: ThreatStats;
  failedLogins: number;
  rateLimitHits: number;
  blockedIPs: Array<{ _id: string; count: number }>;
  recentEvents: SecurityEvent[];
}

export default function SecurityTerminal() {
  useSEO({
    title: 'Security Terminal — SlimFile',
    description: 'Security monitoring and threat detection system',
  });

  // Access comes from the admin email list on the server
  const [access, setAccess] = useState<'checking' | 'ok' | 'denied'>('checking');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [uptime, setUptime] = useState({ days: 0, hours: 0, minutes: 0 });
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://slimfile-fb.onrender.com/api';

  // Beep sound for alerts (data URI - pure sine wave)
  const alertBeep = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDGH0fPTgjMGHm7A7+OZSA8'

  // Hide the footer for the full-screen terminal
  useFullScreen();

  useEffect(() => {
    // Auto-focus input
    inputRef.current?.focus();

    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(alertBeep);
    }

    // Start uptime counter
    const startTime = Date.now();
    const uptimeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
      const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
      setUptime({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(uptimeInterval);
  }, []);

  // Fetch stats every 5 seconds; the first answer also says whether this is an admin
  useEffect(() => {
    if (access === 'denied') return;

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/security/dashboard-stats`, { headers: adminHeaders() });
        if (response.status === 401 || response.status === 403) {
          setAccess('denied');
          return;
        }
        if (response.ok) {
          setAccess(a => {
            if (a === 'checking') {
              setOutput([
                'ACCESS GRANTED',
                '━'.repeat(60),
                'SlimFile Security Command Center v1.0',
                'Connection established.',
                '',
                'Type "help" for available commands',
                ''
              ]);
            }
            return 'ok';
          });
          const data = await response.json();
          setStats(data.stats);

          // Play alert sound if critical threats detected
          if (data.stats.threats.critical > 0) {
            audioRef.current?.play().catch(() => {});
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [access === 'denied', API_BASE_URL]);


  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setOutput(prev => [...prev, `root@slimfile:~# ${cmd}`, '']);

    switch (trimmed) {
      case 'help':
        setOutput(prev => [...prev,
          'Available Commands:',
          '━'.repeat(60),
          '  sessions       - Show active sessions',
          '  threats        - Show recent threats',
          '  failed-logins  - Show failed login attempts',
          '  rate-limits    - Show rate limit violations',
          '  blacklist      - Show blocked IPs',
          '  attacks        - Show attack attempts (SQL, XSS, path traversal)',
          '  uploads        - Show blocked malicious uploads',
          '  summit         - Show Summit 2027 registrations',
          '  lookup-ip <ip> - Get geolocation & info for an IP address',
          '  clear          - Clear screen',
          '  exit           - Logout',
          ''
        ]);
        break;

      case 'sessions':
        if (stats) {
          setOutput(prev => [...prev,
            'ACTIVE SESSIONS',
            '━'.repeat(60),
            `Total: ${stats.sessions.total}`,
            `Authenticated: ${stats.sessions.authenticated}`,
            `Guest: ${stats.sessions.guest}`,
            `Suspicious: ${stats.sessions.suspicious} ${stats.sessions.suspicious > 0 ? '⚠️' : ''}`,
            ''
          ]);
        }
        break;

      case 'threats':
        if (stats) {
          setOutput(prev => [...prev,
            'THREAT SUMMARY (Last 10 min)',
            '━'.repeat(60),
            `Total: ${stats.threats.total}`,
            `Critical: ${stats.threats.critical} ${stats.threats.critical > 0 ? '🔴' : ''}`,
            `High: ${stats.threats.high} ${stats.threats.high > 0 ? '🟠' : ''}`,
            `Medium: ${stats.threats.medium}`,
            `Low: ${stats.threats.low}`,
            ''
          ]);
        }
        break;

      case 'failed-logins':
        if (stats) {
          setOutput(prev => [...prev,
            'FAILED LOGIN ATTEMPTS (Last hour)',
            '━'.repeat(60),
            `Total: ${stats.failedLogins}`,
            ''
          ]);
        }
        break;

      case 'rate-limits':
        if (stats) {
          setOutput(prev => [...prev,
            'RATE LIMIT VIOLATIONS (Last hour)',
            '━'.repeat(60),
            `Total: ${stats.rateLimitHits}`,
            ''
          ]);
        }
        break;

      case 'blacklist':
        if (stats && stats.blockedIPs.length > 0) {
          setOutput(prev => [...prev,
            'BLOCKED IP ADDRESSES',
            '━'.repeat(60),
            ...stats.blockedIPs.map(ip => `${ip._id} (${ip.count} events)`),
            ''
          ]);
        } else {
          setOutput(prev => [...prev, 'No blocked IPs', '']);
        }
        break;

      case 'attacks':
        if (stats && stats.recentEvents) {
          const attacks = stats.recentEvents.filter(e =>
            ['sql_injection', 'path_traversal', 'xss_attempt'].includes(e.type)
          );
          if (attacks.length > 0) {
            setOutput(prev => [...prev,
              'ATTACK ATTEMPTS',
              '━'.repeat(60),
              ...attacks.map(a =>
                `[${new Date(a.timestamp).toLocaleTimeString()}] ${a.type.toUpperCase()} from ${a.ipAddress}`
              ),
              ''
            ]);
          } else {
            setOutput(prev => [...prev, 'No attack attempts detected', '']);
          }
        }
        break;

      case 'uploads':
        if (stats && stats.recentEvents) {
          const uploads = stats.recentEvents.filter(e => e.type === 'malicious_upload');
          if (uploads.length > 0) {
            setOutput(prev => [...prev,
              'BLOCKED MALICIOUS UPLOADS',
              '━'.repeat(60),
              ...uploads.map(u =>
                `[${new Date(u.timestamp).toLocaleTimeString()}] ${u.description} from ${u.ipAddress}`
              ),
              ''
            ]);
          } else {
            setOutput(prev => [...prev, 'No malicious uploads blocked', '']);
          }
        }
        break;

      case 'summit':
        setOutput(prev => [...prev, 'Fetching Summit 2027 registrations...', '']);
        fetch(`${API_BASE_URL}/summit/admin/registrations`, {
          headers: adminHeaders()
        })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              setOutput(prev => [...prev,
                'SLIMFILE IMPACT SUMMIT 2027 REGISTRATIONS',
                '━'.repeat(60),
                `Total Registrations: ${data.count}`,
                '',
                ...data.registrations.map((reg: any) =>
                  `${reg.name} (${reg.email})\n  Org: ${reg.organization}\n  Role: ${reg.role}\n  Registered: ${new Date(reg.registeredAt).toLocaleString()}`
                ),
                ''
              ]);
            } else {
              setOutput(prev => [...prev, `Error: ${data.message}`, '']);
            }
          })
          .catch(() => {
            setOutput(prev => [...prev, 'Failed to fetch registrations', '']);
          });
        break;

      case 'clear':
        setOutput([]);
        break;

      case 'exit':
        setOutput([]);
        window.location.assign('/');
        break;

      default:
        // Check for lookup-ip command with parameter
        if (trimmed.startsWith('lookup-ip ')) {
          const ip = trimmed.replace('lookup-ip ', '').trim();

          setOutput(prev => [...prev, `Looking up ${ip}...`, '']);

          fetch(`${API_BASE_URL}/security/ip-lookup/${ip}`, { headers: adminHeaders() })
            .then(r => r.json())
            .then(data => {
              if (data.success) {
                setOutput(prev => [...prev,
                  'IP ADDRESS INFORMATION',
                  '━'.repeat(60),
                  `IP: ${data.ip}`,
                  '',
                  '[LOCATION]',
                  `├─ Country: ${data.location.country} (${data.location.countryCode})`,
                  `├─ Region: ${data.location.region}`,
                  `├─ City: ${data.location.city}`,
                  `├─ ZIP: ${data.location.zip || 'N/A'}`,
                  `├─ Timezone: ${data.location.timezone}`,
                  `└─ Coordinates: ${data.location.coordinates.lat}, ${data.location.coordinates.lon}`,
                  '',
                  '[NETWORK]',
                  `├─ ISP: ${data.network.isp}`,
                  `├─ Organization: ${data.network.organization}`,
                  `└─ ASN: ${data.network.asn}`,
                  '',
                  '[SECURITY FLAGS]',
                  `├─ Mobile: ${data.security.isMobile ? 'YES' : 'NO'}`,
                  `├─ Proxy/VPN: ${data.security.isProxy ? 'YES ⚠️' : 'NO'}`,
                  `└─ Hosting/Datacenter: ${data.security.isHosting ? 'YES' : 'NO'}`,
                  ''
                ]);
              } else {
                setOutput(prev => [...prev, `Error: ${data.error}`, '']);
              }
            })
            .catch(err => {
              setOutput(prev => [...prev, `Failed to lookup IP: ${err.message}`, '']);
            });

          break;
        }

        setOutput(prev => [...prev, `Command not found: ${cmd}`, 'Type "help" for available commands', '']);
    }

    setCommand('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (command.trim()) {
        handleCommand(command);
      }
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  if (access === 'denied') return <AdminOnly title="Security Terminal" />;
  if (access === 'checking') {
    return (
      <div className="fixed inset-x-0 top-12 bottom-0 bg-[#f5f5f7] flex items-center justify-center z-30 font-mono text-[#6e6e73] text-sm">
        Connecting…
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 top-12 bottom-0 bg-[#f5f5f7] text-[#f5f5f7] font-mono overflow-hidden z-30 flex flex-col p-3 sm:p-6">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col overflow-hidden rounded-[14px] bg-[#1d1d1f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-2 px-4 h-10 border-b border-white/10 flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="flex-1 text-center text-xs text-[#86868b] -ml-12">SlimFile Security — live monitor</span>
          </div>
      <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden min-h-0">
        {/* Header */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex-shrink-0">
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="text-[#30d158]">SLIMFILE SECURITY TERMINAL</span>
              <span className="mx-2">|</span>
              <span>STATUS: <span className="text-[#30d158]">MONITORING</span></span>
            </div>
            <div>
              <span>UPTIME: {uptime.days}d {uptime.hours}h {uptime.minutes}m</span>
            </div>
          </div>
        </div>

        {/* Stats Display */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-shrink-0">
            {/* Sessions */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-sm mb-2">[LIVE SESSIONS]</div>
              <div className="text-xs space-y-0.5">
                <div>├─ Total Active: {stats.sessions.total}</div>
                <div>├─ Authenticated: {stats.sessions.authenticated}</div>
                <div>├─ Guest: {stats.sessions.guest}</div>
                <div>└─ Suspicious: {stats.sessions.suspicious} {stats.sessions.suspicious > 0 && '⚠️'}</div>
              </div>
            </div>

            {/* Threats */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-sm mb-2">[THREATS - LAST 10 MIN]</div>
              <div className="text-xs space-y-0.5">
                <div className={stats.threats.critical > 0 ? 'text-[#ff453a]' : ''}>
                  ├─ Critical: {stats.threats.critical} {stats.threats.critical > 0 && '🔴'}
                </div>
                <div className={stats.threats.high > 0 ? 'text-yellow-500' : ''}>
                  ├─ High: {stats.threats.high} {stats.threats.high > 0 && '🟠'}
                </div>
                <div>├─ Medium: {stats.threats.medium}</div>
                <div>└─ Low: {stats.threats.low}</div>
              </div>
            </div>

            {/* Activity */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-sm mb-2">[ACTIVITY]</div>
              <div className="text-xs space-y-0.5">
                <div>├─ Failed Logins: {stats.failedLogins}</div>
                <div>├─ Rate Limits: {stats.rateLimitHits}</div>
                <div>└─ Blocked IPs: {stats.blockedIPs.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Events Stream */}
        {stats && stats.recentEvents.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex-shrink-0">
            <div className="text-sm mb-2">[SECURITY EVENT STREAM]</div>
            <div className="text-xs space-y-0.5 max-h-24 overflow-y-auto">
              {stats.recentEvents.slice(0, 10).map((event, i) => {
                // Highlight different attack types
                const isAttack = ['sql_injection', 'path_traversal', 'xss_attempt', 'malicious_upload'].includes(event.type);
                const colorClass =
                  event.severity === 'critical' ? 'text-[#ff453a]' :
                  event.severity === 'high' ? 'text-yellow-500' :
                  isAttack ? 'text-orange-400' :
                  'text-[#f5f5f7]';

                return (
                  <div key={i} className={colorClass}>
                    [{new Date(event.timestamp).toLocaleTimeString()}] {event.severity.toUpperCase()}: {event.type.replace(/_/g, ' ')} - {event.ipAddress}
                    {event.blocked && ' [BLOCKED]'}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Terminal Output */}
        <div
          ref={terminalRef}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex-1 overflow-y-auto text-xs min-h-0"
        >
          {output.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        {/* Command Input */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex-shrink-0">
          <div className="flex items-center text-xs">
            <span className="mr-2">root@slimfile:~#</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border-none text-[#f5f5f7] focus:outline-none"
              placeholder="type 'help' for commands"
            />
            <span className="animate-pulse">█</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
