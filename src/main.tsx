import './index.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import GlobalImpact from './pages/GlobalImpact';
import Dashboard from './pages/Dashboard';
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

// Blog Pages
import BlogHowToCompressPdfForEmail from './pages/blog/HowToCompressPdfForEmail';
import BlogBestToolsToCompressImagesOnline from './pages/blog/BestToolsToCompressImagesOnline';
import BlogCompressPptxPresentationsWithoutLosingQuality from './pages/blog/CompressPptxPresentationsWithoutLosingQuality';
import BlogReducePdfFileSizeOnMobile from './pages/blog/ReducePdfFileSizeOnMobile';
import BlogHowToCompressFilesForFasterWebsiteLoading from './pages/blog/HowToCompressFilesForFasterWebsiteLoading';
import ScrollToTop from './components/ScrollToTop';
import BlogWhyFileCompressionIsEssentialForRemoteWork from './pages/blog/WhyFileCompressionIsEssentialForRemoteWork';
import BlogCompressingPdfForPrintingVsEmailing from './pages/blog/CompressingPdfForPrintingVsEmailing';
import BlogHowToCompressLargeVideosBeforeUploading from './pages/blog/HowToCompressLargeVideosBeforeUploading';
import OurBlogs from './pages/OurBlogs';

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

ReactDOM.createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="compress" element={<Compress />} />
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
          <Route path="global-impact" element={<GlobalImpact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

// Add Google Identity Services script
const script = document.createElement('script');
script.src = 'https://accounts.google.com/gsi/client';
script.async = true;
script.defer = true;
document.body.appendChild(script);
