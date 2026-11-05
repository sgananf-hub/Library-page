import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowUpRight, Boxes, Compass, Menu, ShoppingBag, Sparkles, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BookCover from './components/BookCover'
import { BookModal, CartDrawer, Catalog, Recommended } from './components/Commerce'
import { ContactSection, Events, ReadersClub } from './components/BusinessSections'
import { books as allBooks, formatPrice } from './data/books'
import Community from './components/Community'
import './App.css'
import './Commerce.css'

gsap.registerPlugin(ScrollTrigger)
const BookScene = lazy(() => import('./components/BookScene'))

const books = allBooks.slice(0, 4).map((book, index) => ({ ...book, number: String(index + 1).padStart(2, '0') }))
const genres = [
  { name: 'Ficción', index: '01', description: 'Otros mundos para comprender el nuestro.' },
  { name: 'Ensayo', index: '02', description: 'Ideas que invitan a mirar de nuevo.' },
  { name: 'Poesía', index: '03', description: 'Lo esencial, dicho en pocas palabras.' },
  { name: 'Misterio', index: '04', description: 'Preguntas que no te dejarán dormir.' },
]

function canUseWebGL() {
  try { const canvas = document.createElement('canvas'); return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')) }
  catch { return false }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => { const query = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(query.matches); query.addEventListener('change', update); return () => query.removeEventListener('change', update) }, [])
  return reduced
}

function Brand({ light = false }) {
  return <a href="#inicio" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Lumen, volver al inicio"><span className="brand-mark" aria-hidden="true"><span /></span><span>LUMEN<span className="brand-dot">.</span></span></a>
}

function Header({ cartCount, onOpenCart }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="site-header"><div className="header-inner"><Brand /><nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Navegación principal"><a onClick={close} href="#novedades">Novedades</a><a onClick={close} href="#catalogo">Catálogo</a><a onClick={close} href="#generos">Géneros</a><a onClick={close} href="#eventos">Eventos</a><a onClick={close} href="#nosotros">Nosotros</a><a onClick={close} href="#club">Club</a><a onClick={close} href="#comunidad">Comunidad</a><a onClick={close} href="#contacto" className="nav-contact">Contacto <ArrowUpRight size={15} strokeWidth={1.6} /></a></nav><div className="header-actions"><button type="button" className="cart-trigger" aria-label={`Abrir carrito, ${cartCount} libros`} onClick={onOpenCart}><ShoppingBag size={19} strokeWidth={1.5} /><span>{cartCount}</span></button><button className="menu-toggle" type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button></div></div></header>
}

function StaticBook() {
  return <div className="static-book" role="img" aria-label="Portada ilustrada del libro El atlas de las horas"><div className="static-book-spine" /><div className="static-book-cover"><span className="static-imprint">EDICIONES LUMEN</span><span className="static-orbit"><span>✦</span></span><span className="static-title">EL ATLAS<br />DE LAS<br />HORAS</span><span className="static-author">CLARA VALDÉS</span></div></div>
}

