import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './core/contexts/AuthContext';

// Pages
import Home from './core/pages/Home';
import Login from './core/pages/Login';
import Register from './core/pages/Register';

// Components
import ProtectedRoute from './core/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Forum routes */}
          {/* <Route path="/forum/*" element={<ForumRoutes />} /> */}
          {/* Game routes */}
          {/* <Route path="/game/*" element={<GameRoutes />} /> */}
          {/* Portal routes */}
          {/* <Route path="/portal/*" element={<PortalRoutes />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
