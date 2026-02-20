import React from "react";
import {
  Leaf,
  Zap,
  Briefcase,
  Wrench,
  Building,
  Recycle,
  Cloud,
  Handshake,
  GraduationCap,
  TreePine,
  ExternalLink,
  Globe,
  Target,
  ChevronRight
} from "lucide-react";

const SDGCard = ({ icon: Icon, number, title, objective, children, color = "blue" }) => (
  <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden hover:shadow-md transition-shadow duration-200">
    {/* Header */}
    <div className="px-6 py-5 border-b border-gray-100">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full bg-${color}-50 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium text-${color}-600`}>SDG {number}</span>
            <span className="text-xs text-gray-400">•</span>
            <div className="flex items-center text-gray-500">
              <Target className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs">UN Goal</span>
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{objective}</p>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="px-6 py-5">
      <div className="text-gray-700 leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  </div>
);

const SlimFileSDGs = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="py-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-normal text-gray-900 mb-4">
            SlimFile and the UN Sustainable Development Goals
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            SlimFile's file compression services promote digital sustainability by reducing data size, saving energy, and lowering resource consumption. By minimizing file sizes and bandwidth needs, SlimFile directly contributes to global climate action and sustainable development.
          </p>
        </div>

        {/* Key Stat */}
        <div className="bg-blue-50 rounded-lg px-6 py-4 mb-12 border-l-4 border-blue-600">
          <p className="text-base text-gray-700">
            Data centers and digital infrastructure account for roughly <span className="font-medium text-gray-900">2% of global CO₂ emissions</span> – a carbon footprint comparable to the airline industry.
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <h2 className="text-2xl font-normal text-gray-900 mb-4">
            Supporting Global Sustainability Through Digital Efficiency
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            By reducing file sizes and bandwidth needs, SlimFile directly lowers energy consumption in servers and networks. This approach – eliminating unnecessary "digital waste" – supports sustainable energy use and cost savings across all sectors. The following sections explain how SlimFile's technology aligns with key UN SDGs through data efficiency, infrastructure innovation, and global collaboration.
          </p>
        </div>

        {/* Primary SDGs */}
        <div className="mb-8">
          <h2 className="text-2xl font-normal text-gray-900 mb-6">Primary Goals</h2>

          <SDGCard
            icon={Zap}
            number="7"
            title="Affordable and Clean Energy"
            objective="Ensure access to affordable, reliable, sustainable and modern energy for all"
            color="blue"
          >
            <p>
              SlimFile reduces the energy needed for digital operations. Compressed files require less storage and bandwidth, which translates into lower electricity demand in data centers and network systems.
            </p>
            <div className="bg-gray-50 rounded-lg px-4 py-3 border-l-2 border-gray-300">
              <p className="text-sm text-gray-700">
                Wide adoption of efficient data compression could reduce energy consumption by up to 40% in IT systems, cutting millions of tons of CO₂ emissions annually.
              </p>
            </div>
            <p>
              Using SlimFile to compress images, PDFs, or presentations means fewer servers running and cooling, and faster data transfers. This efficiency aligns with cleaner energy goals by reducing the grid power drawn for hosting and transmitting data.
            </p>
          </SDGCard>

          <SDGCard
            icon={Briefcase}
            number="8"
            title="Decent Work and Economic Growth"
            objective="Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all"
            color="blue"
          >
            <p>
              SlimFile drives digital innovation and productivity, which are key to economic growth. Digital solutions like SlimFile's compression API enhance businesses' ICT capacity and efficiency.
            </p>
            <p>
              Companies that compress large media or report files can save on bandwidth costs and accelerate workflows, enabling staff to focus on higher-value tasks. SlimFile's services particularly benefit small and medium enterprises (SMEs) by lowering barriers to cloud tools, supporting entrepreneurship and job creation.
            </p>
          </SDGCard>

          <SDGCard
            icon={Wrench}
            number="9"
            title="Industry, Innovation, and Infrastructure"
            objective="Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation"
            color="blue"
          >
            <p>
              SlimFile's technology embodies innovation in digital infrastructure. By enabling robust data handling with minimal overhead, it helps create more resilient and sustainable ICT systems.
            </p>
            <p>
              Compressed data requires fewer hardware resources and travels reliably even on strained networks, strengthening the digital backbone of industries. Efficient compression means content delivery networks and cloud services can serve more users with the same infrastructure, reducing the need for constant expansion.
            </p>
          </SDGCard>

          <SDGCard
            icon={Building}
            number="11"
            title="Sustainable Cities and Communities"
            objective="Make cities and human settlements inclusive, safe, resilient and sustainable"
            color="blue"
          >
            <p>
              Cities consume the majority of the world's energy (up to 80%) and produce 75% of carbon emissions. SlimFile contributes by lightening the digital load in smart cities.
            </p>
            <p>
              When public services use compressed data, they reduce network strain and power draw. Compressed map and sensor data mean faster response times and less energy per transaction on city servers, significantly cutting a city's digital energy footprint.
            </p>
          </SDGCard>

          <SDGCard
            icon={Recycle}
            number="12"
            title="Responsible Consumption and Production"
            objective="Ensure sustainable consumption and production patterns"
            color="blue"
          >
            <p>
              SlimFile minimizes resource use in the digital realm. Just as sustainable production reduces material waste, SlimFile's compression reduces "digital waste" – trimming the bytes used in every file.
            </p>
            <p>
              This means fewer raw resources are consumed to create and power storage hardware. Businesses and users who compress files need to upgrade or expand storage less frequently. Data compression can extend hardware lifespan by reducing write/erase cycles, thus delaying replacements and cutting e-waste.
            </p>
          </SDGCard>

          <SDGCard
            icon={Cloud}
            number="13"
            title="Climate Action"
            objective="Take urgent action to combat climate change and its impacts"
            color="blue"
          >
            <p>
              SlimFile helps cut greenhouse gas emissions tied to the digital economy. By shrinking file sizes, SlimFile lowers the energy needed for storage and transmission, which directly reduces CO₂ output.
            </p>
            <div className="bg-gray-50 rounded-lg px-4 py-3 border-l-2 border-gray-300">
              <p className="text-sm text-gray-700">
                Modern compression has been shown to cut data transfer volumes by up to 20%, with proportional energy savings.
              </p>
            </div>
            <p>
              By adopting SlimFile's solutions, organizations effectively "green" their IT footprint, aligning with the Paris Agreement's low-carbon goals.
            </p>
          </SDGCard>

          <SDGCard
            icon={Handshake}
            number="17"
            title="Partnerships for the Goals"
            objective="Strengthen the means of implementation and revitalize the global partnership for sustainable development"
            color="blue"
          >
            <p>
              SlimFile achieves greater sustainability impact through collaboration and open innovation. We partner with developers, NGOs, enterprises and public agencies worldwide to embed sustainable practices in digital products.
            </p>
            <p>
              Our API ecosystem encourages third-party integrations, enabling other platforms to adopt efficient data handling. By sharing best practices and supporting joint initiatives, SlimFile helps build a network that amplifies sustainability. The Global Goals can only be met if we work together.
            </p>
          </SDGCard>
        </div>

        {/* Supporting SDGs */}
        <div className="mb-12">
          <h2 className="text-2xl font-normal text-gray-900 mb-6">Supporting Goals</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-xs font-medium text-blue-600">SDG 4</span>
                  <h3 className="text-base font-medium text-gray-900">Quality Education</h3>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                SlimFile supports education by improving access to digital learning resources. By compressing educational content, our tools make e-learning platforms more accessible, especially in low-bandwidth or remote areas.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <TreePine className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <span className="text-xs font-medium text-green-600">SDG 15</span>
                  <h3 className="text-base font-medium text-gray-900">Life on Land</h3>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                By reducing the demand for new hardware and cutting e-waste, SlimFile eases the strain on natural ecosystems. Fewer data center expansions and less frequent device replacements mean fewer forests are cleared for mining materials.
              </p>
            </div>
          </div>
        </div>

        {/* Sources */}
        <div className="bg-gray-50 rounded-lg px-6 py-8 mb-12">
          <h2 className="text-2xl font-normal text-gray-900 mb-4">Sources and Citations</h2>
          <p className="text-sm text-gray-600 mb-6">
            United Nations SDG materials and sustainability research have been cited to highlight SlimFile's alignment with each goal.
          </p>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
            <a href="https://greenly.earth/en-us/blog/industries/what-is-the-carbon-footprint-of-data-storage"
               className="flex items-start text-blue-600 hover:underline text-sm group"
               target="_blank"
               rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>What is the Carbon Footprint of Data Storage?</span>
            </a>
            <a href="https://www.purestorage.com/au/knowledge/what-is-data-compression.html"
               className="flex items-start text-blue-600 hover:underline text-sm group"
               target="_blank"
               rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>How Better Data Compression Leads to Energy Savings</span>
            </a>
            <a href="https://sdg.umn.edu/goal-7-affordable-and-clean-energy"
               className="flex items-start text-blue-600 hover:underline text-sm group"
               target="_blank"
               rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Goal 7: Affordable and Clean Energy</span>
            </a>
            <a href="https://globalgoals.org/goals/8-decent-work-and-economic-growth/"
               className="flex items-start text-blue-600 hover:underline text-sm group"
               target="_blank"
               rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Goal 8: Decent Work and Economic Growth</span>
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 rounded-lg px-8 py-10 text-center text-white">
          <h2 className="text-2xl font-normal mb-3">Join the Digital Sustainability Movement</h2>
          <p className="text-base mb-8 opacity-90 max-w-2xl mx-auto">
            By choosing SlimFile, you're not just compressing files – you're contributing to a more sustainable digital future.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/compress"
               className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded font-medium hover:bg-gray-50 transition-colors">
              Start Compressing
              <ChevronRight className="w-5 h-5 ml-1" />
            </a>
            <a href="/contact"
               className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded font-medium hover:bg-blue-700 transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlimFileSDGs;
