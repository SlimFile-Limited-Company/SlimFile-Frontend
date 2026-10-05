import { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  QrCode, Link2, Type, Send, Wifi, Mail, Download, Copy, ShieldCheck, Sparkles, Loader2, Check,
} from 'lucide-react';
import { ReviewPrompt } from '@/components/ReviewPrompt';
import { trackGuestActivity } from '@/utils/guestTracking';
import { reportClientTool } from '@/utils/clientToolTracking';

type QrTab = 'link' | 'text' | 'whatsapp' | 'wifi' | 'email';

const FG_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Green', value: '#059669' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Orange', value: '#ea580c' },
];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const SlimFileQR = () => {
  useSEO({
    title: 'SlimFile QR Code Generator — Free QR Codes for Links, Text & WiFi',
    description: 'Create free QR codes for links, plain text, WhatsApp, WiFi networks, and email on SlimFile. Download as PNG or SVG — no account needed.',
  });
  const { toast } = useToast();

  // The QR generator is pure client-side canvas work, so the backend never sees
  // it. Report the visit separately from the download counted in finish().
  useEffect(() => {
    reportClientTool('qr', 'visit');
  }, []);

  const [tab, setTab] = useState<QrTab>('link');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  const [linkValue, setLinkValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiOpen, setWifiOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  let payload = '';
  switch (tab) {
    case 'link': payload = linkValue.trim(); break;
    case 'text': payload = textValue.trim(); break;
    case 'whatsapp': {
      const num = waPhone.replace(/[^0-9+]/g, '').trim();
      payload = num ? `https://wa.me/${num}${waMessage.trim() ? `?text=${encodeURIComponent(waMessage.trim())}` : ''}` : '';
      break;
    }
    case 'wifi': {
      if (!wifiSsid.trim()) break;
      payload = wifiOpen
        ? `WIFI:T:nopass;S:${wifiSsid.trim()};;`
        : `WIFI:T:WPA;S:${wifiSsid.trim()};P:${wifiPass.trim()};;`;
      break;
    }
    case 'email': {
      if (!emailTo.trim()) break;
      const subj = emailSubject.trim() ? `?subject=${encodeURIComponent(emailSubject.trim())}` : '';
      const body = emailBody.trim() ? `${subj ? '&' : '?'}body=${encodeURIComponent(emailBody.trim())}` : '';
      payload = `mailto:${emailTo.trim()}${subj}${body}`;
      break;
    }
  }
  const hasPayload = payload.length > 0;

  const resetFields = () => {
    setLinkValue(''); setTextValue(''); setWaPhone(''); setWaMessage('');
    setWifiSsid(''); setWifiPass(''); setWifiOpen(false);
    setEmailTo(''); setEmailSubject(''); setEmailBody('');
  };

  const handleTabChange = (next: QrTab) => {
    setTab(next);
    setCopied(false);
  };

  const copyPayload = async () => {
    if (!hasPayload) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast({ title: 'Copied!', description: 'QR payload copied to clipboard.' });
    } catch {
      toast({ title: 'Copy failed', description: 'Your browser blocked clipboard access.', variant: 'destructive' });
    }
  };

  const finish = (format: 'png' | 'svg') => {
    trackGuestActivity('qr', format);
    reportClientTool('qr', 'complete', { detail: `${tab}:${format}` });
    setTimeout(() => setShowReviewPrompt(true), 1500);
  };

  const downloadPng = () => {
    if (!hasPayload || !canvasRef.current) return;
    setDownloading('png');
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const bin = atob(dataUrl.split(',')[1]);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      downloadBlob(new Blob([bytes], { type: 'image/png' }), 'slimfile-qr.png');
      toast({ title: 'Downloaded!', description: 'Your QR code (PNG) is ready.' });
      finish('png');
    } catch {
      toast({ title: 'Error', description: 'Could not build the PNG.', variant: 'destructive' });
    } finally {
      setDownloading(null);
    }
  };

  const downloadSvg = () => {
    const svgEl = svgWrapRef.current?.querySelector('svg');
    if (!hasPayload || !svgEl) return;
    setDownloading('svg');
    const markup = svgEl.outerHTML;
    downloadBlob(new Blob([markup], { type: 'image/svg+xml' }), 'slimfile-qr.svg');
    toast({ title: 'Downloaded!', description: 'Your QR code (SVG) is ready.' });
    finish('svg');
    setDownloading(null);
  };

  const tabs: { id: QrTab; label: string; icon: React.ReactNode }[] = [
    { id: 'link', label: 'Link', icon: <Link2 className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <Send className="w-4 h-4" /> },
    { id: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-fuchsia-50 text-fuchsia-600 text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-fuchsia-100">
            <QrCode className="w-3 h-3" />
            SlimFile QR
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
            QR Code Generator
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            Create QR codes for links, text, WhatsApp, WiFi, and email — instantly, no account needed.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { icon: <Sparkles className="w-3.5 h-3.5 text-fuchsia-500" />, label: 'Free, no sign-up' },
            { icon: <QrCode className="w-3.5 h-3.5 text-fuchsia-500" />, label: 'PNG & SVG download' },
            { icon: <ShieldCheck className="w-3.5 h-3.5 text-fuchsia-500" />, label: '100% in your browser' },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
              {icon}
              {label}
            </span>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100/80 rounded-2xl p-1 mb-6 overflow-x-auto">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                tab === id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-200/80 p-7 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-4">
              {tab === 'link' && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Website URL</span>
                    <Input
                      className="mt-1.5 h-11 border-gray-200 focus:border-fuchsia-400 focus:ring-fuchsia-400/20 rounded-xl"
                      placeholder="https://example.com"
                      value={linkValue}
                      onChange={e => setLinkValue(e.target.value)}
                    />
                  </label>
                  <p className="text-xs text-gray-400">Scanning this code opens the link on any phone.</p>
                </>
              )}

              {tab === 'text' && (
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Text</span>
                  <textarea
                    className="mt-1.5 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-fuchsia-400 focus:ring-fuchsia-400/20 text-sm min-h-[120px] resize-none"
                    placeholder="Enter any text to encode..."
                    value={textValue}
                    onChange={e => setTextValue(e.target.value)}
                  />
                </label>
              )}

              {tab === 'whatsapp' && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Phone number</span>
                    <Input
                      className="mt-1.5 h-11 border-gray-200 focus:border-fuchsia-400 focus:ring-fuchsia-400/20 rounded-xl"
                      placeholder="233550000000 (with country code)"
                      value={waPhone}
                      onChange={e => setWaPhone(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Pre-filled message <span className="text-gray-400 font-normal">(optional)</span></span>
                    <textarea
                      className="mt-1.5 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-fuchsia-400 focus:ring-fuchsia-400/20 text-sm min-h-[80px] resize-none"
                      placeholder="Hi, I scanned your QR code..."
                      value={waMessage}
                      onChange={e => setWaMessage(e.target.value)}
                    />
                  </label>
                  <p className="text-xs text-gray-400">Opens a WhatsApp chat with that number and your message.</p>
                </>
              )}

              {tab === 'wifi' && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Network name (SSID)</span>
                    <Input
                      className="mt-1.5 h-11 border-gray-200 focus:border-fuchsia-400 focus:ring-fuchsia-400/20 rounded-xl"
                      placeholder="HomeWiFi"
                      value={wifiSsid}
                      onChange={e => setWifiSsid(e.target.value)}
                    />
                  </label>
                  <div className="flex items-center justify-between gap-3">
                    <label className="block flex-1">
                      <span className="text-sm font-medium text-gray-700">Password</span>
                      <Input
                        className="mt-1.5 h-11 border-gray-200 focus:border-fuchsia-400 focus:ring-fuchsia-400/20 rounded-xl"
                        placeholder="••••••••"
                        disabled={wifiOpen}
                        value={wifiPass}
                        onChange={e => setWifiPass(e.target.value)}
                      />
                    </label>
                    <label className="flex items-center gap-2 mt-6 text-sm text-gray-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={wifiOpen}
                        onChange={e => setWifiOpen(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      Open network
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">Scanning the code connects a phone to this WiFi instantly.</p>
                </>
              )}

              {tab === 'email' && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Email address</span>
                    <Input
                      className="mt-1.5 h-11 border-gray-200 focus:border-fuchsia-400 focus:ring-fuchsia-400/20 rounded-xl"
                      placeholder="you@example.com"
                      value={emailTo}
                      onChange={e => setEmailTo(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Subject <span className="text-gray-400 font-normal">(optional)</span></span>
                    <Input
                      className="mt-1.5 h-11 border-gray-200 focus:border-fuchsia-400 focus:ring-fuchsia-400/20 rounded-xl"
                      placeholder="Subject"
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Body <span className="text-gray-400 font-normal">(optional)</span></span>
                    <textarea
                      className="mt-1.5 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-fuchsia-400 focus:ring-fuchsia-400/20 text-sm min-h-[80px] resize-none"
                      placeholder="Hello..."
                      value={emailBody}
                      onChange={e => setEmailBody(e.target.value)}
                    />
                  </label>
                </>
              )}

              {hasPayload && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={copyPayload}
                    className="flex-1 rounded-xl h-10 text-sm font-semibold border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    {copied ? <Check className="w-4 h-4 mr-1.5 text-green-500" /> : <Copy className="w-4 h-4 mr-1.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetFields}
                    className="flex-1 rounded-xl h-10 text-sm font-semibold border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Preview + actions */}
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <QRCodeCanvas
                    value={payload || ' '}
                    size={Math.min(size, 400)}
                    fgColor={fgColor}
                    ref={canvasRef}
                    marginSize={2}
                  />
                </div>
                <div ref={svgWrapRef} className="hidden">
                  <QRCodeSVG
                    value={payload || ' '}
                    size={size}
                    fgColor={fgColor}
                    marginSize={2}
                  />
                </div>

                <div className="w-full space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>Resolution</span>
                      <span className="font-semibold text-gray-700">{size}px</span>
                    </div>
                    <input
                      type="range"
                      min={128}
                      max={512}
                      step={16}
                      value={size}
                      onChange={e => setSize(Number(e.target.value))}
                      className="w-full accent-fuchsia-600"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {FG_COLORS.map(c => (
                      <button
                        key={c.value}
                        title={c.name}
                        onClick={() => setFgColor(c.value)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${fgColor === c.value ? 'border-fuchsia-500 scale-110' : 'border-gray-200 hover:border-gray-300'}`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      onClick={downloadPng}
                      disabled={!hasPayload || downloading !== null}
                      className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl h-11 text-sm font-semibold shadow-sm"
                    >
                      {downloading === 'png'
                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Preparing…</>
                        : <><Download className="w-4 h-4 mr-2" />PNG</>}
                    </Button>
                    <Button
                      onClick={downloadSvg}
                      disabled={!hasPayload || downloading !== null}
                      variant="outline"
                      className="flex-1 rounded-xl h-11 text-sm font-semibold border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      {downloading === 'svg'
                        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Preparing…</>
                        : <><Download className="w-4 h-4 mr-2" />SVG</>}
                    </Button>
                  </div>
                </div>
              </div>

              {!hasPayload && (
                <p className="text-xs text-gray-400 text-center">Fill in a field to preview your QR code.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Generated entirely in your browser — nothing is uploaded to our servers</span>
        </div>
      </div>

      {/* Review Prompt */}
      <ReviewPrompt
        isOpen={showReviewPrompt}
        onClose={() => setShowReviewPrompt(false)}
        operationType="qr"
      />
    </div>
  );
};

export default SlimFileQR;