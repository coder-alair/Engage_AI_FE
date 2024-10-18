import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router } from "react-router-dom";
import Loader from './helpers/common/Loader.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <Router>
        <App />
      </Router>
    </Suspense>
    <Toaster />
  </React.StrictMode>,
)
