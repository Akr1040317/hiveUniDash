import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bee, Globe, Shield } from "lucide-react";
import { getFirebaseInstances } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn({ onSignIn }) {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Allowed email addresses
  const allowedEmails = [
    'ekanshrastogi08@outlook.com',
    'akshatrastogi03@outlook.com',
    'arastogi@hivespelling.com',
    'erastogi@hivespelling.com'
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
      name: 'Dubai',
      subtitle: 'Dubai National Spelling Bee',
      color: 'bg-amber-500',
      description: 'Access the Dubai spelling bee dashboard and resources'
    }
  ];

  const handleRegionSelect = (regionId) => {
    setSelectedRegion(regionId);
    setError('');
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
              <Bee className="w-8 h-8 text-white" />
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

        {/* Sign In Form */}
        {selectedRegion && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Sign In to {regions.find(r => r.id === selectedRegion)?.name}
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
        )}
      </div>
    </div>
  );
}
