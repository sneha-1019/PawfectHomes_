import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ExplorePets from './pages/ExplorePets';
import PetDetails from './pages/PetDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import UploadPet from './pages/UploadPet';
import ApplicationTracker from './pages/ApplicationTracker';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

const HomeOrAdmin = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return isAdmin ? <Navigate to="/admin" replace /> : <Home />;
};


function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomeOrAdmin />} />
          <Route path="/explore" element={<ExplorePets />} />
          <Route path="/pet/:id" element={<PetDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload-pet" 
            element={
              <ProtectedRoute>
                <UploadPet />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute>
                <ApplicationTracker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
