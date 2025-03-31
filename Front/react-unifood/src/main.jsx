import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import AdminRestaurantForm from './pages/admin/AdminRestaurantForm.jsx'
import AdminRestaurantList from './pages/admin/AdminRestaurantList.jsx'
import AdminEditRestaurant from './pages/admin/AdminEditRestaurant.jsx'
import AdminReviewApproval from './pages/admin/AdminReviewApproval.jsx'

import RestaurantDetail from './pages/RestaurantDetail.jsx'
import LoginPage from './pages/LoginPage'

createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/add-restaurant" element={<AdminRestaurantForm />} />
        <Route path="/admin/restaurants" element={<AdminRestaurantList />} />
        <Route path="/admin/edit-restaurant/:id" element={<AdminEditRestaurant />} />
        <Route path="/admin/reviews" element={<AdminReviewApproval />} />

        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
