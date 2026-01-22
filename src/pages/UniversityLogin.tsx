import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, LogIn, UserPlus, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { setUniversityAuth } from "@/lib/universityAuth";

const UniversityLogin = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupContactPerson, setSignupContactPerson] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing Fields",
        description: "Please enter email and password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/university-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save auth data
      setUniversityAuth(data.token, data.university);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.university.name}!`
      });

      // Redirect to dashboard
      navigate('/university/dashboard');

    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupName || !signupEmail || !signupPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/university-auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          contactPerson: signupContactPerson
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Save auth data
      setUniversityAuth(data.token, data.university);

      toast({
        title: "Registration Successful",
        description: `Welcome, ${data.university.name}!`
      });

      // Redirect to dashboard
      navigate('/university/dashboard');

    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              University Portal
            </h1>
            <p className="text-gray-600">
              Compress folders with unlimited files
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Sign Up
            </button>
          </div>

          {/* Forms */}
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-gray-700">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@university.edu"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="text-gray-700">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-3 text-lg font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="h-5 w-5 border-2 border-white border-r-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Login
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-gray-700">
                      <Building2 className="w-4 h-4 inline mr-1" />
                      University Name *
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g., Stanford University"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-gray-700">
                      <Mail className="w-4 h-4 inline mr-1" />
                      University Email *
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="admin@university.edu"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-password" className="text-gray-700">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Password * (min 6 characters)
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password" className="text-gray-700">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Confirm Password *
                    </Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-contact" className="text-gray-700">
                      <User className="w-4 h-4 inline mr-1" />
                      Contact Person (Optional)
                    </Label>
                    <Input
                      id="signup-contact"
                      type="text"
                      value={signupContactPerson}
                      onChange={(e) => setSignupContactPerson(e.target.value)}
                      placeholder="e.g., John Smith"
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-3 text-lg font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="h-5 w-5 border-2 border-white border-r-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UniversityLogin;
