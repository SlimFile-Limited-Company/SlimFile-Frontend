import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Privacy policy and support for the SlimFile Atlas mobile app (App Store / Google Play links).
 * Deliberately unlisted: no header, footer, menu or sitemap entry, and noindex. Styled in the
 * Atlas app's own palette, not the website's.
 */

const CONTACT = 'administration@slim-file.com';

// Atlas app palette (Slimfile-Atlas-Mobile-App/src/theme.ts)
const c = {
  surface: 'bg-[#0f0f13]',
  surface2: 'bg-[#16161d]',
  border: 'border-[#2a2a3a]',
  text: 'text-[#f0f0f5]',
  muted: 'text-[#8888a4]',
  brandText: 'text-[#818cf8]',
};

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const upsert = (name: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      const created = !el;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      const previous = el.getAttribute('content');
      el.setAttribute('content', content);
      return () => {
        if (created) el?.remove();
        else if (previous !== null) el?.setAttribute('content', previous);
      };
    };

    const restoreRobots = upsert('robots', 'noindex, nofollow');
    const restoreDescription = upsert('description', description);
    return () => {
      document.title = previousTitle;
      restoreRobots();
      restoreDescription();
    };
  }, [title, description]);
}

function Heading({ children }: { children: ReactNode }) {
  return <h3 className={`text-lg font-semibold ${c.text} mt-8 mb-2`}>{children}</h3>;
}

function ContactCard() {
  return (
    <div className={`${c.surface2} border ${c.border} rounded-2xl p-5 flex flex-wrap items-center gap-3`}>
      <span className={`${c.muted} text-sm`}>Email</span>
      <a href={`mailto:${CONTACT}`} className={`${c.brandText} font-medium break-all hover:underline`}>
        {CONTACT}
      </a>
    </div>
  );
}

