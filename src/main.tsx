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
import Features from './pages/Features';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Api from './pages/Api';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SlimFileSDGs from './pages/SlimFileSDGs';
import Partnerships from './pages/Partnerships';
import News from './pages/News';
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
import BlogConvertJpgToPdf from './pages/blog/ConvertJpgToPdf';
import BlogConvertPngToWebp from './pages/blog/ConvertPngToWebp';
import BlogConvertPdfToWord from './pages/blog/ConvertPdfToWord';
import BlogConvertPdfToImage from './pages/blog/ConvertPdfToImage';
import BlogConvertJpgToPng from './pages/blog/ConvertJpgToPng';
import BlogConvertPngToJpg from './pages/blog/ConvertPngToJpg';
import BlogConvertWebpToJpg from './pages/blog/ConvertWebpToJpg';
import BlogConvertDocxToPdf from './pages/blog/ConvertDocxToPdf';
import BlogConvertPdfToPptx from './pages/blog/ConvertPdfToPptx';
import BlogConvertPdfToXlsx from './pages/blog/ConvertPdfToXlsx';
import OurBlogs from './pages/OurBlogs';
import Feed from './pages/Feed';
import Portals from './pages/Portals';
import GlobalDashboard from './pages/GlobalDashboard';
import Workspaces from './pages/Workspaces';
import WorkspaceDetail from './pages/WorkspaceDetail';
import WorkspaceInvitations from './pages/WorkspaceInvitations';
import Meet from './pages/Meet';
import MeetingRoom from './pages/MeetingRoom';
import OCRTool from './pages/OCRTool';
import PersonalWhiteboards from './pages/PersonalWhiteboards';
import PersonalWhiteboardCanvas from './pages/PersonalWhiteboardCanvas';
import Documents from './pages/Documents';
import DocumentEditor from './pages/DocumentEditor';
import AdminNewsletter from './pages/AdminNewsletter';
import SlimFileDrive from './pages/SlimFileDrive';
import Messages from './pages/Messages';
import BottomNav from './components/BottomNav';
import PushListener from './components/PushListener';
import SlimFileForge from './pages/SlimFileForge';
import SlimFileLock from './pages/SlimFileLock';
import SummarizeDocument from './pages/SummarizeDocument';
import { NotificationProvider } from './components/InAppNotification';
import UpdatePrompt from './components/UpdatePrompt';

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
            <BottomNav />
            <PushListener />
            <UpdatePrompt />
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
          <Route path="blog/convert-jpg-to-pdf" element={<BlogConvertJpgToPdf />} />
          <Route path="blog/convert-png-to-webp" element={<BlogConvertPngToWebp />} />
          <Route path="blog/convert-pdf-to-word" element={<BlogConvertPdfToWord />} />
          <Route path="blog/convert-pdf-to-image" element={<BlogConvertPdfToImage />} />
          <Route path="blog/convert-jpg-to-png" element={<BlogConvertJpgToPng />} />
          <Route path="blog/convert-png-to-jpg" element={<BlogConvertPngToJpg />} />
          <Route path="blog/convert-webp-to-jpg" element={<BlogConvertWebpToJpg />} />
          <Route path="blog/convert-docx-to-pdf" element={<BlogConvertDocxToPdf />} />
          <Route path="blog/convert-pdf-to-pptx" element={<BlogConvertPdfToPptx />} />
          <Route path="blog/convert-pdf-to-xlsx" element={<BlogConvertPdfToXlsx />} />
          <Route path="blog" element={<OurBlogs />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="sdgs" element={<SlimFileSDGs />} />
          <Route path="partnerships" element={<Partnerships />} />
          <Route path="news" element={<News />} />
          <Route path="global-dashboard" element={<GlobalDashboard />} />
          <Route path="feed" element={<Feed />} />
          <Route path="portals" element={
            <ProtectedRoute>
              <Portals />
            </ProtectedRoute>
          } />
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
          <Route path="meet" element={<Meet />} />
          <Route path="ocr-tool" element={<OCRTool />} />
          <Route path="forge" element={<SlimFileForge />} />
          <Route path="lock" element={<SlimFileLock />} />
          <Route path="summarize" element={<SummarizeDocument />} />
        </Route>

        {/* Workspace chat - Full screen without header/footer */}
        <Route path="workspaces/:workspaceId" element={
          <ProtectedRoute>
            <WorkspaceDetail />
          </ProtectedRoute>
        } />

        {/* Personal whiteboards */}
        <Route path="my-whiteboards" element={
          <ProtectedRoute>
            <PersonalWhiteboards />
          </ProtectedRoute>
        } />

        {/* Personal whiteboard canvas */}
        <Route path="my-whiteboards/:whiteboardId" element={
          <ProtectedRoute>
            <PersonalWhiteboardCanvas />
          </ProtectedRoute>
        } />

        {/* Documents */}
        <Route path="documents" element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        } />

        {/* Document Editor */}
        <Route path="documents/:documentId" element={
          <ProtectedRoute>
            <DocumentEditor />
          </ProtectedRoute>
        } />

        {/* Admin newsletter — protected by server-side email check */}
        <Route path="admin/newsletter" element={
          <ProtectedRoute>
            <AdminNewsletter />
          </ProtectedRoute>
        } />

        {/* SlimFile Drive */}
        <Route path="drive" element={
          <ProtectedRoute>
            <SlimFileDrive />
          </ProtectedRoute>
        } />

        {/* Meeting room - Full screen without header/footer */}
        <Route path="meet/:meetingCode" element={<MeetingRoom />} />

        {/* Messages - Full screen DM chat without header/footer */}
        <Route path="messages" element={
          <ProtectedRoute>
            <Messages />
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
