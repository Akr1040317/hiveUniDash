import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Content from "./Content";

import Analytics from "./Analytics";

import Bugs from "./Bugs";

import Features from "./Features";

import Calendar from "./Calendar";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Content: Content,
    
    Analytics: Analytics,
    
    Bugs: Bugs,
    
    Features: Features,
    
    Calendar: Calendar,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent({ currentRegion, user, onSignOut }) {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage} currentRegion={currentRegion} user={user} onSignOut={onSignOut}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Content" element={<Content />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Bugs" element={<Bugs />} />
                
                <Route path="/Features" element={<Features />} />
                
                <Route path="/Calendar" element={<Calendar />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages({ currentRegion, user, onSignOut }) {
    return (
        <Router>
            <PagesContent currentRegion={currentRegion} user={user} onSignOut={onSignOut} />
        </Router>
    );
}