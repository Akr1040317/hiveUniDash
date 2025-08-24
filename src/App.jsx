import './App.css'
import { useState, useEffect } from 'react'
import Pages from "@/pages/index.jsx"
import SignIn from "@/pages/SignIn.jsx"
import { Toaster } from "@/components/ui/toaster"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRegion, setCurrentRegion] = useState('us');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const userData = localStorage.getItem('hive_user');
    const region = localStorage.getItem('hive_region');
    
    if (userData && region) {
      setUser(JSON.parse(userData));
      setCurrentRegion(region);
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignIn = (region, userData) => {
    setCurrentRegion(region);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('hive_user');
    localStorage.removeItem('hive_region');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentRegion('us');
  };

  if (!isAuthenticated) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <>
      <Pages currentRegion={currentRegion} user={user} onSignOut={handleSignOut} />
      <Toaster />
    </>
  )
}

export default App 