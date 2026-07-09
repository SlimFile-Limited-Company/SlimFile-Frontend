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

// New Blog Pages — Batch 1: PDF Compression
import BlogCompressPdfWithoutAdobe from './pages/blog/CompressPdfWithoutAdobe';
import BlogReducePdfSizeBelow1MB from './pages/blog/ReducePdfSizeBelow1MB';
import BlogBatchCompressMultiplePdfs from './pages/blog/BatchCompressMultiplePdfs';
import BlogCompressScannedPdf from './pages/blog/CompressScannedPdf';
import BlogWhyIsMypdfSoLarge from './pages/blog/WhyIsMypdfSoLarge';
import BlogCompressPdfInChrome from './pages/blog/CompressPdfInChrome';
import BlogCompressPdfForPrinting from './pages/blog/CompressPdfForPrinting';

// New Blog Pages — Batch 2: Image Compression
import BlogCompressImagesForInstagram from './pages/blog/CompressImagesForInstagram';
import BlogCompressImagesForFacebook from './pages/blog/CompressImagesForFacebook';
import BlogCompressImagesForWordpress from './pages/blog/CompressImagesForWordpress';
import BlogCompressImagesForShopify from './pages/blog/CompressImagesForShopify';
import BlogCompressImagesForEmail from './pages/blog/CompressImagesForEmail';
import BlogReducePhotoSizeOnIphone from './pages/blog/ReducePhotoSizeOnIphone';
import BlogReducePhotoSizeOnAndroid from './pages/blog/ReducePhotoSizeOnAndroid';
import BlogCompressGifFilesOnline from './pages/blog/CompressGifFilesOnline';

// New Blog Pages — Batch 3: Office Documents
import BlogCompressWordDocumentOnline from './pages/blog/CompressWordDocumentOnline';
import BlogCompressExcelFiles from './pages/blog/CompressExcelFiles';
import BlogCompressPowerpointWithoutLosingQuality from './pages/blog/CompressPowerpointWithoutLosingQuality';
import BlogReduceWordFileSize from './pages/blog/ReduceWordFileSize';
import BlogCompressFilesOnWindows11 from './pages/blog/CompressFilesOnWindows11';

// New Blog Pages — Batch 4: File Sharing
import BlogCompressFilesForWhatsapp from './pages/blog/CompressFilesForWhatsapp';
import BlogCompressFilesForGoogleDrive from './pages/blog/CompressFilesForGoogleDrive';
import BlogCompressFilesForSlack from './pages/blog/CompressFilesForSlack';
import BlogCompressFilesForDropbox from './pages/blog/CompressFilesForDropbox';
import BlogSendLargeFilesViaEmail from './pages/blog/SendLargeFilesViaEmail';
import BlogShareLargePdfFilesOnline from './pages/blog/ShareLargePdfFilesOnline';

// New Blog Pages — Batch 5: PDF Conversion
import BlogConvertWordToPdf from './pages/blog/ConvertWordToPdf';
import BlogConvertExcelToPdf from './pages/blog/ConvertExcelToPdf';
import BlogConvertPngToPdf from './pages/blog/ConvertPngToPdf';
import BlogConvertPdfToPng from './pages/blog/ConvertPdfToPng';
import BlogConvertPptxToPdf from './pages/blog/ConvertPptxToPdf';
import BlogConvertPdfToJpeg from './pages/blog/ConvertPdfToJpeg';
import BlogConvertPdfToText from './pages/blog/ConvertPdfToText';
import BlogConvertHeicToJpg from './pages/blog/ConvertHeicToJpg';

// New Blog Pages — Batch 6: Tool How-Tos
import BlogExtractTextFromPdfUsingOcr from './pages/blog/ExtractTextFromPdfUsingOcr';
import BlogMergePdfFilesOnlineFree from './pages/blog/MergePdfFilesOnlineFree';
import BlogSplitPdfIntoSeparatePages from './pages/blog/SplitPdfIntoSeparatePages';
import BlogPasswordProtectPdf from './pages/blog/PasswordProtectPdf';
import BlogRemovePasswordFromPdf from './pages/blog/RemovePasswordFromPdf';
import BlogSummarizePdfWithAi from './pages/blog/SummarizePdfWithAi';
import BlogExtractPagesFromPdf from './pages/blog/ExtractPagesFromPdf';
import BlogRotatePdfPagesOnline from './pages/blog/RotatePdfPagesOnline';

