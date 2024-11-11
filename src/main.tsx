import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// import { Router } from 'react-router-dom';
// import { BrouserRouter as Router } from 'react-router-dom';

import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <App />,
  </Router>
);
