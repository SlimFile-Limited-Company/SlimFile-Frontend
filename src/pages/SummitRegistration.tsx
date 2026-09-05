import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://slimfile-backend.onrender.com';

export default function SummitRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: 'individual'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/summit/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', organization: '', role: 'individual' });
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You're Registered!
            </h2>
            <p className="text-gray-700 mb-4">
              Thank you for registering for SlimFile Impact Summit 2027
            </p>
            <p className="text-sm text-gray-600">
              We'll send you updates about the summit date, venue, and agenda to your email.
            </p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="text-[#C41F1F] hover:underline text-sm"
          >
            Register another person
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SlimFile Impact Summit 2027
          </h1>
          <p className="text-xl text-[#C41F1F] font-semibold mb-2">
            Africa Builds. The World Benefits.
          </p>
          <p className="text-gray-600">
            Register for updates about date, venue, and agenda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41F1F] focus:border-transparent"
              placeholder="Isaac Abakah"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41F1F] focus:border-transparent"
              placeholder="isaac@slim-file.com"
            />
          </div>

          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
              Company/Organization <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41F1F] focus:border-transparent"
              placeholder="SlimFile Limited Company"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              I am a/an <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41F1F] focus:border-transparent bg-white"
            >
              <option value="individual">Individual User</option>
              <option value="business">Business/Enterprise</option>
              <option value="developer">Developer</option>
              <option value="partner">Partner</option>
              <option value="media">Media/Press</option>
              <option value="innovator">Tech Innovator/Leader</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C41F1F] text-white py-3 rounded-lg font-semibold hover:bg-[#7A1113] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register for Summit 2027'}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By registering, you agree to receive updates about SlimFile Impact Summit 2027
          </p>
        </form>
      </div>
    </div>
  );
}
