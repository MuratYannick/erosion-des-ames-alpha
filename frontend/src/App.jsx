import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './core/pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Forum routes */}
        {/* <Route path="/forum/*" element={<ForumRoutes />} /> */}
        {/* Game routes */}
        {/* <Route path="/game/*" element={<GameRoutes />} /> */}
        {/* Portal routes */}
        {/* <Route path="/portal/*" element={<PortalRoutes />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
