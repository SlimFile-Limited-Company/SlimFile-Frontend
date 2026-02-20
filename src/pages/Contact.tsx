import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Clock, 
  MapPin, 
  Phone,
  Send,
  HelpCircle,
  Bug,
  Lightbulb
} from "lucide-react";

const contactMethods = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Support",
    description: "Get help via email",
    detail: "support@slim-file.com",
    response: "Within 24 hours",
    action: "Send Email",
    href: "mailto:support@slim-file.com"
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Phone Support",
    description: "Speak with an expert",
    detail: "+233257166713 or +233249420757",
    response: "Mon-Fri 9AM-6PM GMT",
    action: "Call Now",
    href: "tel:+233257166713"
  }
];

const supportCategories = [
  {
    icon: <HelpCircle className="w-8 h-8" />,
    title: "General Help",
    description: "Questions about using SlimFile",
    color: "text-blue-600"
  },
  {
    icon: <Bug className="w-8 h-8" />,
    title: "Bug Reports",
    description: "Found an issue? Let us know",
    color: "text-red-600"
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Feature Requests",
    description: "Suggest new features",
    color: "text-yellow-600"
  }
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Have questions about SlimFile? Need help with compression? Our friendly support team is here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Can We Help?
            </h2>
            <p className="text-lg text-gray-600">
              Choose the best way to reach us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="text-primary mx-auto mb-4">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="font-semibold text-gray-900">{method.detail}</p>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{method.response}</span>
                    </div>
                    <Button 
                      asChild
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <a href={method.href}>
                        <Send className="w-4 h-4 mr-2" />
                        {method.action}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Support Categories */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What type of help do you need?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {supportCategories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardHeader>
                  <div className={`${category.color} mx-auto mb-4`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Office Info */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Visit Our Office
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">SlimFile HQ</p>
                    <p className="text-gray-600">Accra, Ghana</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-gray-900">Office Hours</p>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM GMT</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Facts
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Response Time</Badge>
                  <span className="text-gray-600">Average 2 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Satisfaction</Badge>
                  <span className="text-gray-600">98% customer satisfaction</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Languages</Badge>
                  <span className="text-gray-600">English</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Availability</Badge>
                  <span className="text-gray-600">24/7 email support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
