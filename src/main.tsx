import './index.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import App from './App';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/dashboard/Overview';
import DashboardHistory from './pages/dashboard/History';
import DashboardAnalytics from './pages/dashboard/Analytics';
import DashboardSettings from './pages/dashboard/Settings';
import DashboardImpact from './pages/dashboard/Impact';
import DashboardGoals from './pages/dashboard/Goals';
import DashboardInsights from './pages/dashboard/Insights';
import DashboardTimeline from './pages/dashboard/Timeline';
import DashboardNotifications from './pages/dashboard/Notifications';
import DashboardIntegrations from './pages/dashboard/Integrations';
import DashboardReferrals from './pages/dashboard/Referrals';
import Home from './pages/Home';
import Compress from './pages/Compress';
import CaseStudies from './pages/CaseStudies';
import About from './pages/About';
import Teams from './pages/Teams';
import Features from './pages/Features';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Api from './pages/Api';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SlimFileSDGs from './pages/SlimFileSDGs';
import Partnerships from './pages/Partnerships';
import SlimFileGame from './pages/SlimFileGame';
import ProtectedRoute from './components/ProtectedRoute';
import FileCompressionEducation from './pages/FileCompressionEducation';
import CompressPdfOnline from './pages/CompressPdfOnline';
import CompressPptxOnline from './pages/CompressPptxOnline';
import CompressImagesOnline from './pages/CompressImagesOnline';
import CompressPdfForEmail from './pages/CompressPdfForEmail';
import CompressPdfOnIphone from './pages/CompressPdfOnIphone';
import CompressPdfWithoutLosingQuality from './pages/CompressPdfWithoutLosingQuality';
import CompressPptxForPresentation from './pages/CompressPptxForPresentation';
import CompressImagesForWebsite from './pages/CompressImagesForWebsite';
import ConvertOnly from './pages/ConvertOnly';
import ConvertThenCompress from './pages/ConvertThenCompress';
import GetStarted from './pages/GetStarted';

