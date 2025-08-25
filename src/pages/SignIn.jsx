import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, Globe, Shield, Mail } from "lucide-react";
import { getFirebaseInstances } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function SignIn({ onSignIn }) {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Allowed email addresses for regular sign-in
  const allowedEmails = [
    'ekanshrastogi08@outlook.com',
    'akshatrastogi03@outlook.com',
    'arastogi@hivespelling.com',
    'erastogi@hivespelling.com'
  ];

  // Allowed email addresses for Google sign-in (both US and Dubai)
  const allowedGoogleEmails = [
    'arastogi@hivespelling.com',
    'erastogi@hivespelling.com',
    'akshra0317@gmail.com'
  ];

  const regions = [
    {
      id: 'us',
      name: 'United States',
      subtitle: 'Scripps National Spelling Bee',
      color: 'bg-blue-500',
      description: 'Access the US spelling bee dashboard and resources'
    },
    {
      id: 'dubai',
      name: 'UAE Prepcenter',
      subtitle: 'UAE National Spelling Bee',
      color: 'bg-amber-500',
      description: 'Access the UAE spelling bee dashboard and resources'
    }
  ];

  const handleRegionSelect = (regionId) => {
    setSelectedRegion(regionId);
    setError('');
  };

  const handleGoogleSignIn = async () => {
    if (!selectedRegion) {
      setError('Please select a region first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { auth } = getFirebaseInstances(selectedRegion);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userEmail = result.user.email;
      
      // Check if Google email is allowed
      if (!allowedGoogleEmails.includes(userEmail.toLowerCase())) {
        setError('Access denied. This Google account is not authorized to use this application.');
        return;
      }

      // Store region preference
      localStorage.setItem('hive_region', selectedRegion);
      localStorage.setItem('hive_user', JSON.stringify({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        region: selectedRegion
      }));

      // Call the parent callback
      onSignIn(selectedRegion, result.user);
      
    } catch (error) {
      console.error('Google sign in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!selectedRegion) {
      setError('Please select a region first');
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Check if email is allowed
    if (!allowedEmails.includes(email.toLowerCase())) {
      setError('Access denied. This email address is not authorized to use this application.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { auth } = getFirebaseInstances(selectedRegion);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Store region preference
      localStorage.setItem('hive_region', selectedRegion);
      localStorage.setItem('hive_user', JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        region: selectedRegion
      }));

      // Call the parent callback
      onSignIn(selectedRegion, userCredential.user);
      
    } catch (error) {
      console.error('Sign in error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later');
          break;
        default:
          setError('Failed to sign in. Please check your credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Hive Dashboard</h1>
          <p className="text-gray-400">Sign in to access your spelling bee resources</p>
        </div>

        {/* Region Selection */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Select Your Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => handleRegionSelect(region.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedRegion === region.id
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${region.color}`}></div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{region.name}</div>
                    <div className="text-sm text-amber-400">{region.subtitle}</div>
                    <div className="text-xs text-gray-400 mt-1">{region.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Sign In Options */}
        {selectedRegion && (
          <>
            {/* Google Sign In */}
            <Card className="mb-6 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Sign In with Google
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Continue with Google'}
                </Button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Only authorized Google accounts can access this application
                </p>
              </CardContent>
            </Card>

            {/* Email/Password Sign In */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Sign In with Email & Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="Enter your email"
                      required
                    />
                    <p className="text-xs text-gray-400">
                      Only authorized email addresses are allowed access
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {error && (
                    <Alert className="border-red-500 bg-red-500/10">
                      <AlertDescription className="text-red-400">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
