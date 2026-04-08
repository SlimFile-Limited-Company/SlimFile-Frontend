import { Button } from "@/components/ui/button";
import { Mail, KeyRound, FileText, Lock, Layers, User, HelpCircle, BookOpen, Zap } from "lucide-react";

const Section = ({ icon: Icon, title, children, bg }) => (
  <section className={`rounded-2xl p-8 mb-10 shadow-sm ${bg || "bg-white"}`}>
    <div className="flex items-center mb-4">
      {Icon && <Icon className="w-8 h-8 text-primary mr-3" />}
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    <div className="text-gray-700 text-lg leading-relaxed">{children}</div>
  </section>
);

const apiDocs = [
  {
    icon: KeyRound,
    title: "User Authentication",
    description: `Authenticate users via Google OAuth 2.0. This endpoint exchanges a Google ID token for a SlimFile JWT, which must be used for all protected endpoints.`,
    endpoint: "https://your-backend-url/api/auth/google",
    method: "POST",
    auth: "No (public endpoint)",
    headers: { "Content-Type": "application/json" },
    request: `{
  "credential": "<Google ID token>"
}`,
    response: `{
  "token": "<JWT token>"
}`,
    errors: [
      { code: 400, message: "Invalid credential or missing field." },
      { code: 401, message: "Google authentication failed." }
    ],
    notes: [
      "The JWT token returned must be included in the Authorization header as 'Bearer <token>' for all protected endpoints.",
      "The Google ID token is obtained from the Google Sign-In client on the frontend.",
      "Contact us for the actual API base URL."
    ]
  },
  {
    icon: FileText,
    title: "Single File Compression",
    description: `Compress a single image or PDF file. Returns the compressed file as a binary blob.`,
    endpoint: "https://your-backend-url/api/compress",
    method: "POST (multipart/form-data)",
    auth: "No (public endpoint)",
    headers: { "Content-Type": "multipart/form-data" },
    request: `file=<file>`,
    response: `Blob (compressed file)` ,
    errors: [
      { code: 400, message: "No file uploaded or unsupported file type." },
      { code: 500, message: "Compression failed." }
    ],
    notes: [
      "Supported file types: JPEG, PNG, PDF.",
      "The response is a file download; check the 'Content-Disposition' header for the filename.",
      "No authentication required.",
      "Contact us for the actual API base URL."
    ]
  },
  {
    icon: Layers,
    title: "Batch File Compression",
    description: `Compress multiple files in a single request. Returns a ZIP archive containing all compressed files.`,
    endpoint: "https://your-backend-url/api/compress/batch",
    method: "POST (multipart/form-data)",
    auth: "No (public endpoint)",
    headers: { "Content-Type": "multipart/form-data" },
    request: `files=file1&files=file2&...`,
    response: `Blob (ZIP archive)` ,
    errors: [
      { code: 400, message: "No files uploaded or unsupported file types." },
      { code: 500, message: "Batch compression failed." }
    ],
    notes: [
      "Maximum number of files per request: 300.",
      "Supported file types: JPEG, PNG, PDF.",
      "The response is a ZIP file download.",
      "No authentication required.",
      "Contact us for the actual API base URL."
    ]
  },
  {
    icon: User,
    title: "Get User Profile (Protected)",
    description: `Fetch the authenticated user's profile information. Requires a valid JWT token in the Authorization header.`,
    endpoint: "https://your-backend-url/api/protected/dashboard",
    method: "GET",
    auth: "Yes (Bearer token)",
    headers: { "Authorization": "Bearer <JWT>" },
    request: `N/A`,
    response: `{
  "user": {
    "name": "string",
    "email": "string",
    "picture": "string (URL)"
  }
}`,
    errors: [
      { code: 401, message: "Missing or invalid token." },
      { code: 403, message: "Token expired or unauthorized." }
    ],
    notes: [
      "This endpoint is only accessible to authenticated users.",
      "Returns the user's name, email, and profile picture URL.",
      "Contact us for the actual API base URL."
    ]
  }
];