// Blog Pages
import BlogHowToCompressPdfForEmail from './pages/blog/HowToCompressPdfForEmail';
import BlogBestToolsToCompressImagesOnline from './pages/blog/BestToolsToCompressImagesOnline';
import BlogCompressPptxPresentationsWithoutLosingQuality from './pages/blog/CompressPptxPresentationsWithoutLosingQuality';
import BlogReducePdfFileSizeOnMobile from './pages/blog/ReducePdfFileSizeOnMobile';
import BlogHowToCompressFilesForFasterWebsiteLoading from './pages/blog/HowToCompressFilesForFasterWebsiteLoading';
import ScrollToTop from './components/ScrollToTop';
import BlogWhyFileCompressionIsEssentialForRemoteWork from './pages/blog/WhyFileCompressionIsEssentialForRemoteWork';
import { NotificationService } from './services/notificationService';
import BlogCompressingPdfForPrintingVsEmailing from './pages/blog/CompressingPdfForPrintingVsEmailing';
import BlogHowToCompressLargeVideosBeforeUploading from './pages/blog/HowToCompressLargeVideosBeforeUploading';
import OurBlogs from './pages/OurBlogs';
import StepsBuild from './pages/StepsBuild';
import Feed from './pages/Feed';
import Portals from './pages/Portals';
import GlobalDashboard from './pages/GlobalDashboard';
import Workspaces from './pages/Workspaces';
import WorkspaceDetail from './pages/WorkspaceDetail';
import WorkspaceInvitations from './pages/WorkspaceInvitations';
import { NotificationProvider } from './components/InAppNotification';

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const root = document.getElementById('root');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NotificationProvider>
            <ScrollToTop />
            <Routes>
        <Route path="/login" element={<Login />} />
        {/* New Dashboard with nested routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardOverview />} />
          <Route path="history" element={<DashboardHistory />} />
          <Route path="analytics" element={<DashboardAnalytics />} />
          <Route path="impact" element={<DashboardImpact />} />
          <Route path="goals" element={<DashboardGoals />} />
          <Route path="insights" element={<DashboardInsights />} />
          <Route path="timeline" element={<DashboardTimeline />} />
          <Route path="notifications" element={<DashboardNotifications />} />
          <Route path="integrations" element={<DashboardIntegrations />} />
          <Route path="referrals" element={<DashboardReferrals />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>
        {/* Old dashboard route - keeping for backwards compatibility */}
        <Route path="/dashboard-old" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="get-started" element={<GetStarted />} />
          <Route path="compress" element={<Compress />} />
          <Route path="convert-only" element={<ConvertOnly />} />
          <Route path="convert-compress" element={<ConvertThenCompress />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="about" element={<About />} />
          <Route path="teams" element={<Teams />} />
          <Route path="features" element={<Features />} />
          <Route path="contact" element={<Contact />} />
          <Route path="api" element={<Api />} />
          <Route path="file-compression-education" element={<FileCompressionEducation />} />
          {/* SEO Landing Pages */}
          <Route path="compress-pdf-online" element={<CompressPdfOnline />} />
          <Route path="compress-pptx-online" element={<CompressPptxOnline />} />
          <Route path="compress-images-online" element={<CompressImagesOnline />} />
          <Route path="compress-pdf-for-email" element={<CompressPdfForEmail />} />
          <Route path="compress-pdf-on-iphone" element={<CompressPdfOnIphone />} />
          <Route path="compress-pdf-without-losing-quality" element={<CompressPdfWithoutLosingQuality />} />
          <Route path="compress-pptx-for-presentation" element={<CompressPptxForPresentation />} />
          <Route path="compress-images-for-website" element={<CompressImagesForWebsite />} />

          {/* Blog Pages */}
          <Route path="blog/how-to-compress-pdf-for-email" element={<BlogHowToCompressPdfForEmail />} />
          <Route path="blog/best-tools-to-compress-images-online" element={<BlogBestToolsToCompressImagesOnline />} />
          <Route path="blog/compress-pptx-presentations-without-losing-quality" element={<BlogCompressPptxPresentationsWithoutLosingQuality />} />
          <Route path="blog/reduce-pdf-file-size-on-mobile" element={<BlogReducePdfFileSizeOnMobile />} />
          <Route path="blog/how-to-compress-files-for-faster-website-loading" element={<BlogHowToCompressFilesForFasterWebsiteLoading />} />
          <Route path="blog/why-file-compression-is-essential-for-remote-work" element={<BlogWhyFileCompressionIsEssentialForRemoteWork />} />
          <Route path="blog/compressing-pdf-for-printing-vs-emailing" element={<BlogCompressingPdfForPrintingVsEmailing />} />
          <Route path="blog/how-to-compress-large-videos-before-uploading" element={<BlogHowToCompressLargeVideosBeforeUploading />} />
          <Route path="blog" element={<OurBlogs />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="sdgs" element={<SlimFileSDGs />} />
          <Route path="partnerships" element={<Partnerships />} />
          <Route path="slimfile-game" element={<SlimFileGame />} />
          <Route path="global-dashboard" element={<GlobalDashboard />} />
          <Route path="stepsbuild" element={<StepsBuild />} />
          <Route path="feed" element={<Feed />} />
          <Route path="portals" element={
            <ProtectedRoute>
              <Portals />
            </ProtectedRoute>
          } />
        </Route>

        {/* Workspace routes - Full screen without header/footer */}
        <Route path="workspaces" element={
          <ProtectedRoute>
            <Workspaces />
          </ProtectedRoute>
        } />
        <Route path="workspaces/invitations" element={
          <ProtectedRoute>
            <WorkspaceInvitations />
          </ProtectedRoute>
        } />
        <Route path="workspaces/:workspaceId" element={
          <ProtectedRoute>
            <WorkspaceDetail />
          </ProtectedRoute>
        } />
            </Routes>
          </NotificationProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

// Add Google Identity Services script
const script = document.createElement('script');
script.src = 'https://accounts.google.com/gsi/client';
script.async = true;
script.defer = true;
document.body.appendChild(script);