// New Blog Pages — Batch 7: Comparisons
import BlogBestFreeAlternativesToAdobeAcrobat from './pages/blog/BestFreeAlternativesToAdobeAcrobat';
import BlogSlimfileVsIlovepdf from './pages/blog/SlimfileVsIlovepdf';
import BlogSlimfileVsSmallpdf from './pages/blog/SlimfileVsSmallpdf';
import BlogBestFreePdfCompressorOnline from './pages/blog/BestFreePdfCompressorOnline';
import BlogBestFreeImageCompressorOnline from './pages/blog/BestFreeImageCompressorOnline';
import BlogBestOcrToolsOnline from './pages/blog/BestOcrToolsOnline';
import BlogBestAiDocumentSummarizersFree from './pages/blog/BestAiDocumentSummarizersFree';
import BlogBestPdfToolsForStudents from './pages/blog/BestPdfToolsForStudents';

// New Blog Pages — Batch 8: Educational / Evergreen
import BlogLosslessVsLossyCompression from './pages/blog/LosslessVsLossyCompression';
import BlogWhatIsAPdf from './pages/blog/WhatIsAPdf';
import BlogWhatIsWebp from './pages/blog/WhatIsWebp';
import BlogWhatIsOcr from './pages/blog/WhatIsOcr';
import BlogHowDpiAffectsPdfFileSize from './pages/blog/HowDpiAffectsPdfFileSize';
import BlogUnderstandingPdfCompressionAlgorithms from './pages/blog/UnderstandingPdfCompressionAlgorithms';
import BlogWhyFileCompressionMattersForSeo from './pages/blog/WhyFileCompressionMattersForSeo';

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
import AILab from './pages/AILab';
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

          {/* New Blog Routes — Batch 1: PDF Compression */}
          <Route path="blog/compress-pdf-without-adobe" element={<BlogCompressPdfWithoutAdobe />} />
          <Route path="blog/reduce-pdf-size-below-1mb" element={<BlogReducePdfSizeBelow1MB />} />
          <Route path="blog/batch-compress-multiple-pdfs" element={<BlogBatchCompressMultiplePdfs />} />
          <Route path="blog/compress-scanned-pdf" element={<BlogCompressScannedPdf />} />
          <Route path="blog/why-is-my-pdf-so-large" element={<BlogWhyIsMypdfSoLarge />} />
          <Route path="blog/compress-pdf-in-chrome" element={<BlogCompressPdfInChrome />} />
          <Route path="blog/compress-pdf-for-printing" element={<BlogCompressPdfForPrinting />} />

          {/* New Blog Routes — Batch 2: Image Compression */}
          <Route path="blog/compress-images-for-instagram" element={<BlogCompressImagesForInstagram />} />
          <Route path="blog/compress-images-for-facebook" element={<BlogCompressImagesForFacebook />} />
          <Route path="blog/compress-images-for-wordpress" element={<BlogCompressImagesForWordpress />} />
          <Route path="blog/compress-images-for-shopify" element={<BlogCompressImagesForShopify />} />
          <Route path="blog/compress-images-for-email" element={<BlogCompressImagesForEmail />} />
          <Route path="blog/reduce-photo-size-on-iphone" element={<BlogReducePhotoSizeOnIphone />} />
          <Route path="blog/reduce-photo-size-on-android" element={<BlogReducePhotoSizeOnAndroid />} />
          <Route path="blog/compress-gif-files-online" element={<BlogCompressGifFilesOnline />} />

          {/* New Blog Routes — Batch 3: Office Documents */}
          <Route path="blog/compress-word-document-online" element={<BlogCompressWordDocumentOnline />} />
          <Route path="blog/compress-excel-files" element={<BlogCompressExcelFiles />} />
          <Route path="blog/compress-powerpoint-without-losing-quality" element={<BlogCompressPowerpointWithoutLosingQuality />} />
          <Route path="blog/reduce-word-file-size" element={<BlogReduceWordFileSize />} />
          <Route path="blog/compress-files-on-windows-11" element={<BlogCompressFilesOnWindows11 />} />

          {/* New Blog Routes — Batch 4: File Sharing */}
          <Route path="blog/compress-files-for-whatsapp" element={<BlogCompressFilesForWhatsapp />} />
          <Route path="blog/compress-files-for-google-drive" element={<BlogCompressFilesForGoogleDrive />} />
          <Route path="blog/compress-files-for-slack" element={<BlogCompressFilesForSlack />} />
          <Route path="blog/compress-files-for-dropbox" element={<BlogCompressFilesForDropbox />} />
          <Route path="blog/send-large-files-via-email" element={<BlogSendLargeFilesViaEmail />} />
          <Route path="blog/share-large-pdf-files-online" element={<BlogShareLargePdfFilesOnline />} />

          {/* New Blog Routes — Batch 5: PDF Conversion */}
          <Route path="blog/convert-word-to-pdf" element={<BlogConvertWordToPdf />} />
          <Route path="blog/convert-excel-to-pdf" element={<BlogConvertExcelToPdf />} />
          <Route path="blog/convert-png-to-pdf" element={<BlogConvertPngToPdf />} />
          <Route path="blog/convert-pdf-to-png" element={<BlogConvertPdfToPng />} />
          <Route path="blog/convert-pptx-to-pdf" element={<BlogConvertPptxToPdf />} />
          <Route path="blog/convert-pdf-to-jpeg" element={<BlogConvertPdfToJpeg />} />
          <Route path="blog/convert-pdf-to-text" element={<BlogConvertPdfToText />} />
          <Route path="blog/convert-heic-to-jpg" element={<BlogConvertHeicToJpg />} />

          {/* New Blog Routes — Batch 6: Tool How-Tos */}
          <Route path="blog/extract-text-from-pdf-using-ocr" element={<BlogExtractTextFromPdfUsingOcr />} />
          <Route path="blog/merge-pdf-files-online-free" element={<BlogMergePdfFilesOnlineFree />} />
          <Route path="blog/split-pdf-into-separate-pages" element={<BlogSplitPdfIntoSeparatePages />} />
          <Route path="blog/password-protect-pdf" element={<BlogPasswordProtectPdf />} />
          <Route path="blog/remove-password-from-pdf" element={<BlogRemovePasswordFromPdf />} />
          <Route path="blog/summarize-pdf-with-ai" element={<BlogSummarizePdfWithAi />} />
          <Route path="blog/extract-pages-from-pdf" element={<BlogExtractPagesFromPdf />} />
          <Route path="blog/rotate-pdf-pages-online" element={<BlogRotatePdfPagesOnline />} />

          {/* New Blog Routes — Batch 7: Comparisons */}
          <Route path="blog/best-free-alternatives-to-adobe-acrobat" element={<BlogBestFreeAlternativesToAdobeAcrobat />} />
          <Route path="blog/slimfile-vs-ilovepdf" element={<BlogSlimfileVsIlovepdf />} />
          <Route path="blog/slimfile-vs-smallpdf" element={<BlogSlimfileVsSmallpdf />} />
          <Route path="blog/best-free-pdf-compressor-online" element={<BlogBestFreePdfCompressorOnline />} />
          <Route path="blog/best-free-image-compressor-online" element={<BlogBestFreeImageCompressorOnline />} />
          <Route path="blog/best-ocr-tools-online" element={<BlogBestOcrToolsOnline />} />
          <Route path="blog/best-ai-document-summarizers-free" element={<BlogBestAiDocumentSummarizersFree />} />
          <Route path="blog/best-pdf-tools-for-students" element={<BlogBestPdfToolsForStudents />} />

          {/* New Blog Routes — Batch 8: Educational */}
          <Route path="blog/lossless-vs-lossy-compression" element={<BlogLosslessVsLossyCompression />} />
          <Route path="blog/what-is-a-pdf" element={<BlogWhatIsAPdf />} />
          <Route path="blog/what-is-webp" element={<BlogWhatIsWebp />} />
          <Route path="blog/what-is-ocr" element={<BlogWhatIsOcr />} />
          <Route path="blog/how-dpi-affects-pdf-file-size" element={<BlogHowDpiAffectsPdfFileSize />} />
          <Route path="blog/understanding-pdf-compression-algorithms" element={<BlogUnderstandingPdfCompressionAlgorithms />} />
          <Route path="blog/why-file-compression-matters-for-seo" element={<BlogWhyFileCompressionMattersForSeo />} />

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
          <Route path="meet" element={<ProtectedRoute><Meet /></ProtectedRoute>} />
          <Route path="ocr-tool" element={<OCRTool />} />
          <Route path="forge" element={<SlimFileForge />} />
          <Route path="lock" element={<SlimFileLock />} />
          <Route path="summarize" element={<SummarizeDocument />} />
          <Route path="ai-lab" element={<AILab />} />
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
        <Route path="meet/:meetingCode" element={<ProtectedRoute><MeetingRoom /></ProtectedRoute>} />

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
