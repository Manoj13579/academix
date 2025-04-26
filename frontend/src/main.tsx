import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import store from './store/Store.ts';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer />
      </BrowserRouter>
  </StrictMode>,
)
