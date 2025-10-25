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

const SDGSection = ({ icon: Icon, title, objective, children, bgColor = "bg-white" }) => (
  <section className={`rounded-2xl p-8 mb-8 shadow-lg border-l-4 ${bgColor} border-primary`}>
    <div className="flex items-center mb-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mr-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-primary font-medium mb-2">{objective}</p>
        <div className="flex items-center text-gray-600">
          <Target className="w-4 h-4 mr-1" />
          <span className="text-sm">UN Sustainable Development Goal</span>
        </div>
      </div>
    </div>
    <div className="text-gray-700 text-lg leading-relaxed pl-20">
      {children}
    </div>
  </section>
);

const SlimFileSDGs = () => {
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-white to-green-50 py-20 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mr-4">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <Leaf className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            SlimFile and the UN Sustainable Development Goals
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            SlimFile's advanced file compression services promote <strong className="text-primary">digital sustainability</strong> by shrinking data,
            thereby saving energy and resources. By reducing file sizes and bandwidth needs, SlimFile directly lowers energy consumption in servers and networks.
          </p>
          <div className="flex items-center justify-center text-green-600">
            <span className="text-lg font-medium">Data centers and digital infrastructure account for roughly 2% (1 gigaton) of global CO₂ emissions</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Supporting Global Sustainability Through Digital Efficiency
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            In today's world, data centers and digital infrastructure account for roughly 2% of global CO₂ emissions – a carbon footprint
            comparable to the airline industry. By reducing file sizes and bandwidth needs, SlimFile directly lowers energy consumption in
            servers and networks. This approach – akin to eliminating unnecessary "digital waste" – supports sustainable energy use and cost
            savings across all sectors. The following sections explain how SlimFile's technology aligns with key UN SDGs through data efficiency,
            infrastructure innovation, and global collaboration.
          </p>
        </div>

        {/* SDG Sections */}
        <SDGSection
          icon={Zap}
          title="SDG 7: Affordable and Clean Energy"
          objective="Ensure access to affordable, reliable, sustainable and modern energy for all"
          bgColor="bg-blue-50 border-blue-500"
        >
          <p className="mb-4">
            SlimFile contributes to SDG 7 by <strong>reducing the energy needed for digital operations</strong>. Compressed files require less storage and bandwidth,
            which translates into lower electricity demand in data centers and network systems.
          </p>
          <div className="bg-blue-100 rounded-lg p-4 mb-4">
            <p className="text-blue-800 font-medium">
              "Wide adoption of efficient data compression could reduce energy consumption by up to 40% in IT systems,
              cutting millions of tons of CO₂ emissions annually."
            </p>
          </div>
          <p className="mb-4">
            In practical terms, using SlimFile's web tools or API to compress images, PDFs, or presentations means fewer servers running and cooling,
            and faster data transfers. This efficiency aligns with cleaner energy goals: every megabyte saved reduces the grid power drawn for hosting
            and transmitting that data.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <strong className="text-blue-700">Storage Efficiency:</strong> Compressed files take up less space, so fewer disks and racks are needed,
              reducing energy use in server rooms.
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <strong className="text-blue-700">Transmission Efficiency:</strong> Smaller files mean faster transfers and lower network load,
              cutting energy in communications infrastructure.
            </div>
          </div>
        </SDGSection>

        <SDGSection
          icon={Briefcase}
          title="SDG 8: Decent Work and Economic Growth"
          objective="Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all"
          bgColor="bg-red-50 border-red-500"
        >
          <p className="mb-4">
            SlimFile drives <strong>digital innovation and productivity</strong>, which are key to economic growth. Digital solutions – like SlimFile's
            compression API – enhance businesses' ICT capacity and efficiency.
          </p>
          <p className="mb-4">
            For instance, companies that compress large media or report files can save on bandwidth costs and accelerate workflows, enabling staff to
            focus on higher-value tasks. SlimFile's low-bandwidth services particularly benefit small and medium enterprises (SMEs) by lowering barriers
            to cloud tools, supporting entrepreneurship and job creation.
          </p>
          <div className="bg-red-100 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-medium">
              "Digital tools can increase ICT capacity…a key driver of a country's economic growth."
            </p>
          </div>
          <p>
            By integrating SlimFile, organizations improve operational efficiency (a form of resource productivity) and contribute to inclusive growth.
          </p>
        </SDGSection>

        <SDGSection
          icon={Wrench}
          title="SDG 9: Industry, Innovation, and Infrastructure"
          objective="Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation"
          bgColor="bg-orange-50 border-orange-500"
        >
          <p className="mb-4">
            SlimFile's technology embodies <strong>innovation in digital infrastructure</strong>. By enabling robust data handling with minimal overhead,
            it helps create more resilient and sustainable ICT systems.
          </p>
          <p className="mb-4">
            Compressed data requires fewer hardware resources and travels reliably even on strained networks, strengthening the digital backbone of industries.
            For example, efficient compression means content delivery networks (CDNs) and cloud services can serve more users with the same infrastructure,
            reducing the need for constant expansion.
          </p>
          <div className="bg-orange-100 rounded-lg p-4 mb-4">
            <p className="text-orange-800 font-medium">
              "Compressed data requires less physical storage space…leading to lower energy consumption and compressed data files...require less bandwidth to transfer…reducing energy consumption."
            </p>
          </div>
          <p>
            SlimFile's API encourages developers to adopt these techniques, fostering a culture of technological efficiency. In sum, SlimFile's tools are a
            sustainable innovation – they upgrade traditional data workflows to be smarter and greener, aligning with SDG 9's call for sustainable, innovative infrastructure.
          </p>
        </SDGSection>

        <SDGSection
          icon={Building}
          title="SDG 11: Sustainable Cities and Communities"
          objective="Make cities and human settlements inclusive, safe, resilient and sustainable"
          bgColor="bg-yellow-50 border-yellow-500"
        >
          <p className="mb-4">
            Cities consume the majority of the world's energy (up to 80%) and produce 75% of carbon emissions. To make urban living more sustainable,
            digital services must also be efficient. SlimFile contributes by <strong>lightening the digital load in smart cities</strong>.
          </p>
          <p className="mb-4">
            When public services (from e-government portals to city sensor networks) use compressed data, they reduce network strain and power draw.
            For example, compressed map and sensor data mean faster response times and less energy per transaction on city servers.
          </p>
          <div className="bg-yellow-100 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 font-medium">
              "Over many transactions, this can significantly cut a city's digital energy footprint."
            </p>
          </div>
          <p>
            By integrating SlimFile's services into municipal IT systems or community platforms, cities can uphold inclusive access while managing infrastructure demands.
          </p>
        </SDGSection>

        <SDGSection
          icon={Recycle}
          title="SDG 12: Responsible Consumption and Production"
          objective="Ensure sustainable consumption and production patterns"
          bgColor="bg-amber-50 border-amber-500"
        >
          <p className="mb-4">
            SlimFile directly advances SDG 12 by <strong>minimizing resource use in the digital realm</strong>. Just as sustainable production reduces material waste,
            SlimFile's compression reduces "digital waste" – trimming the bytes used in every file.
          </p>
          <p className="mb-4">
            This means fewer raw resources are consumed to create and power storage hardware. In practice, businesses and users who compress files need to upgrade
            or expand storage less frequently.
          </p>
          <div className="bg-amber-100 rounded-lg p-4 mb-4">
            <p className="text-amber-800 font-medium">
              "Data compression can extend hardware lifespan by reducing write/erase cycles, thus delaying replacements and cutting e-waste."
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-amber-500">
              <strong className="text-amber-700">Lower Data Waste:</strong> Efficient files use fewer server resources, aligning with sustainable consumption of IT infrastructure.
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-amber-500">
              <strong className="text-amber-700">Extended Hardware Life:</strong> Compressed data reduces wear on equipment, delaying upgrades and conserving materials.
            </div>
          </div>
        </SDGSection>

        <SDGSection
          icon={Cloud}
          title="SDG 13: Climate Action"
          objective="Take urgent action to combat climate change and its impacts"
          bgColor="bg-green-50 border-green-500"
        >
          <p className="mb-4">
            SlimFile helps <strong>cut greenhouse gas emissions</strong> tied to the digital economy. Data centers and related devices already contribute about 2% of global CO₂ emissions.
          </p>
          <p className="mb-4">
            By shrinking file sizes, SlimFile lowers the energy needed for storage and transmission, which directly reduces CO₂ output. As research indicates,
            widespread data compression could save millions of tons of CO₂ annually.
          </p>
          <div className="bg-green-100 rounded-lg p-4 mb-4">
            <p className="text-green-800 font-medium">
              "Using modern compression has been shown to cut data transfer volumes by up to 20%, with proportional energy savings."
            </p>
          </div>
          <p>
            By adopting SlimFile's solutions, organizations effectively "green" their IT footprint, aligning with the Paris Agreement's low-carbon goals and helping to mitigate climate change impacts.
          </p>
        </SDGSection>

        <SDGSection
          icon={Handshake}
          title="SDG 17: Partnerships for the Goals"
          objective="Strengthen the means of implementation and revitalize the global partnership for sustainable development"
          bgColor="bg-indigo-50 border-indigo-500"
        >
          <p className="mb-4">
            SlimFile achieves a greater sustainability impact through <strong>collaboration and open innovation</strong>. We partner with developers, NGOs, enterprises and public agencies
            worldwide to embed sustainable practices in digital products.
          </p>
          <p className="mb-4">
            For example, our API ecosystem encourages third-party integrations, enabling other platforms to adopt efficient data handling. This cooperative approach echoes SDG 17:
          </p>
          <div className="bg-indigo-100 rounded-lg p-4 mb-4">
            <p className="text-indigo-800 font-medium text-center">
              "The Global Goals can only be met if we work together"
            </p>
          </div>
          <p>
            By sharing best practices and supporting joint initiatives (such as open-source image optimization tools), SlimFile helps build a network that amplifies sustainability.
          </p>
        </SDGSection>

        {/* Supporting SDGs */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Supporting Sustainable Development Goals</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mr-3">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">SDG 4: Quality Education</h3>
              </div>
              <p className="text-gray-700">
                Though primarily a technology provider, SlimFile indirectly supports education by improving access to digital learning resources.
                By compressing educational content (images, slides, documents), our tools make e-learning platforms more accessible, especially in low-bandwidth or remote areas.
              </p>
            </div>

            <div className="bg-teal-50 rounded-xl p-6 border-l-4 border-teal-500">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mr-3">
                  <TreePine className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">SDG 15: Life on Land</h3>
              </div>
              <p className="text-gray-700">
                SlimFile's impact on SDG 15 is indirect but meaningful. By reducing the demand for new hardware and cutting e-waste, SlimFile eases the strain on natural ecosystems.
                Fewer data centers expansions and less frequent device replacements mean that fewer forests are cleared for mining materials.
              </p>
            </div>
          </div>
        </div>

        {/* Sources and Citations */}
        <div className="bg-gray-100 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sources and Citations</h2>
          <p className="text-gray-700 mb-6 text-center">
            United Nations SDG materials and sustainability research have been cited to highlight SlimFile's alignment with each goal.
            These include official SDG descriptions and studies on data compression's energy and environmental benefits.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <a href="https://greenly.earth/en-us/blog/industries/what-is-the-carbon-footprint-of-data-storage"
                 className="flex items-center text-primary hover:text-primary/80 transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                What is the Carbon Footprint of Data Storage? - Greenly
              </a>
              <a href="https://www.purestorage.com/au/knowledge/what-is-data-compression.html"
                 className="flex items-center text-primary hover:text-primary/80 transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                How Better Data Compression Leads to Energy Savings | Pure Storage
              </a>
              <a href="https://sdg.umn.edu/goal-7-affordable-and-clean-energy"
                 className="flex items-center text-primary hover:text-primary/80 transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Goal 7: Affordable and Clean Energy | UMN Sustainable Development Goals
              </a>
            </div>
            <div className="space-y-2">
              <a href="https://globalgoals.org/goals/8-decent-work-and-economic-growth/"
                 className="flex items-center text-primary hover:text-primary/80 transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Goal 8: Decent work and economic growth - The Global Goals
              </a>
              <a href="https://www.sdg-digital.org/sdg/decent-work-and-economic-growth"
                 className="flex items-center text-primary hover:text-primary/80 transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Decent Work and Economic Growth
              </a>
              <a href="https://globalgoals.org/goals/9-industry-innovation-and-infrastructure/"
                 className="flex items-center text-primary hover:text-primary/80 transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Goal 9: Industry, innovation and infrastructure - The Global Goals
              </a>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Digital Sustainability Movement</h2>
          <p className="text-xl mb-6 opacity-90">
            By choosing SlimFile, you're not just compressing files – you're contributing to a more sustainable digital future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/compress"
               className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
              Start Compressing <ChevronRight className="w-5 h-5 ml-2" />
            </a>
            <a href="/contact"
               className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors inline-flex items-center justify-center">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlimFileSDGs;
