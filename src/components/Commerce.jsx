import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react'
import BookCover from './BookCover'
import { books, formatPrice, genres } from '../data/books'

function useDialog(open, onClose) {
  const panelRef = useRef(null)
  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector('button')?.focus()
    const handleKey = event => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const focusables = [...panelRef.current.querySelectorAll('button, a[href], input, select, textarea')].filter(element => !element.disabled)
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = previousOverflow; previousFocus?.focus?.() }
  }, [open, onClose])
  return panelRef
}

export function Catalog({ selectedGenre, setSelectedGenre, onSelectBook, onAdd }) {
  const [query, setQuery] = useState('')
  const normalized = query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const results = books.filter(book => {
    const matchesGenre = selectedGenre === 'Todos' || book.genre === selectedGenre
    const searchable = `${book.title} ${book.author} ${book.genre}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    return matchesGenre && searchable.includes(normalized)
  })
  return <section id="catalogo" className="catalog-section section-pad">
    <div className="section-heading catalog-heading"><div><span className="section-kicker">02 / CATÁLOGO COMPLETO</span><h2>Encuentra ese libro<br /><em>que te esperaba.</em></h2></div><p>Explora doce historias originales. Busca por título, autor o género y elige tu próxima lectura.</p></div>
    <div className="catalog-tools"><label className="catalog-search"><Search size={19} aria-hidden="true" /><span className="sr-only">Buscar libros</span><input type="search" placeholder="Buscar título, autor o género" value={query} onChange={event => setQuery(event.target.value)} /></label><div className="catalog-filters" role="group" aria-label="Filtrar por género">{genres.map(genre => <button type="button" key={genre} className={selectedGenre === genre ? 'is-active' : ''} aria-pressed={selectedGenre === genre} onClick={() => setSelectedGenre(genre)}>{genre}</button>)}</div></div>
    <div className="catalog-result-count" aria-live="polite">{results.length} {results.length === 1 ? 'LIBRO ENCONTRADO' : 'LIBROS ENCONTRADOS'}</div>
    {results.length ? <div className="catalog-grid">{results.map(book => <article className="catalog-card" key={book.id}><button type="button" className="catalog-cover-button" onClick={() => onSelectBook(book)} aria-label={`Ver detalles de ${book.title}`}><div className="book-artwork"><BookCover book={book} /></div></button><div className="catalog-card-body"><div className="catalog-card-top"><span>{book.genre}</span>{book.badge && <span>{book.badge}</span>}</div><h3>{book.title}</h3><p>{book.author}</p><strong>{formatPrice(book.price)}</strong><div className="catalog-card-actions"><button type="button" onClick={() => onSelectBook(book)}>Detalles <ArrowUpRight size={16} /></button><button type="button" className="quick-add" onClick={() => onAdd(book)} aria-label={`Añadir ${book.title} al carrito`}><Plus size={19} /></button></div></div></article>)}</div> : <div className="empty-results"><h3>No encontramos ese libro.</h3><p>Prueba con otro título, autor o género.</p><button type="button" onClick={() => { setQuery(''); setSelectedGenre('Todos') }}>Ver todo el catálogo <ArrowRight size={17} /></button></div>}
  </section>
}

export function Recommended({ onSelectBook, onAdd }) {
  const picks = books.filter(book => book.badge === 'Recomendado').slice(0, 3)
  return <section id="recomendados" className="recommended-section section-pad"><div className="section-heading"><div><span className="section-kicker">03 / RECOMENDADOS</span><h2>Elegidos para<br /><em>quedarse contigo.</em></h2></div><p>Libros que nuestro equipo volvería a poner en las manos de un lector, una y otra vez.</p></div><div className="recommended-grid">{picks.map((book, index) => <article className="recommended-card" key={book.id}><div className="recommended-number">0{index + 1} / SELECCIÓN</div><div className="recommended-art"><BookCover book={book} /></div><div className="recommended-info"><span>{book.genre} · {book.year}</span><h3>{book.title}</h3><p>{book.author}</p><strong>{formatPrice(book.price)}</strong><div><button type="button" onClick={() => onSelectBook(book)}>Ver libro <ArrowUpRight size={16} /></button><button type="button" onClick={() => onAdd(book)}>Añadir <Plus size={16} /></button></div></div></article>)}</div></section>
}

export function BookModal({ book, onClose, onAdd, onReserve }) {
  const panelRef = useDialog(Boolean(book), onClose)
  if (!book) return null
  return <div className="dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><div className="book-dialog dialog-panel" role="dialog" aria-modal="true" aria-labelledby="book-dialog-title" ref={panelRef}><button type="button" className="dialog-close" aria-label="Cerrar ficha" onClick={onClose}><X size={22} /></button><div className="dialog-art"><BookCover book={book} /></div><div className="dialog-info"><span className="section-kicker">LUMEN / {book.genre.toUpperCase()}</span><h2 id="book-dialog-title">{book.title}</h2><p className="dialog-author">por {book.author}</p><p className="dialog-description">{book.description}</p><dl><div><dt>Edición</dt><dd>{book.year}</dd></div><div><dt>Páginas</dt><dd>{book.pages}</dd></div><div><dt>Género</dt><dd>{book.genre}</dd></div></dl><strong className="dialog-price">{formatPrice(book.price)}</strong><div className="dialog-actions"><button type="button" className="primary-action" onClick={() => onAdd(book)}>Añadir al carrito <ShoppingBag size={18} /></button><button type="button" className="secondary-action" onClick={() => onReserve(book)}>Reservar en tienda <ArrowUpRight size={18} /></button></div><small>Compra y reserva simuladas para esta demostración.</small></div></div></div>
}

export function CartDrawer({ open, onClose, items, onChangeQuantity, onRemove, onCheckout, confirmed }) {
  const panelRef = useDialog(open, onClose)
  if (!open) return null
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  return <div className="dialog-backdrop cart-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><aside className="cart-drawer dialog-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" ref={panelRef}><div className="cart-header"><div><span className="section-kicker">TU SELECCIÓN</span><h2 id="cart-title">Carrito <span>({count})</span></h2></div><button type="button" className="dialog-close" aria-label="Cerrar carrito" onClick={onClose}><X size={22} /></button></div>{confirmed ? <div className="cart-success" role="status"><span>✳</span><h3>Selección confirmada</h3><p>Tu pedido de demostración se registró en esta sesión. Para una compra real, escríbenos desde la sección de contacto.</p><button type="button" onClick={onClose}>Seguir explorando <ArrowRight size={17} /></button></div> : items.length ? <><div className="cart-items">{items.map(item => <div className="cart-item" key={`${item.id}-${item.mode}`}><div className={`cart-mini-cover cover-${item.cover}`}><span>{item.title}</span></div><div className="cart-item-info"><span>{item.mode === 'reserva' ? 'Reserva en tienda' : 'Compra simulada'}</span><h3>{item.title}</h3><p>{item.author}</p><strong>{formatPrice(item.price * item.quantity)}</strong><div className="quantity-control"><button type="button" aria-label={`Quitar una unidad de ${item.title}`} onClick={() => onChangeQuantity(item.id, item.mode, -1)}><Minus size={14} /></button><span>{item.quantity}</span><button type="button" aria-label={`Añadir una unidad de ${item.title}`} onClick={() => onChangeQuantity(item.id, item.mode, 1)}><Plus size={14} /></button></div></div><button type="button" className="remove-item" aria-label={`Eliminar ${item.title}`} onClick={() => onRemove(item.id, item.mode)}><X size={17} /></button></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{formatPrice(total)}</strong></div><p>Esta es una experiencia de compra simulada. No se realizará ningún cobro ni se enviará un pedido.</p><button type="button" className="primary-action" onClick={onCheckout}>Confirmar selección <ArrowRight size={18} /></button></div></> : <div className="cart-empty"><ShoppingBag size={42} strokeWidth={1} /><h3>Tu carrito está esperando una historia.</h3><p>Explora el catálogo y guarda los libros que quieras leer.</p><button type="button" onClick={onClose}>Seguir explorando <ArrowRight size={17} /></button></div>}</aside></div>
}