const Api = () => (
  <div className="min-h-screen pt-28 bg-gray-50">
    {/* Hero Section */}
    <div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16 px-4 sm:px-6 lg:px-8 mb-12">
      <div className="container mx-auto max-w-3xl text-left">
        <BookOpen className="mb-4 w-14 h-14 text-primary" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">SlimFile API Documentation</h1>
        <p className="text-xl text-gray-700 mb-6">
          Welcome to the SlimFile API documentation. Here you’ll learn how APIs work and how SlimFile enables programmatic file compression and user authentication. <strong>To ensure security and quality, access to the real API is only granted after you contact us and receive approval.</strong> The information below is for educational purposes and to help you understand what’s possible with our API.
        </p>
        <div className="flex flex-col items-start justify-start mt-8 mb-2">
          <p className="text-lg text-gray-700 mb-4">For API access, click on the button below</p>
          <a href="https://api.slim-file.com/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="text-lg px-8 py-4 rounded-full flex items-center gap-2">
              
              API Access
            </Button>
          </a>
        </div>
      </div>
    </div>
    <div className="container mx-auto max-w-3xl px-4">
      <Section icon={HelpCircle} title="What is an API?" bg="bg-white">
        <strong>API</strong> stands for <strong>Application Programming Interface</strong>. An API is a set of rules and protocols that allows different software applications to communicate with each other. APIs enable developers to access specific features or data of an application, service, or platform without needing to understand its internal workings.<br /><br />
        For example, when you use a weather app on your phone, that app may use an API to fetch the latest weather data from a remote server. Similarly, SlimFile provides an API so that other applications or services can programmatically compress files, authenticate users, or access other features—without using the SlimFile web interface directly.
      </Section>
      <Section icon={Zap} title="How Do APIs Work?" bg="bg-gray-100">
        <ul className="list-disc ml-6">
          <li><strong>Requests:</strong> An application (the client) sends a request to the API, usually over the internet, specifying what it wants to do (e.g., compress a file).</li>
          <li><strong>Endpoints:</strong> Each API function is accessed via a specific URL called an endpoint (e.g., <code>https://your-backend-url/api/compress</code>).</li>
          <li><strong>Methods:</strong> APIs use HTTP methods like <code>GET</code>, <code>POST</code>, <code>PUT</code>, and <code>DELETE</code> to indicate the type of action to perform.</li>
          <li><strong>Authentication:</strong> Many APIs require users to prove their identity, often using tokens or API keys, to protect sensitive data and prevent abuse.</li>
          <li><strong>Responses:</strong> The API processes the request and sends back a response, which may include data, a file, or a status message.</li>
        </ul>
      </Section>
      <Section icon={Lock} title="Why Do You Need to Contact Us for API Access?" bg="bg-white">
        To ensure security, quality of service, and responsible usage, we do <strong>not</strong> make our real API endpoints publicly available. Instead, we require anyone interested in using the SlimFile API to contact us first. This allows us to:<br /><br />
        <ul className="list-disc ml-6">
          <li>Understand your use case and help you integrate the API effectively.</li>
          <li>Provide you with the correct API base URL and any necessary credentials or tokens.</li>
          <li>Monitor usage to ensure fair access and prevent abuse.</li>
          <li>Offer technical support and guidance during your integration.</li>
        </ul>
        <strong>In summary:</strong> An API lets your app or service talk to SlimFile automatically. But for security and support reasons, you must contact us before you can use it. Once approved, we’ll provide you with everything you need to get started.
      </Section>
      {apiDocs.map((doc, idx) => (
        <Section key={idx} icon={doc.icon} title={doc.title} bg={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          <div className="mb-2 text-gray-800">{doc.description}</div>
          <div className="mb-1"><span className="font-semibold">Endpoint:</span> <code className="bg-gray-200 px-2 py-1 rounded text-sm">{doc.endpoint}</code></div>
          <div className="mb-1"><span className="font-semibold">Method:</span> <code className="bg-gray-200 px-2 py-1 rounded text-sm">{doc.method}</code></div>
          <div className="mb-1"><span className="font-semibold">Authentication:</span> <code className="bg-gray-200 px-2 py-1 rounded text-sm">{doc.auth}</code></div>
          <div className="mb-1"><span className="font-semibold">Headers:</span> <code className="bg-gray-200 px-2 py-1 rounded text-sm">{JSON.stringify(doc.headers)}</code></div>
          <div className="mb-1"><span className="font-semibold">Request Example:</span>
            <pre className="bg-gray-100 rounded p-2 text-sm overflow-x-auto mt-1">{doc.request}</pre>
          </div>
          <div className="mb-1"><span className="font-semibold">Response Example:</span>
            <pre className="bg-gray-100 rounded p-2 text-sm overflow-x-auto mt-1">{doc.response}</pre>
          </div>
          <div className="mb-1"><span className="font-semibold">Possible Errors:</span>
            <ul className="list-disc ml-6 text-sm">
              {doc.errors.map((err, i) => (
                <li key={i}><span className="font-semibold">{err.code}:</span> {err.message}</li>
              ))}
            </ul>
          </div>
          <div className="mb-1"><span className="font-semibold">Usage Notes:</span>
            <ul className="list-disc ml-6 text-sm">
              {doc.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        </Section>
      ))}
    </div>
  </div>
);

export default Api;
