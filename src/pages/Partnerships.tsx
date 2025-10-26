import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Handshake } from "lucide-react";

const Partnerships: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Handshake className="w-12 h-12 text-red-600 mr-4" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Our <span className="text-red-600">Partnerships</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover our strategic partners who help us deliver exceptional file compression solutions and complementary services.
            </p>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              🤝 Building Stronger Connections
            </Badge>
          </div>
        </div>
      </section>

      {/* Partnership Introduction */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="shadow-lg bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                Partnering for Success
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                At SlimFile, we believe in the power of collaboration. Our partnerships extend our capabilities and provide you with comprehensive solutions for all your file compression needs.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* STEPsBuild Partnership Section */}
      <section className="py-16 px-2 sm:px-4 lg:px-8">
        <div className="container mx-auto max-w-full px-0 sm:max-w-6xl sm:px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Partner: <span className="text-blue-600">STEPsBuild</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              For users who need powerful project management and team collaboration tools,
              we recommend STEPsBuild - a comprehensive software solution that helps individuals and teams organize, track, and complete projects efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Partnership Info */}
            <Card className="shadow-lg bg-white/80 backdrop-blur-md h-fit w-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                  Why STEPsBuild?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Task Management</h3>
                    <p className="text-gray-600 text-sm">
                      Organize and track tasks with intuitive project boards and workflows
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                    <p className="text-gray-600 text-sm">
                      Collaborate seamlessly with team members through shared workspaces
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                    <p className="text-gray-600 text-sm">
                      Monitor project progress with real-time updates and visual dashboards
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Reporting</h3>
                    <p className="text-gray-600 text-sm">
                      Generate comprehensive reports to keep stakeholders informed
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">
                    Whether you're managing software development, marketing campaigns, research projects,
                    or any other type of initiative, STEPsBuild provides the tools you need to streamline
                    your workflow and improve project outcomes.
                  </p>
                  <a
                    href="https://stepsbuild.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit STEPsBuild
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* STEPsBuild Iframe */}
            <Card className="shadow-lg bg-white/80 backdrop-blur-md w-full mx-0 sm:mx-4">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Explore STEPsBuild
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Take a look at STEPsBuild's project management features and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <div className="relative w-full" style={{ height: '70vh' }}>
                  <iframe
                    src="https://stepsbuild.com/"
                    className="absolute inset-0 w-full h-full border-0 rounded-lg"
                    title="STEPsBuild - Project Management Software"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    This is a preview of STEPsBuild's website. Click the link above to visit their full site.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Whether you need file compression with SlimFile or project management with STEPsBuild,
              we have the tools to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://stepsbuild.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm sm:text-base"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Try STEPsBuild
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnerships;