function Experience({ reducedMotion }) {
  const sectionRef = useRef(null)
  const progressRef = useRef(0)
  const [webgl] = useState(canUseWebGL)
  const [sceneVisible, setSceneVisible] = useState(false)
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => setSceneVisible(entry.isIntersecting), { rootMargin: '300px' }); observer.observe(sectionRef.current); return () => observer.disconnect() }, [])
  useEffect(() => {
    if (reducedMotion) return
    const context = gsap.context(() => {
      ScrollTrigger.create({ trigger: sectionRef.current, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: self => { progressRef.current = self.progress } })
      gsap.to('.hero-content', { opacity: 0, y: -80, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: '18% top', end: '49% top', scrub: true } })
      gsap.fromTo('.chapter-content', { opacity: 0, y: 80 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: '42% top', end: '70% top', scrub: true } })
      gsap.to('.hero-wordmark', { opacity: .06, scale: 1.13, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom bottom', scrub: true } })
    }, sectionRef)
    return () => context.revert()
  }, [reducedMotion])
  return <section id="inicio" className={`experience ${reducedMotion ? 'motion-reduced' : ''}`} ref={sectionRef} aria-label="Bienvenido a Lumen"><div className="experience-sticky"><div className="experience-glow" /><div className="hero-grid" aria-hidden="true" /><div className="hero-wordmark" aria-hidden="true">LUMEN</div><div className="scene-shell">{webgl && sceneVisible && !reducedMotion ? <Suspense fallback={<StaticBook />}><BookScene progressRef={progressRef} /></Suspense> : <StaticBook />}</div><div className="world-hud" aria-hidden="true"><span><Boxes size={14} /> LUMEN LIBRARY · 01</span><span><span className="hud-dot" /> EXPLORANDO</span></div><div className="hero-content"><div className="eyebrow"><span className="eyebrow-line" /> Librería independiente · Est. 2026</div><h1>Hay mundos<br />que empiezan<br /><em>en tus manos.</em></h1><p>Una biblioteca inmersiva para encontrar historias raras, ideas brillantes y ese libro que parecía estar esperándote.</p><a className="text-link hero-link" href="#novedades">Explorar la colección <ArrowUpRight size={19} strokeWidth={1.5} /></a><div className="hero-tools"><span><Compass size={15} /> Mueve el cursor</span><span><Sparkles size={15} /> Descubre algo nuevo</span></div></div><div className="hero-edition"><span>EN PORTADA · 001</span><strong>El atlas de las horas</strong><span>Clara Valdés · Ficción especulativa</span></div><div className="chapter-content"><div className="eyebrow"><span className="eyebrow-line" /> El placer de descubrir</div><h2>Una historia puede<br /><em>cambiarlo todo.</em></h2><p>Deja que la curiosidad te guíe. En cada lomo hay una voz esperando encontrarte.</p><a className="text-link" href="#novedades">Descubre las novedades <ArrowUpRight size={19} strokeWidth={1.5} /></a></div><a href="#novedades" className="scroll-indicator"><span>DESLIZA PARA EXPLORAR</span><ArrowDown size={16} strokeWidth={1.4} /></a><span className="hero-index">01 / 04</span></div></section>
}

function Featured({ onSelectBook, onAdd }) {
  return <section id="novedades" className="featured-section section-pad"><div className="section-heading"><div><span className="section-kicker">01 / NOVEDADES 2026</span><h2>Para abrir<br /><em>nuevos mundos.</em></h2></div><p>Voces nuevas, historias inolvidables. Una selección hecha para perder la noción del tiempo.</p></div><div className="featured-controls"><span>RECIÉN LLEGADOS</span><a href="#catalogo">Ver catálogo completo <ArrowUpRight size={14} /></a><span className="book-count">04 TÍTULOS</span></div><div className="books-grid">{books.map(book => <article className="book-card" key={book.id}><button type="button" className="feature-cover-button" onClick={() => onSelectBook(book)} aria-label={`Ver detalles de ${book.title}`}><div className="book-artwork"><span className="card-number">{book.number} / 04</span><BookCover book={book} /><span className="artwork-corner">✳</span></div></button><div className="book-card-meta"><span>{book.genre}</span><span>{formatPrice(book.price)}</span></div><h3>{book.title}</h3><p>{book.author}</p><div className="feature-actions"><button type="button" onClick={() => onSelectBook(book)}>Ver detalles <ArrowUpRight size={16} /></button><button type="button" onClick={() => onAdd(book)}>Añadir al carrito <ShoppingBag size={16} /></button></div></article>)}</div></section>
}

function Genres({ selectGenre }) {
  return <section id="generos" className="genres-section section-pad"><div className="section-heading"><div><span className="section-kicker">04 / ENCUENTRA TU PRÓXIMA LECTURA</span><h2>Cada lector tiene<br /><em>su universo.</em></h2></div><p>Sigue la intuición. Siempre hay un libro que parece escrito para este preciso momento.</p></div><div className="genres-list">{genres.map(genre => <button className="genre-row" type="button" key={genre.name} onClick={() => selectGenre(genre.name)} aria-label={`Ver libros de ${genre.name}`}><span className="genre-index">{genre.index}</span><span className="genre-name">{genre.name}</span><span className="genre-description">{genre.description}</span><span className="genre-arrow"><ArrowUpRight size={26} strokeWidth={1.3} /></span></button>)}</div></section>
}