function Privacy() {
  return (
    <section aria-labelledby="privacy-title">
      <h2 id="privacy-title" className={`text-3xl font-semibold tracking-tight ${c.text}`}>
        Privacy policy
      </h2>
      <p className={`${c.muted} text-sm mt-2`}>Effective November 13, 2026 · SlimFile Atlas for iPhone and Android</p>

      <div className="bg-[#6366f1]/15 border border-[#6366f1]/30 rounded-2xl p-5 mt-6">
        <p className={`font-semibold ${c.text}`}>The short version</p>
        <p className={`${c.text} mt-1 leading-relaxed`}>
          Your videos never leave your device: all compression happens on your phone. SlimFile Atlas has no accounts,
          no advertising and no tracking. From version 1.0.2, the app sends anonymous usage counts, such as how many
          videos were compressed and how much space was saved, so we can see how it's used and improve it. These counts
          are not linked to your name, email or any account, and we never sell or share them.
        </p>
      </div>

      <Heading>Information we collect</Heading>
      <p className="leading-relaxed">
        From version 1.0.2, the app sends SlimFile anonymous usage data:
      </p>
      <ul className="list-disc ml-5 mt-3 space-y-2 leading-relaxed">
        <li>
          <strong className={c.text}>A random ID</strong> that the app creates on your phone the first time it opens. It
          is not your name, email, phone number or Apple ID, and we can't tell who you are from it. It lets us count
          users without accounts.
        </li>
        <li>
          <strong className={c.text}>What happened and when:</strong> the app was opened; a video was compressed (its
          size before and after, the format you chose, and how long it took); a video was saved to Photos, shared, or
          its original deleted.
        </li>
        <li>
          <strong className={c.text}>The app version and whether it's iPhone or Android.</strong>
        </li>
      </ul>
      <p className="leading-relaxed mt-3">
        We never receive your videos, file names, photos, contacts, location, name or email. We don't keep your IP
        address with this data. We use it only to understand how Atlas is used and to improve it; it is never sold,
        shared or used for advertising.
      </p>
      <p className="leading-relaxed mt-3">
        Version 1.0.1 and earlier don't send any of this.
      </p>

      <Heading>What the app does on your device</Heading>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[15px] border-collapse">
          <thead>
            <tr className={`${c.muted} text-xs uppercase tracking-wider`}>
              <th className={`py-2 pr-4 font-medium border-b ${c.border}`}>What</th>
              <th className={`py-2 pr-4 font-medium border-b ${c.border}`}>Why</th>
              <th className={`py-2 font-medium border-b ${c.border}`}>Where it stays</th>
            </tr>
          </thead>
          <tbody className="align-top">
            {[
              ['Videos you choose', 'To read and compress them', 'On your device. Only the videos you pick are opened.'],
              [
                'Compressed videos',
                'So you can save or share them',
                'In the app’s temporary storage until you save them, share them or clear the list.',
              ],
              [
                'Savings totals',
                'To show “saved so far” on the home screen',
                'A small file on your device with counts and sizes only. No file names or content.',
              ],
              [
                'Anonymous usage counts',
                'To count users and see how Atlas is used (version 1.0.2 and later)',
                'Saved on your device while you’re offline, then sent to SlimFile’s server when you’re online.',
              ],
            ].map(([what, why, where]) => (
              <tr key={what}>
                <td className={`py-3 pr-4 font-medium ${c.text} border-b ${c.border} whitespace-nowrap`}>{what}</td>
                <td className={`py-3 pr-4 border-b ${c.border}`}>{why}</td>
                <td className={`py-3 border-b ${c.border}`}>{where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Heading>Permissions</Heading>
      <ul className="list-disc ml-5 space-y-2 leading-relaxed">
        <li>
          <strong className={c.text}>Photos / media library.</strong> Used to open the videos you select and to save
          compressed copies when you tap “Save to Photos”. You can change this at any time in your device settings.
        </li>
        <li>
          <strong className={c.text}>Notifications (Android).</strong> Used only to show compression progress, with a
          Cancel button, while the app works in the background.
        </li>
      </ul>

      <Heading>Sharing</Heading>
      <p className="leading-relaxed">
        When you tap Share, your device’s share sheet opens and you choose where the video goes. That transfer is
        handled by your device and the app you choose, under their own privacy policies. SlimFile Atlas never shares
        anything on its own.
      </p>

      <Heading>iCloud and network use</Heading>
      <p className="leading-relaxed">
        If a video you pick is stored in iCloud, your iPhone downloads it from Apple before the app can open it. That
        download is handled by iOS. The app connects to the internet only to check for app updates and, from version
        1.0.2, to send the anonymous usage counts described above. Your videos are never uploaded. Compression works
        fully offline.
      </p>

      <Heading>Children</Heading>
      <p className="leading-relaxed">
        The app does not collect personal information from anyone, including children under 13. The usage counts
        described above are anonymous.
      </p>

      <Heading>Deleting your data</Heading>
      <p className="leading-relaxed">
        The usage counts are anonymous, so we can't link them to you. Deleting the app stops all counts and removes
        its files from your device, including your savings totals. On iPhone the random ID is kept in the Keychain and
        can remain after the app is deleted; it contains nothing about you.
      </p>

      <Heading>Changes to this policy</Heading>
      <p className="leading-relaxed">
        If this policy changes, we will update this page and the date above. If the app ever starts collecting data, we
        will say so here and in the app before it happens.
      </p>

      <Heading>Contact</Heading>
      <ContactCard />
    </section>
  );
}

const FAQ: [string, string][] = [
  ['Does it change or delete my original videos?', 'No. Your originals stay exactly as they are. The app creates a new, smaller copy.'],
  [
    'Why does it say a video is “already compact”?',
    'Some videos are already compressed efficiently. If the new copy would not be smaller, the app keeps your original and discards the copy.',
  ],
  [
    'Can I leave the app while it compresses?',
    'On Android and on iOS 26 or later, yes: compression keeps going and shows its progress. On older iOS versions, keep the app open until it finishes.',
  ],
  [
    'Picking a video takes a long time.',
    'The video is probably stored in iCloud. Your iPhone downloads it first, which needs an internet connection. The compression itself works offline.',
  ],
  [
    'My HDR video looks washed out.',
    'Use the Smaller option for HDR videos. It keeps HDR colors. Compatible converts to standard video, which can look flatter.',
  ],
  ['The app can’t see my videos.', 'Allow Photos access for SlimFile Atlas in your device Settings, then try again.'],
];

function Support() {
  return (
    <section aria-labelledby="support-title">
      <h2 id="support-title" className={`text-3xl font-semibold tracking-tight ${c.text}`}>
        Support
      </h2>
      <p className="leading-relaxed mt-3">
        Need help or found a problem? Email us and include your phone model and what happened. We usually reply within
        two business days.
      </p>
      <div className="mt-4">
        <ContactCard />
      </div>

      <Heading>Using SlimFile Atlas</Heading>
      <ol className="list-decimal ml-5 space-y-2 leading-relaxed">
        <li>
          Tap <strong className={c.text}>Choose videos</strong> and pick one or more videos.
        </li>
        <li>
          Choose <strong className={c.text}>Smaller</strong> (HEVC, the smallest files) or{' '}
          <strong className={c.text}>Compatible</strong> (H.264, plays everywhere).
        </li>
        <li>
          Tap <strong className={c.text}>Compress</strong>. When it finishes, tap{' '}
          <strong className={c.text}>Save to Photos</strong> or <strong className={c.text}>Share</strong>.
        </li>
      </ol>

      <Heading>Common questions</Heading>
      <div>
        {FAQ.map(([question, answer]) => (
          <details key={question} className={`border-b ${c.border} py-4 group`}>
            <summary className={`cursor-pointer font-medium ${c.text} list-none flex justify-between gap-4`}>
              {question}
              <span className={`${c.muted} transition-transform group-open:rotate-45`} aria-hidden>
                +
              </span>
            </summary>
            <p className="leading-relaxed mt-2">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function AtlasPolicy({ page }: { page: 'privacy' | 'support' }) {
  usePageMeta(
    page === 'privacy' ? 'Privacy Policy | SlimFile Atlas' : 'Support | SlimFile Atlas',
    'Privacy policy and support for the SlimFile Atlas video compressor app.',
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const tab = (target: 'privacy' | 'support', label: string) => (
    <Link
      to={`/atlas/${target}`}
      aria-current={page === target ? 'page' : undefined}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        page === target ? 'bg-[#1e1e2a] text-[#f0f0f5]' : 'text-[#8888a4] hover:text-[#f0f0f5]'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className={`min-h-screen ${c.surface} ${c.muted} text-[16px]`}>
      <header className={`border-b ${c.border}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-3">
            <img src="/atlas/logo.png" alt="" className="w-9 h-10 object-contain" />
            <span className={`text-xl font-semibold ${c.text}`}>SlimFile Atlas</span>
          </div>
          <p className="mt-4 max-w-md leading-relaxed">
            Compress videos on your phone. Your videos never leave your device.
          </p>
          <nav className={`mt-6 inline-flex gap-1 ${c.surface2} rounded-full p-1`} aria-label="Sections">
            {tab('privacy', 'Privacy policy')}
            {tab('support', 'Support')}
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {page === 'privacy' ? <Privacy /> : <Support />}
        <p className="text-sm mt-16">© 2026 SlimFile Atlas</p>
      </main>
    </div>
  );
}
