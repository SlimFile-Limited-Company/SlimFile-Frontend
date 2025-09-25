
import { Header } from '../components/Header';

const teamMembers = [
  {
    name: 'Isaac Abakah',
    role: 'CEO and Founder',
    bio: 'Technical CEO who drives the vision and strategic direction of SlimFile, ensuring we stay ahead in innovation and deliver value to users.',
    image: '/lovable-uploads/Isaac.jpg',
    linkedin: 'http://linkedin.com/in/isaac-abakah',
  },
  
   
  {
    name: 'Abel Abendin',
    role: 'FullStack Developer',
    bio: 'Develops end-to-end solutions for SlimFile, from crafting responsive user interfaces to building secure and efficient backend architectures.',
    image: '/lovable-uploads/Abel.png',
    linkedin: 'http://linkedin.com/in/abendin-abel-601a0b351',
  },

  {
    name: 'Selorm Sem',
    role: 'MERN Stack Developer',
    bio: 'MERN Stack Developer at SlimFile, creating scalable backends, intuitive frontends, and efficient database solutions for seamless file compression.',
    image: '/lovable-uploads/Selorm.jpg',
    linkedin: 'https://www.linkedin.com/in/selormsem',
  },

  {
    name: 'Juliet Angaandi',
    role: 'Frontend Developer',
    bio: 'Crafts user-friendly designs and implements frontend features to enhance the SlimFile experience.',
    image: '/lovable-uploads/Juliet-1.png',
    linkedin: 'https://www.slim-file.com/linkedin.com/in/juliet-angaandi-1bab6b295',
  },

  {
    name: 'Ferdinand Ofei',
    role: 'UI/UX Designer',
    bio: 'Designs intuitive interfaces and smooth workflows that put users at the center of SlimFile.',
    image: '/lovable-uploads/osintawe.jpg',
    linkedin: 'https://www.linkedin.com/in/ferdinard-ofei-55138735a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },

  
  {
    name: 'Joel Eli Tsewabge',
    role: 'Analytical Expert',
    bio: 'Specializes in data analysis and optimization to improve compression performance and user satisfaction.',
    image: '/lovable-uploads/Joel-new.jpg',
    linkedin: 'https://www.linkedin.com/in/joel-tsewagbe?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
  }, 

  
  

{
    name: 'Godfred Agbosu',
    role: 'Partnership Head',
    bio: 'Builds and nurtures strategic partnerships that expand SlimFile’s reach and impact',
    image: '/lovable-uploads/Agbosu.jpg',
    linkedin: 'https://www.linkedin.com/in/godfred-agbosu-96b634366?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },


{
    name: 'Helena Amoabeng',
    role: 'Digital Marketer',
    bio: 'Leads digital campaigns to grow SlimFile’s audience and strengthen our online presence.',
    image: '/lovable-uploads/Helena.png',
    linkedin: 'https://www.slim-file.com/linkedin.com/in/helena-amoabeng-2bb52535a',
  },

  
  {
    name: 'Veronica Akwojinga',
    role: 'Linkedin Marketer',
    bio: 'Drives LinkedIn marketing strategies to connect SlimFile with professionals and potential partners.',
    image: '/lovable-uploads/vero.png',
    linkedin: 'https://www.slim-file.com/linkedin.com/in/veronica-akwojinga-505196368',
  },
];

export default function Teams() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <div className="text-center py-12 px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h1>
          <p className="text-xl text-gray-600">The passionate people behind SlimFile's success</p>
        </div>

        {/* Team Section */}
        <div className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Amazing Team</h2>
              <p className="text-lg text-gray-600">Dedicated professionals committed to revolutionizing file compression</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md border p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-200">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.currentTarget as HTMLImageElement;
                        const fallback = target.nextElementSibling as HTMLElement;
                        target.style.display = 'none';
                        fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                      <span className="text-xl font-bold text-gray-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-red-500 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-red-500 hover:text-red-600"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Connect on LinkedIn
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