function About() {
  return <section id="nosotros" className="about-section section-pad"><div className="about-visual" aria-hidden="true"><div className="about-halo"><span>✳</span></div><div className="about-visual-text">leer es<br /><em>sentir más.</em></div><span className="about-caption">LUMEN / UN ESPACIO PARA LA CURIOSIDAD</span></div><div className="about-copy"><span className="section-kicker">06 / NUESTRA ESENCIA</span><h2>Creemos en<br />el poder de<br /><em>una buena historia.</em></h2><p>Lumen nace de una idea sencilla: un libro puede abrir una conversación, cambiar una tarde o acompañarte durante años. Elegimos cada título con atención y compartimos el gusto de encontrar ese que llega justo a tiempo.</p><a href="#contacto" className="text-link dark-link">Visita nuestra librería <ArrowUpRight size={19} strokeWidth={1.5} /></a></div></section>
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><Brand light /><p>Un lugar para detener el tiempo<br />y dejar que empiece una historia.</p><a href="#inicio" aria-label="Volver arriba" className="back-to-top"><ArrowLeft size={18} /> Volver arriba</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} LUMEN. HECHO PARA LECTORES.</span><span>LAS MEJORES HISTORIAS SIGUEN ABIERTAS.</span></div></footer>
}

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('lumen-cart') || '[]')
    if (!Array.isArray(saved)) return []
    return saved.filter(item => allBooks.some(book => book.id === item.id) && ['compra', 'reserva'].includes(item.mode) && Number.isInteger(item.quantity) && item.quantity > 0).map(item => ({ ...allBooks.find(book => book.id === item.id), mode: item.mode, quantity: Math.min(item.quantity, 20) }))
  } catch { return [] }
}

function App() {
  const reducedMotion = useReducedMotion()
  const [selectedGenre, setSelectedGenre] = useState('Todos')
  const [selectedBook, setSelectedBook] = useState(null)
  const [cart, setCart] = useState(readCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState('')
  useEffect(() => { localStorage.setItem('lumen-cart', JSON.stringify(cart.map(({ id, mode, quantity }) => ({ id, mode, quantity })))) }, [cart])
  const closeBook = useCallback(() => setSelectedBook(null), [])
  const closeCart = useCallback(() => { setCartOpen(false); setConfirmed(false) }, [])
  const openCart = useCallback(() => { setConfirmed(false); setCartOpen(true) }, [])
  const addBook = useCallback((book, mode = 'compra') => {
    setCart(current => {
      const existing = current.find(item => item.id === book.id && item.mode === mode)
      return existing ? current.map(item => item.id === book.id && item.mode === mode ? { ...item, quantity: Math.min(item.quantity + 1, 20) } : item) : [...current, { ...book, mode, quantity: 1 }]
    })
    setSelectedBook(null)
    setConfirmed(false)
    setCartOpen(true)
  }, [])
  const reserveBook = useCallback(book => addBook(book, 'reserva'), [addBook])
  const changeQuantity = useCallback((id, mode, delta) => setCart(current => current.map(item => item.id === id && item.mode === mode ? { ...item, quantity: Math.min(item.quantity + delta, 20) } : item).filter(item => item.quantity > 0)), [])
  const removeBook = useCallback((id, mode) => setCart(current => current.filter(item => item.id !== id || item.mode !== mode)), [])
  const checkout = useCallback(() => { setCart([]); setConfirmed(true) }, [])
  const selectGenre = genre => { setSelectedGenre(genre); document.querySelector('#catalogo')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' }) }
  const reserveEvent = title => { setSelectedEvent(title); document.querySelector('#contacto')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' }) }
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  return <><Header cartCount={cartCount} onOpenCart={openCart} /><main><Experience reducedMotion={reducedMotion} /><Featured onSelectBook={setSelectedBook} onAdd={addBook} /><Catalog selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} onSelectBook={setSelectedBook} onAdd={addBook} /><Recommended onSelectBook={setSelectedBook} onAdd={addBook} /><Genres selectGenre={selectGenre} /><Events onReserve={reserveEvent} /><About /><ReadersClub /><Community /><ContactSection key={selectedEvent} selectedEvent={selectedEvent} /></main><Footer /><BookModal book={selectedBook} onClose={closeBook} onAdd={addBook} onReserve={reserveBook} /><CartDrawer open={cartOpen} onClose={closeCart} items={cart} onChangeQuantity={changeQuantity} onRemove={removeBook} onCheckout={checkout} confirmed={confirmed} /></>
}

export default App
