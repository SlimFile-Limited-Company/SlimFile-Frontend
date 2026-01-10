/**
 * Translation Service for SlimFile
 * Supports multiple languages with easy-to-use translation functions
 */

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ja' | 'ar' | 'hi' | 'ru';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

// Translation keys and their values for each language
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'header.home': 'Home',
    'header.features': 'Features',
    'header.pricing': 'Pricing',
    'header.blog': 'Blog',
    'header.login': 'Login',
    'header.signup': 'Sign Up',
    'header.dashboard': 'Dashboard',
    'header.logout': 'Logout',

    // Hero Section
    'hero.title': 'Compress. Convert. Simplify',
    'hero.subtitle': 'All your file tools in one place',
    'hero.cta': 'Get Started',
    'hero.learnMore': 'Learn More',

    // File Upload
    'upload.title': 'Upload Your Files',
    'upload.dragDrop': 'Drag and drop your files here',
    'upload.or': 'or',
    'upload.browse': 'Browse Files',
    'upload.support': 'Support for PDF, Images, PPTX, DOCX, and XLSX files up to 200MB',

    // Compression
    'compress.title': 'Compress Files',
    'compress.subtitle': 'Reduce file size without losing quality',
    'compress.start': 'Start Compressing',
    'compress.complete': 'Compression Complete!',
    'compress.downloading': 'Downloading...',
    'compress.download': 'Download',
    'compress.share': 'Share',
    'compress.reset': 'Compress More',
    'compress.heroTitle': 'Compress Files',
    'compress.heroSubtitle': 'Instantly',
    'compress.heroDescription': 'Reduce file sizes without compromising quality. Support for images, PDFs, and Office documents with',
    'compress.lightningFast': 'lightning-fast processing',
    'compress.feature.fast': 'Lightning Fast',
    'compress.feature.fastDesc': 'Compress in seconds',
    'compress.feature.secure': '100% Secure',
    'compress.feature.secureDesc': 'Client-side processing',
    'compress.feature.available': 'Always Available',
    'compress.feature.availableDesc': '24/7 compression',
    'compress.formatsTitle': 'Supported Compression Formats',
    'compress.imageCompression': 'Image Compression',
    'compress.documentCompression': 'Document Compression',
    'compress.howItWorks': 'How It Works',
    'compress.step1': 'Upload Files',
    'compress.step1Desc': 'Select or drag and drop your files',
    'compress.step2': 'Compress',
    'compress.step2Desc': 'We optimize your files instantly',
    'compress.step3': 'Download',
    'compress.step3Desc': 'Get your compressed files',
    'compress.uploadTitle': 'Upload Your Files',
    'compress.resultsTitle': 'Compression Results',
    'compress.uploadSubtitle': 'Drag and drop your files or click to browse',
    'compress.processingSubtitle': 'Your files are being compressed',
    'compress.whyChoose': 'Why Choose SlimFile?',
    'compress.quality': 'High Quality',
    'compress.qualityDesc': 'Maintain excellent quality while reducing file size',
    'compress.allTypes': 'All File Types',
    'compress.allTypesDesc': 'Support for images, PDFs, and PPTX files',
    'compress.batch': 'Batch Processing',
    'compress.batchDesc': 'Compress multiple files at once',
    'compress.noInstall': 'No Installation',
    'compress.noInstallDesc': 'Works directly in your browser',
    'compress.almostDone': 'Almost Done',
    'compress.hangInThere': 'Hang in there… finalizing compression!',
    'compress.notice': 'Compression Notice',
    'compress.failed': 'Compression Failed',
    'compress.failedDesc': 'There was an error compressing your file. Please try again.',
    'compress.sizeReduced': 'Size reduced by',
    'compress.loginSuccess': 'Login Successful',
    'compress.recompressPrompt': 'Please re-compress your files to download them.',

    // Conversion
    'convert.title': 'Convert Files',
    'convert.subtitle': 'Transform your files between formats',
    'convert.start': 'Start Converting',
    'convert.complete': 'Conversion Complete!',
    'convert.selectFormat': 'Select Format',
    'convert.convertTo': 'Convert to',
    'convert.heroTitle': 'Convert Files',
    'convert.heroSubtitle': 'Seamlessly',
    'convert.heroDescription': 'Transform your files between formats with perfect quality. Support for images, PDFs, and Office documents with',
    'convert.lightningFast': 'lightning-fast processing',
    'convert.feature.fast': 'Lightning Fast',
    'convert.feature.fastDesc': 'Convert in seconds',
    'convert.feature.secure': '100% Secure',
    'convert.feature.secureDesc': 'Client-side processing',
    'convert.feature.available': 'Always Available',
    'convert.feature.availableDesc': '24/7 conversion',
    'convert.conversionsTitle': 'Supported Conversions',
    'convert.imageConversions': 'Image Conversions',
    'convert.documentConversions': 'Document Conversions',
    'convert.howItWorks': 'How It Works',
    'convert.step1': 'Upload Files',
    'convert.step1Desc': 'Select or drag and drop your files',
    'convert.step2': 'Convert',
    'convert.step2Desc': 'We transform your files instantly',
    'convert.step3': 'Download',
    'convert.step3Desc': 'Get your converted files',
    'convert.uploadTitle': 'Upload Your Files',
    'convert.chooseFormat': 'Choose Output Format',
    'convert.resultsTitle': 'Conversion Results',
    'convert.uploadSubtitle': 'Drag and drop your files or click to browse',
    'convert.selectFormatSubtitle': 'Select the format you want to convert to',
    'convert.processingSubtitle': 'Your files are being converted',
    'convert.selectedFiles': 'Selected file',
    'convert.selectedFilesPlural': 'Selected files',
    'convert.convertToLabel': 'Convert to:',
    'convert.convertButton': 'Convert to',
    'convert.cancel': 'Cancel',
    'convert.whyChoose': 'Why Choose SlimFile?',
    'convert.quality': 'Perfect Quality',
    'convert.qualityDesc': 'Maintain excellent quality during conversion',
    'convert.allTypes': 'All File Types',
    'convert.allTypesDesc': 'Support for images, PDFs, and Office documents',
    'convert.batch': 'Batch Processing',
    'convert.batchDesc': 'Convert multiple files at once',
    'convert.noInstall': 'No Installation',
    'convert.noInstallDesc': 'Works directly in your browser',
    'convert.notice': 'Conversion Notice',
    'convert.failed': 'Conversion Failed',
    'convert.failedDesc': 'There was an error converting your file. Please try again.',
    'convert.successDesc': 'File converted successfully to',
    'convert.loginSuccess': 'Login Successful',
    'convert.reconvertPrompt': 'Please re-convert your files to download them.',

    // Convert & Compress
    'convertCompress.title': 'Convert & Compress',
    'convertCompress.subtitle': 'All in One',
    'convertCompress.heroDescription': 'Transform your files between formats and optimize their size in a single step. Perfect quality with',
    'convertCompress.maxEfficiency': 'maximum efficiency',
    'convertCompress.convertLabel': 'Convert',
    'convertCompress.compressLabel': 'Compress',
    'convertCompress.start': 'Start Processing',
    'convertCompress.feature.twoInOne': 'Two-in-One',
    'convertCompress.feature.twoInOneDesc': 'Convert and compress together',
    'convertCompress.feature.secure': '100% Secure',
    'convertCompress.feature.secureDesc': 'Client-side processing',
    'convertCompress.feature.timeSaver': 'Time Saver',
    'convertCompress.feature.timeSaverDesc': 'Single step processing',
    'convertCompress.formatsTitle': 'Supported Formats',
    'convertCompress.imageFormats': 'Image Formats',
    'convertCompress.documentFormats': 'Document Formats',
    'convertCompress.howItWorks': 'How It Works',
    'convertCompress.step1': 'Upload Files',
    'convertCompress.step1Desc': 'Select or drag and drop your files',
    'convertCompress.step2': 'Convert & Compress',
    'convertCompress.step2Desc': 'We transform and optimize your files',
    'convertCompress.step3': 'Download',
    'convertCompress.step3Desc': 'Get your converted and compressed files',
    'convertCompress.uploadTitle': 'Upload Your Files',
    'convertCompress.chooseFormat': 'Choose Output Format',
    'convertCompress.resultsTitle': 'Processing Results',
    'convertCompress.uploadSubtitle': 'Drag and drop your files or click to browse',
    'convertCompress.selectFormatSubtitle': 'Select the format you want to convert to',
    'convertCompress.processingSubtitle': 'Your files are being converted and compressed',
    'convertCompress.selectedFiles': 'Selected file',
    'convertCompress.selectedFilesPlural': 'Selected files',
    'convertCompress.convertToLabel': 'Convert to:',
    'convertCompress.processButton': 'Convert & Compress to',
    'convertCompress.cancel': 'Cancel',
    'convertCompress.whyChoose': 'Why Choose SlimFile?',
    'convertCompress.quality': 'Perfect Quality',
    'convertCompress.qualityDesc': 'Maintain excellent quality while converting and compressing',
    'convertCompress.efficiency': 'Maximum Efficiency',
    'convertCompress.efficiencyDesc': 'Get both conversion and compression in one step',
    'convertCompress.batch': 'Batch Processing',
    'convertCompress.batchDesc': 'Process multiple files simultaneously',
    'convertCompress.noInstall': 'No Installation',
    'convertCompress.noInstallDesc': 'Works directly in your browser',
    'convertCompress.converting': 'Converting...',
    'convertCompress.compressing': 'Compressing...',
    'convertCompress.complete': 'Complete',
    'convertCompress.notice': 'Processing Notice',
    'convertCompress.failed': 'Processing Failed',
    'convertCompress.failedDesc': 'There was an error processing your file. Please try again.',
    'convertCompress.successTitle': 'Processing Complete!',
    'convertCompress.successDesc': 'File converted to',
    'convertCompress.sizeReduced': 'and compressed. Size reduced by',
    'convertCompress.loginSuccess': 'Login Successful',
    'convertCompress.reprocessPrompt': 'Please re-process your files to download them.',

    // Common
    'common.processing': 'Processing...',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.loading': 'Loading...',
    'common.saveToCloud': 'Save to Cloud',

    // Footer
    'footer.about': 'About Us',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': 'All rights reserved',
    'footer.compressionTools': 'Compression Tools',
    'footer.compressPdf': 'Compress PDF Online',
    'footer.compressPptx': 'Compress PPTX Online',
    'footer.compressImages': 'Compress Images Online',
    'footer.compressPdfEmail': 'Compress PDF for Email',
    'footer.ourBlog': 'Our Blog Posts',
    'footer.viewAll': 'View All',
    'footer.pdfGuides': 'PDF Guides',
    'footer.imageOptimization': 'Image Optimization',
    'footer.documentMedia': 'Document & Media',
    'footer.performanceStrategy': 'Performance & Strategy',
    'footer.quickAccess': 'Quick Access',
    'footer.product': 'Product',
    'footer.compress': 'Compress',
    'footer.convertOnly': 'Convert Only',
    'footer.convertCompress': 'Convert and Compress',
    'footer.game': 'Game',
    'footer.features': 'Features',
    'footer.whyCompression': 'Why Compression?',
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.caseStudies': 'Case Studies',
    'footer.globalImpact': 'Global Impact',
    'footer.partnerships': 'Partnerships',
    'footer.sdgs': 'SDGs',
    'footer.ourBlogs': 'Our Blogs',
    'footer.contact': 'Contact',
    'footer.slimfileApi': 'SlimFile API',
    'footer.apiDashboard': 'API Dashboard',
    'footer.developerProgram': 'Developer Program',
    'footer.apiPricing': 'API Pricing',
    'footer.stepsbuild': 'STEPsBuild',
    'footer.resources': 'Resources',
    'footer.documentation': 'Documentation',
    'footer.copyright': '© 2025 SlimFile. Compress • Convert • Simplify',
  },

  es: {
    // Header
    'header.home': 'Inicio',
    'header.features': 'Características',
    'header.pricing': 'Precios',
    'header.blog': 'Blog',
    'header.login': 'Iniciar Sesión',
    'header.signup': 'Registrarse',
    'header.dashboard': 'Panel',
    'header.logout': 'Cerrar Sesión',

    // Hero Section
    'hero.title': 'Comprimir. Convertir. Simplificar',
    'hero.subtitle': 'Todas tus herramientas de archivos en un solo lugar',
    'hero.cta': 'Comenzar',
    'hero.learnMore': 'Aprende Más',

    // File Upload
    'upload.title': 'Sube Tus Archivos',
    'upload.dragDrop': 'Arrastra y suelta tus archivos aquí',
    'upload.or': 'o',
    'upload.browse': 'Explorar Archivos',
    'upload.support': 'Soporte para archivos PDF, Imágenes, PPTX, DOCX y XLSX hasta 200MB',

    // Compression
    'compress.title': 'Comprimir Archivos',
    'compress.subtitle': 'Reduce el tamaño sin perder calidad',
    'compress.start': 'Comenzar Compresión',
    'compress.complete': '¡Compresión Completa!',
    'compress.downloading': 'Descargando...',
    'compress.download': 'Descargar',
    'compress.share': 'Compartir',
    'compress.reset': 'Comprimir Más',
    'compress.heroTitle': 'Comprimir Archivos',
    'compress.heroSubtitle': 'Instantáneamente',
    'compress.heroDescription': 'Reduce el tamaño de los archivos sin comprometer la calidad. Soporte para imágenes, PDFs y documentos de Office con',
    'compress.lightningFast': 'procesamiento ultrarrápido',
    'compress.feature.fast': 'Ultrarrápido',
    'compress.feature.fastDesc': 'Comprime en segundos',
    'compress.feature.secure': '100% Seguro',
    'compress.feature.secureDesc': 'Procesamiento del lado del cliente',
    'compress.feature.available': 'Siempre Disponible',
    'compress.feature.availableDesc': 'Compresión 24/7',
    'compress.formatsTitle': 'Formatos de Compresión Compatibles',
    'compress.imageCompression': 'Compresión de Imágenes',
    'compress.documentCompression': 'Compresión de Documentos',
    'compress.howItWorks': 'Cómo Funciona',
    'compress.step1': 'Subir Archivos',
    'compress.step1Desc': 'Selecciona o arrastra y suelta tus archivos',
    'compress.step2': 'Comprimir',
    'compress.step2Desc': 'Optimizamos tus archivos al instante',
    'compress.step3': 'Descargar',
    'compress.step3Desc': 'Obtén tus archivos comprimidos',
    'compress.uploadTitle': 'Sube Tus Archivos',
    'compress.resultsTitle': 'Resultados de Compresión',
    'compress.uploadSubtitle': 'Arrastra y suelta tus archivos o haz clic para explorar',
    'compress.processingSubtitle': 'Tus archivos se están comprimiendo',
    'compress.whyChoose': '¿Por Qué Elegir SlimFile?',
    'compress.quality': 'Alta Calidad',
    'compress.qualityDesc': 'Mantén una excelente calidad mientras reduces el tamaño',
    'compress.allTypes': 'Todos los Tipos de Archivos',
    'compress.allTypesDesc': 'Soporte para imágenes, PDFs y archivos PPTX',
    'compress.batch': 'Procesamiento por Lotes',
    'compress.batchDesc': 'Comprime múltiples archivos a la vez',
    'compress.noInstall': 'Sin Instalación',
    'compress.noInstallDesc': 'Funciona directamente en tu navegador',
    'compress.almostDone': 'Casi Listo',
    'compress.hangInThere': '¡Aguanta! Finalizando la compresión...',
    'compress.notice': 'Aviso de Compresión',
    'compress.failed': 'Compresión Fallida',
    'compress.failedDesc': 'Hubo un error al comprimir tu archivo. Por favor, inténtalo de nuevo.',
    'compress.sizeReduced': 'Tamaño reducido en',
    'compress.loginSuccess': 'Inicio de Sesión Exitoso',
    'compress.recompressPrompt': 'Por favor, vuelve a comprimir tus archivos para descargarlos.',

    // Conversion
    'convert.title': 'Convertir Archivos',
    'convert.subtitle': 'Transforma tus archivos entre formatos',
    'convert.start': 'Comenzar Conversión',
    'convert.complete': '¡Conversión Completa!',
    'convert.selectFormat': 'Seleccionar Formato',
    'convert.convertTo': 'Convertir a',

    // Common
    'common.processing': 'Procesando...',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.close': 'Cerrar',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.loading': 'Cargando...',
    'common.saveToCloud': 'Guardar en la Nube',

    // Footer
    'footer.about': 'Sobre Nosotros',
    'footer.contact': 'Contacto',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.rights': 'Todos los derechos reservados',
  },

  fr: {
    // Header
    'header.home': 'Accueil',
    'header.features': 'Fonctionnalités',
    'header.pricing': 'Tarifs',
    'header.blog': 'Blog',
    'header.login': 'Connexion',
    'header.signup': 'S\'inscrire',
    'header.dashboard': 'Tableau de Bord',
    'header.logout': 'Déconnexion',

    // Hero Section
    'hero.title': 'Compresser. Convertir. Simplifier',
    'hero.subtitle': 'Tous vos outils de fichiers en un seul endroit',
    'hero.cta': 'Commencer',
    'hero.learnMore': 'En Savoir Plus',

    // File Upload
    'upload.title': 'Téléchargez Vos Fichiers',
    'upload.dragDrop': 'Glissez-déposez vos fichiers ici',
    'upload.or': 'ou',
    'upload.browse': 'Parcourir les Fichiers',
    'upload.support': 'Support pour les fichiers PDF, Images, PPTX, DOCX et XLSX jusqu\'à 200MB',

    // Compression
    'compress.title': 'Compresser les Fichiers',
    'compress.subtitle': 'Réduire la taille sans perte de qualité',
    'compress.start': 'Commencer la Compression',
    'compress.complete': 'Compression Terminée!',
    'compress.downloading': 'Téléchargement...',
    'compress.download': 'Télécharger',
    'compress.share': 'Partager',
    'compress.reset': 'Compresser Plus',

    // Conversion
    'convert.title': 'Convertir les Fichiers',
    'convert.subtitle': 'Transformez vos fichiers entre formats',
    'convert.start': 'Commencer la Conversion',
    'convert.complete': 'Conversion Terminée!',
    'convert.selectFormat': 'Sélectionner le Format',
    'convert.convertTo': 'Convertir en',

    // Common
    'common.processing': 'Traitement...',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.close': 'Fermer',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.loading': 'Chargement...',
    'common.saveToCloud': 'Enregistrer dans le Cloud',

    // Footer
    'footer.about': 'À Propos',
    'footer.contact': 'Contact',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    'footer.rights': 'Tous droits réservés',
  },

  de: {
    // Header
    'header.home': 'Startseite',
    'header.features': 'Funktionen',
    'header.pricing': 'Preise',
    'header.blog': 'Blog',
    'header.login': 'Anmelden',
    'header.signup': 'Registrieren',
    'header.dashboard': 'Dashboard',
    'header.logout': 'Abmelden',

    // Hero Section
    'hero.title': 'Komprimieren. Konvertieren. Vereinfachen',
    'hero.subtitle': 'Alle Ihre Datei-Tools an einem Ort',
    'hero.cta': 'Loslegen',
    'hero.learnMore': 'Mehr Erfahren',

    // File Upload
    'upload.title': 'Laden Sie Ihre Dateien Hoch',
    'upload.dragDrop': 'Ziehen Sie Ihre Dateien hierher',
    'upload.or': 'oder',
    'upload.browse': 'Dateien Durchsuchen',
    'upload.support': 'Unterstützung für PDF, Bilder, PPTX, DOCX und XLSX Dateien bis 200MB',

    // Compression
    'compress.title': 'Dateien Komprimieren',
    'compress.subtitle': 'Dateigröße ohne Qualitätsverlust reduzieren',
    'compress.start': 'Komprimierung Starten',
    'compress.complete': 'Komprimierung Abgeschlossen!',
    'compress.downloading': 'Wird heruntergeladen...',
    'compress.download': 'Herunterladen',
    'compress.share': 'Teilen',
    'compress.reset': 'Mehr Komprimieren',

    // Conversion
    'convert.title': 'Dateien Konvertieren',
    'convert.subtitle': 'Transformieren Sie Ihre Dateien zwischen Formaten',
    'convert.start': 'Konvertierung Starten',
    'convert.complete': 'Konvertierung Abgeschlossen!',
    'convert.selectFormat': 'Format Auswählen',
    'convert.convertTo': 'Konvertieren zu',

    // Common
    'common.processing': 'Wird verarbeitet...',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.close': 'Schließen',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.loading': 'Wird geladen...',
    'common.saveToCloud': 'In Cloud Speichern',

    // Footer
    'footer.about': 'Über Uns',
    'footer.contact': 'Kontakt',
    'footer.privacy': 'Datenschutzrichtlinie',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.rights': 'Alle Rechte vorbehalten',
  },

  pt: {
    // Header
    'header.home': 'Início',
    'header.features': 'Recursos',
    'header.pricing': 'Preços',
    'header.blog': 'Blog',
    'header.login': 'Entrar',
    'header.signup': 'Cadastrar',
    'header.dashboard': 'Painel',
    'header.logout': 'Sair',

    // Hero Section
    'hero.title': 'Comprimir. Converter. Simplificar',
    'hero.subtitle': 'Todas as suas ferramentas de arquivo em um só lugar',
    'hero.cta': 'Começar',
    'hero.learnMore': 'Saiba Mais',

    // File Upload
    'upload.title': 'Envie Seus Arquivos',
    'upload.dragDrop': 'Arraste e solte seus arquivos aqui',
    'upload.or': 'ou',
    'upload.browse': 'Procurar Arquivos',
    'upload.support': 'Suporte para arquivos PDF, Imagens, PPTX, DOCX e XLSX até 200MB',

    // Compression
    'compress.title': 'Comprimir Arquivos',
    'compress.subtitle': 'Reduza o tamanho sem perder qualidade',
    'compress.start': 'Iniciar Compressão',
    'compress.complete': 'Compressão Concluída!',
    'compress.downloading': 'Baixando...',
    'compress.download': 'Baixar',
    'compress.share': 'Compartilhar',
    'compress.reset': 'Comprimir Mais',

    // Conversion
    'convert.title': 'Converter Arquivos',
    'convert.subtitle': 'Transforme seus arquivos entre formatos',
    'convert.start': 'Iniciar Conversão',
    'convert.complete': 'Conversão Concluída!',
    'convert.selectFormat': 'Selecionar Formato',
    'convert.convertTo': 'Converter para',

    // Common
    'common.processing': 'Processando...',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.close': 'Fechar',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.loading': 'Carregando...',
    'common.saveToCloud': 'Salvar na Nuvem',

    // Footer
    'footer.about': 'Sobre Nós',
    'footer.contact': 'Contato',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
    'footer.rights': 'Todos os direitos reservados',
  },

  zh: {
    // Header
    'header.home': '首页',
    'header.features': '功能',
    'header.pricing': '价格',
    'header.blog': '博客',
    'header.login': '登录',
    'header.signup': '注册',
    'header.dashboard': '仪表板',
    'header.logout': '登出',

    // Hero Section
    'hero.title': '压缩。转换。简化',
    'hero.subtitle': '您所有的文件工具集于一处',
    'hero.cta': '开始使用',
    'hero.learnMore': '了解更多',

    // File Upload
    'upload.title': '上传您的文件',
    'upload.dragDrop': '拖放文件到这里',
    'upload.or': '或',
    'upload.browse': '浏览文件',
    'upload.support': '支持PDF、图片、PPTX、DOCX和XLSX文件，最大200MB',

    // Compression
    'compress.title': '压缩文件',
    'compress.subtitle': '在不损失质量的情况下减小文件大小',
    'compress.start': '开始压缩',
    'compress.complete': '压缩完成！',
    'compress.downloading': '下载中...',
    'compress.download': '下载',
    'compress.share': '分享',
    'compress.reset': '压缩更多',

    // Conversion
    'convert.title': '转换文件',
    'convert.subtitle': '在不同格式之间转换文件',
    'convert.start': '开始转换',
    'convert.complete': '转换完成！',
    'convert.selectFormat': '选择格式',
    'convert.convertTo': '转换为',

    // Common
    'common.processing': '处理中...',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.close': '关闭',
    'common.error': '错误',
    'common.success': '成功',
    'common.loading': '加载中...',
    'common.saveToCloud': '保存到云端',

    // Footer
    'footer.about': '关于我们',
    'footer.contact': '联系我们',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.rights': '版权所有',
  },

  ja: {
    // Header
    'header.home': 'ホーム',
    'header.features': '機能',
    'header.pricing': '価格',
    'header.blog': 'ブログ',
    'header.login': 'ログイン',
    'header.signup': '登録',
    'header.dashboard': 'ダッシュボード',
    'header.logout': 'ログアウト',

    // Hero Section
    'hero.title': '圧縮。変換。簡素化',
    'hero.subtitle': 'すべてのファイルツールを一箇所に',
    'hero.cta': '始める',
    'hero.learnMore': '詳しく見る',

    // File Upload
    'upload.title': 'ファイルをアップロード',
    'upload.dragDrop': 'ファイルをここにドラッグ＆ドロップ',
    'upload.or': 'または',
    'upload.browse': 'ファイルを参照',
    'upload.support': 'PDF、画像、PPTX、DOCX、XLSXファイルを最大200MBまでサポート',

    // Compression
    'compress.title': 'ファイルを圧縮',
    'compress.subtitle': '品質を損なわずにファイルサイズを削減',
    'compress.start': '圧縮を開始',
    'compress.complete': '圧縮完了！',
    'compress.downloading': 'ダウンロード中...',
    'compress.download': 'ダウンロード',
    'compress.share': '共有',
    'compress.reset': 'さらに圧縮',

    // Conversion
    'convert.title': 'ファイルを変換',
    'convert.subtitle': 'ファイルを異なる形式に変換',
    'convert.start': '変換を開始',
    'convert.complete': '変換完了！',
    'convert.selectFormat': 'フォーマットを選択',
    'convert.convertTo': '変換先',

    // Common
    'common.processing': '処理中...',
    'common.cancel': 'キャンセル',
    'common.save': '保存',
    'common.close': '閉じる',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.loading': '読み込み中...',
    'common.saveToCloud': 'クラウドに保存',

    // Footer
    'footer.about': '会社概要',
    'footer.contact': 'お問い合わせ',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.rights': '全著作権所有',
  },

  ar: {
    // Header
    'header.home': 'الرئيسية',
    'header.features': 'المميزات',
    'header.pricing': 'الأسعار',
    'header.blog': 'المدونة',
    'header.login': 'تسجيل الدخول',
    'header.signup': 'التسجيل',
    'header.dashboard': 'لوحة التحكم',
    'header.logout': 'تسجيل الخروج',

    // Hero Section
    'hero.title': 'ضغط. تحويل. تبسيط',
    'hero.subtitle': 'جميع أدوات الملفات في مكان واحد',
    'hero.cta': 'ابدأ الآن',
    'hero.learnMore': 'اعرف المزيد',

    // File Upload
    'upload.title': 'ارفع ملفاتك',
    'upload.dragDrop': 'اسحب وأفلت ملفاتك هنا',
    'upload.or': 'أو',
    'upload.browse': 'تصفح الملفات',
    'upload.support': 'دعم لملفات PDF والصور وPPTX وDOCX وXLSX حتى 200 ميجابايت',

    // Compression
    'compress.title': 'ضغط الملفات',
    'compress.subtitle': 'تقليل حجم الملف دون فقدان الجودة',
    'compress.start': 'بدء الضغط',
    'compress.complete': 'اكتمل الضغط!',
    'compress.downloading': 'جاري التنزيل...',
    'compress.download': 'تحميل',
    'compress.share': 'مشاركة',
    'compress.reset': 'ضغط المزيد',

    // Conversion
    'convert.title': 'تحويل الملفات',
    'convert.subtitle': 'حول ملفاتك بين التنسيقات',
    'convert.start': 'بدء التحويل',
    'convert.complete': 'اكتمل التحويل!',
    'convert.selectFormat': 'اختر التنسيق',
    'convert.convertTo': 'تحويل إلى',

    // Common
    'common.processing': 'جاري المعالجة...',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.close': 'إغلاق',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.loading': 'جاري التحميل...',
    'common.saveToCloud': 'حفظ في السحابة',

    // Footer
    'footer.about': 'من نحن',
    'footer.contact': 'اتصل بنا',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
    'footer.rights': 'جميع الحقوق محفوظة',
  },

  hi: {
    // Header
    'header.home': 'होम',
    'header.features': 'फीचर्स',
    'header.pricing': 'मूल्य निर्धारण',
    'header.blog': 'ब्लॉग',
    'header.login': 'लॉग इन',
    'header.signup': 'साइन अप',
    'header.dashboard': 'डैशबोर्ड',
    'header.logout': 'लॉग आउट',

    // Hero Section
    'hero.title': 'संपीड़ित करें। परिवर्तित करें। सरल बनाएं',
    'hero.subtitle': 'आपके सभी फ़ाइल टूल एक जगह',
    'hero.cta': 'शुरू करें',
    'hero.learnMore': 'और जानें',

    // File Upload
    'upload.title': 'अपनी फ़ाइलें अपलोड करें',
    'upload.dragDrop': 'अपनी फ़ाइलों को यहाँ खींचें और छोड़ें',
    'upload.or': 'या',
    'upload.browse': 'फ़ाइलें ब्राउज़ करें',
    'upload.support': '200MB तक की PDF, इमेज, PPTX, DOCX और XLSX फ़ाइलों के लिए समर्थन',

    // Compression
    'compress.title': 'फ़ाइलें संपीड़ित करें',
    'compress.subtitle': 'गुणवत्ता खोए बिना फ़ाइल का आकार कम करें',
    'compress.start': 'संपीड़न शुरू करें',
    'compress.complete': 'संपीड़न पूर्ण!',
    'compress.downloading': 'डाउनलोड हो रहा है...',
    'compress.download': 'डाउनलोड',
    'compress.share': 'शेयर करें',
    'compress.reset': 'अधिक संपीड़ित करें',

    // Conversion
    'convert.title': 'फ़ाइलें परिवर्तित करें',
    'convert.subtitle': 'अपनी फ़ाइलों को प्रारूपों के बीच रूपांतरित करें',
    'convert.start': 'रूपांतरण शुरू करें',
    'convert.complete': 'रूपांतरण पूर्ण!',
    'convert.selectFormat': 'प्रारूप चुनें',
    'convert.convertTo': 'में परिवर्तित करें',

    // Common
    'common.processing': 'प्रोसेसिंग...',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.close': 'बंद करें',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.loading': 'लोड हो रहा है...',
    'common.saveToCloud': 'क्लाउड में सहेजें',

    // Footer
    'footer.about': 'हमारे बारे में',
    'footer.contact': 'संपर्क',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.rights': 'सर्वाधिकार सुरक्षित',
  },

  ru: {
    // Header
    'header.home': 'Главная',
    'header.features': 'Функции',
    'header.pricing': 'Цены',
    'header.blog': 'Блог',
    'header.login': 'Войти',
    'header.signup': 'Регистрация',
    'header.dashboard': 'Панель',
    'header.logout': 'Выйти',

    // Hero Section
    'hero.title': 'Сжимать. Конвертировать. Упрощать',
    'hero.subtitle': 'Все ваши инструменты для работы с файлами в одном месте',
    'hero.cta': 'Начать',
    'hero.learnMore': 'Узнать Больше',

    // File Upload
    'upload.title': 'Загрузите Ваши Файлы',
    'upload.dragDrop': 'Перетащите файлы сюда',
    'upload.or': 'или',
    'upload.browse': 'Обзор Файлов',
    'upload.support': 'Поддержка файлов PDF, изображений, PPTX, DOCX и XLSX до 200MB',

    // Compression
    'compress.title': 'Сжать Файлы',
    'compress.subtitle': 'Уменьшите размер файла без потери качества',
    'compress.start': 'Начать Сжатие',
    'compress.complete': 'Сжатие Завершено!',
    'compress.downloading': 'Загрузка...',
    'compress.download': 'Скачать',
    'compress.share': 'Поделиться',
    'compress.reset': 'Сжать Ещё',

    // Conversion
    'convert.title': 'Конвертировать Файлы',
    'convert.subtitle': 'Преобразуйте файлы между форматами',
    'convert.start': 'Начать Конвертацию',
    'convert.complete': 'Конвертация Завершена!',
    'convert.selectFormat': 'Выбрать Формат',
    'convert.convertTo': 'Конвертировать в',

    // Common
    'common.processing': 'Обработка...',
    'common.cancel': 'Отменить',
    'common.save': 'Сохранить',
    'common.close': 'Закрыть',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.loading': 'Загрузка...',
    'common.saveToCloud': 'Сохранить в Облако',

    // Footer
    'footer.about': 'О Нас',
    'footer.contact': 'Контакты',
    'footer.privacy': 'Политика Конфиденциальности',
    'footer.terms': 'Условия Использования',
    'footer.rights': 'Все права защищены',
  },
};

/**
 * Get the current language from localStorage
 */
export function getCurrentLanguage(): Language {
  const stored = localStorage.getItem('slimfile-language');
  if (stored && isValidLanguage(stored)) {
    return stored as Language;
  }

  // Try to detect browser language
  const browserLang = navigator.language.split('-')[0];
  if (isValidLanguage(browserLang)) {
    return browserLang as Language;
  }

  return 'en'; // Default to English
}

/**
 * Set the current language
 */
export function setLanguage(language: Language): void {
  localStorage.setItem('slimfile-language', language);
  // Trigger a custom event so components can react
  window.dispatchEvent(new CustomEvent('languagechange', { detail: language }));
}

/**
 * Check if a language code is valid
 */
function isValidLanguage(code: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
}

/**
 * Get a translation by key
 */
export function t(key: string, language?: Language): string {
  const lang = language || getCurrentLanguage();
  return translations[lang][key] || translations.en[key] || key;
}

/**
 * Get language info by code
 */
export function getLanguageInfo(code: Language): LanguageOption | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}
