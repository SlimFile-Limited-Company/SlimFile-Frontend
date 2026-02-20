import { Header } from '../components/Header';

const teamMembers = [
  {
    name: 'Isaac Abakah',
    role: 'CEO and Founder',
    bio: 'Leads SlimFile vision, guiding innovation, strategy, and long-term product growth with excellence.',
    image: '/lovable-uploads/Isaac.jpg',
    linkedin: 'https://www.linkedin.com/in/isaac-abakah',
  },

  {
    name: 'Abel Abendin',
    role: 'FullStack Developer',
    bio: 'Builds secure fullstack systems powering SlimFile’s fast, reliable, and scalable compression platform.',
    image: '/lovable-uploads/Abel-New.png',
    
  },

  {
    name: 'Selorm Sem',
    role: 'MERN Stack Developer',
    bio: 'Develops efficient MERN applications supporting SlimFile’s seamless performance and user-focused functionality.',
    image: '/lovable-uploads/Selorm.jpg',
    
  },

  {
    name: 'Kofi Atta Agyare',
    role: 'Frontend Developer',
    bio: 'Creates responsive interfaces that improve SlimFile usability, accessibility, and overall user experience consistently.',
    image: '/lovable-uploads/Atta.png',
    
  },

  {
    name: 'Juliet Angaandi',
    role: 'Frontend Developer',
    bio: 'Designs polished user interfaces that elevate SlimFile’s appearance, navigation, and interactive experience effectively.',
    image: '/lovable-uploads/Juliet-1.png',
    
  },

  {
    name: 'Micheal Selby',
    role: 'Backend Developer',
    bio: 'Builds strong backend systems powering SlimFile’s core compression speed, accuracy, and overall reliability.',
    image: '/lovable-uploads/Selby.png',
    
  },

  {
    name: 'Broderick Djan',
    role: 'Motion Designer',
    bio: 'Creates motion graphics enhancing SlimFile storytelling, brand communication, and overall visual engagement effectively.',
    image: '/lovable-uploads/Maxi.png',
    
  },

  {
    name: 'Ferdinand Ofei',
    role: 'UI/UX Designer',
    bio: 'Designs intuitive interfaces focused on simplicity, ensuring SlimFile remains seamless, accessible, and user-centered.',
    image: '/lovable-uploads/Ferdinand-New.png',
    
  },

  {
    name: 'Kofi Obuom Agyare',
    role: 'UI/UX Designer',
    bio: 'Creates user-focused design systems that improve SlimFile functionality, clarity, and the overall experience.',
    image: '/lovable-uploads/OB.png',
    
  },

  {
    name: 'Nii Teiko Aryee',
    role: 'UI/UX Designer',
    bio: 'Designs clean user flows improving SlimFile’s ease-of-use, visual appeal, and interaction consistency globally.',
    image: '/lovable-uploads/Nii.jpg',
    
  },

  {
    name: 'Edward',
    role: 'Graphic Designer',
    bio: 'Creates engaging graphics supporting SlimFile branding, communication, and promotional content across multiple platforms.',
    image: '/lovable-uploads/Edward.png',
    
  },

  {
    name: 'Penuel Sablah',
    role: 'Graphic Designer',
    bio: 'Produces high-quality visuals enhancing SlimFile’s branding, user messaging, and product presentation effectively.',
    image: '/lovable-uploads/Penuel.jpg',
    
  },

  {
    name: 'Emmanuel Abakah',
    role: 'Chief Executive Officer',
    bio: 'Provides leadership direction ensuring SlimFile growth, strategic planning, and sustainable operational excellence.',
    image: '/lovable-uploads/Emmanuel.jpg',
    
  },

  {
    name: 'Godfred Agbosu',
    role: 'Partnership Head',
    bio: 'Builds strong partnerships expanding SlimFile reach, securing collaborations, and strengthening long-term external relationships.',
    image: '/lovable-uploads/Godfred-New.png',
    
  },

  {
    name: 'Marlyn',
    role: 'Legal Expert',
    bio: 'Provides legal guidance protecting SlimFile operations, compliance, partnerships, and intellectual property rights consistently.',
    image: '/lovable-uploads/Marlyn.png',

  },

  {
    name: 'Munira Nuhu',
    role: 'Research Lead',
    bio: 'Leads research initiatives improving SlimFile technology, user insights, product development, and overall innovation.',
    image: '/lovable-uploads/munira.png',
    
  },

  {
    name: 'Joel Eli Tsewabge',
    role: 'Analytical Expert',
    bio: 'Analyzes performance metrics guiding SlimFile improvements, strategy decisions, and data-driven feature enhancements.',
    image: '/lovable-uploads/Joel-new.png',
    
  },

  {
    name: 'Helena Amoabeng',
    role: 'Digital Marketer',
    bio: 'Leads digital campaigns growing SlimFile audience, increasing engagement, and strengthening long-term online presence.',
    image: '/lovable-uploads/Helena.png',
  
  },

  {
    name: 'Veronica Akwojinga',
    role: 'Linkedin Marketer',
    bio: 'Drives LinkedIn strategies connecting SlimFile with professionals, brands, and high-value partnership opportunities.',
    image: '/lovable-uploads/Veronica-new.png',
    
  },
];


