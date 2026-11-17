import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { runBoot } from './boot'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from './theme'
import { Nav, Footer, ScrollTop, ScrollProgress, WhatsAppFab } from './components/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import { Applications, AppDetail } from './pages/Applications'
import { Projects, Payback, About, Contact, NotFound } from './pages/Misc'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/applications/:slug" element={<AppDetail />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/payback" element={<Payback />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  // first render is on screen (behind the loader): now wait for its media, then reveal
  useEffect(() => { runBoot() }, [])
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ScrollTop />
          <ScrollProgress />
          <Nav />
          <main><AnimatedRoutes /></main>
          <Footer />
          <WhatsAppFab />
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  )
}
