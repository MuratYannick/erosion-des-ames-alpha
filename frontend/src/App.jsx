import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './core/contexts/AuthContext';

// Layout
import { Layout } from './components/layout';

// Portal Pages
import { Home, About } from './portal/pages';

// Auth Pages
import Login from './core/pages/Login';
import Register from './core/pages/Register';
import VerifyEmail from './core/pages/VerifyEmail';
import ForgotPassword from './core/pages/ForgotPassword';
import ResetPassword from './core/pages/ResetPassword';
import Profile from './core/pages/Profile';

// Components
import ProtectedRoute from './core/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Forum routes */}
            {/* <Route path="/forum/*" element={<ForumRoutes />} /> */}

            {/* Game routes */}
            {/* <Route path="/game/*" element={<GameRoutes />} /> */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