export default function Teams() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d0a0a] via-[#4a0000] to-[#1a0000]">
      <Header />
      
      <div className="pt-24">
        {/* Hero Section */}
        <div className="relative py-12 md:py-16 lg:py-20 px-4 overflow-hidden">
          {/* Background atmospheric lights */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-red-600 rounded-full blur-[150px] opacity-60"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-red-500 rounded-full blur-[100px] opacity-50"></div>
          </div>

          {/* Content Container */}
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-center">
              
              {/* Left Section - Meet Our Team */}
              <div className="text-center lg:text-right order-2 lg:order-1">
                <div className="inline-block border-2 border-red-600/50 rounded-2xl px-6 md:px-8 py-3 md:py-4 mb-4 md:mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Meet Our Team</h2>
                </div>
                <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-md mx-auto lg:ml-auto px-4 md:px-0">
  At SlimFile, our strength comes from the talented individuals working behind the scenes to build the future of file compression. We are a fast-growing team of engineers, designers, strategists, and problem-solvers who share a common passion for innovation. Together, we focus on creating simple, powerful, and reliable tools that help people work faster and smarter. Every feature we build and every improvement we make is driven by our commitment to deliver the best experience to our global users.
</p>
              </div>

              {/* Center Section - Glowing Logo */}
              <div className="flex justify-center items-center py-8 md:py-12 order-1 lg:order-2">
                <div className="relative">
                  {/* Outer glow layers */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-[60px] md:rounded-[80px] blur-2xl md:blur-3xl opacity-80 scale-110"></div>
                  <div className="absolute inset-0 bg-red-600 rounded-[60px] md:rounded-[80px] blur-xl md:blur-2xl opacity-70 scale-105"></div>
                  
                  {/* Neon border effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-[60px] md:rounded-[80px] p-[3px]">
                    <div className="w-full h-full bg-gradient-to-br from-red-600 via-red-500 to-red-600 rounded-[60px] md:rounded-[80px]"></div>
                  </div>
                  
                  {/* Logo container with glass effect */}
                  <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-10 md:p-14 lg:p-16 rounded-[60px] md:rounded-[80px] shadow-2xl backdrop-blur-sm border-2 md:border-4 border-red-400/30">
                    <img 
                      src="/lovable-uploads/logo.png" 
                      alt="SlimFile Logo" 
                      className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 drop-shadow-2xl object-contain relative z-10 rounded-3xl"
                    />
                    {/* Inner highlights for 3D effect */}
                    <div className="absolute top-6 md:top-8 left-6 md:left-8 w-16 md:w-24 h-16 md:h-24 bg-white/10 rounded-full blur-2xl"></div>
                  </div>
                  
                  {/* Hand/Support visual indicator (decorative gradient) */}
                  <div className="absolute -bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 w-32 md:w-48 h-24 md:h-32 bg-gradient-to-t from-red-900/50 to-transparent rounded-t-[100px] blur-xl"></div>
                </div>
              </div>

              {/* Right Section - Our Amazing Team */}
              <div className="text-center lg:text-left order-3">
                <div className="inline-block border-2 border-red-600/50 rounded-2xl px-6 md:px-8 py-3 md:py-4 mb-4 md:mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Our Amazing Team</h2>
                </div>
                <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-md mx-auto lg:mr-auto px-4 md:px-0">
  Our team represents a blend of creativity, technical expertise, and forward-thinking leadership. From crafting seamless user interfaces to developing secure backend systems and building strong community relationships, each member plays an essential role in shaping SlimFile’s success. We believe in collaboration, continuous learning, and pushing boundaries to develop solutions that truly make a difference. This is the team that turns ideas into reality and keeps SlimFile improving every single day.
</p>

              </div>

            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-8 md:py-12 px-4 relative">
          {/* Ambient background lights */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 md:w-96 h-72 md:h-96 bg-red-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute top-1/3 right-10 w-64 md:w-80 h-64 md:h-80 bg-red-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-20 left-1/3 w-56 md:w-72 h-56 md:h-72 bg-red-700/20 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="relative">
                  
                  {/* Team Member Card */}
                  <div className="relative bg-gradient-to-br from-[#B91C1C] via-[#991B1B] to-[#7F1D1D] backdrop-blur-sm rounded-[2rem] p-4 md:p-6 border border-red-700/40 shadow-2xl overflow-hidden">
                    {/* Enhanced card glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-red-600/30 via-red-700/20 to-red-800/30 rounded-[2rem] blur-xl"></div>
                    
                    {/* Paper Plane at BOTTOM Left Corner */}
                    <div className="absolute bottom-4 left-4 z-0">
                      <svg width="80" height="80" viewBox="0 0 150 150" fill="none" className="drop-shadow-2xl">
                        <defs>
                          <linearGradient id={`bottomPlane-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f5f5f5" stopOpacity="0.95"/>
                            <stop offset="50%" stopColor="#d0d0d0" stopOpacity="0.85"/>
                            <stop offset="100%" stopColor="#a0a0a0" stopOpacity="0.75"/>
                          </linearGradient>
                        </defs>
                        <path 
                          d="M10 140 L80 10 L140 80 L70 70 L60 100 Z" 
                          fill={`url(#bottomPlane-${index})`}
                        />
                      </svg>
                    </div>
                    
                    {/* Content wrapper */}
                    <div className="relative">
                      
                      {/* Profile Photo */}
                      <div className="flex justify-center mb-4 md:mb-6 mt-4 md:mt-6">
                        <div className="relative">
                          {/* Photo glow effect */}
                          <div className="absolute -inset-2 bg-gradient-to-br from-white/20 to-gray-300/20 rounded-full blur-lg"></div>
                          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                            <img 
                              src={member.image} 
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                const fallback = target.nextElementSibling as HTMLElement;
                                target.style.display = 'none';
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center hidden">
                              <span className="text-2xl md:text-3xl font-bold text-white">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Name and Role Row */}
                      <div className="flex flex-col items-center justify-center mb-6 gap-3">
                        {/* Name */}
                        <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg text-center">{member.name}</h3>
                        
                        {/* Role Badge */}
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group relative"
                        >
                          {/* Button glow */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#8B0000] to-[#660000] rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                          <div className="relative bg-gradient-to-r from-[#8B0000] to-[#660000] hover:from-[#990000] hover:to-[#770000] transition-all px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            <span className="text-white font-semibold text-xs md:text-sm">{member.role}</span>
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-3 h-3 text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </div>
                      
                      {/* Bio Box */}
                      <div className="relative bg-gradient-to-br from-[#DC2626] to-[#B91C1C] backdrop-blur-sm rounded-2xl border border-red-600/50 shadow-lg overflow-hidden">
                        {/* Bio box glow */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-red-500/25 to-red-600/25 rounded-2xl blur-lg"></div>
                        
                        {/* Just text - no ball */}
                        <div className="relative p-4">
                          <p className="relative text-white text-xs md:text-sm leading-relaxed text-center">
                            {member.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}