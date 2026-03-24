import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Trading } from './pages/Trading';
import { Rules } from './pages/Rules';
import { Withdrawals } from './pages/Withdrawals';
import { About } from './pages/About';
import { Terms } from './pages/Terms';

export default function App() {
  

  return (
    <Router>
      <div>
        <Navbar/>
        <main>
          <Routes>
            <Route path="/" element={<Home  />} />
            <Route path="/trading" element={<Trading  />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/withdrawals" element={<Withdrawals  />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}