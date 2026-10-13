import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Cart from './pages/Cart'
import Catalog from './pages/Catalog'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Product from './pages/Product'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalog />} />
        <Route path="/produit/:slug" element={<Product />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
