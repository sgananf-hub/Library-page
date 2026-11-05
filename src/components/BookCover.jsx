export default function BookCover({ book }) {
  return <div className={`book-cover cover-${book.cover}`} aria-hidden="true">
    <div className="cover-border" />
    {book.cover === 'atlas' && <div className="cover-art cover-art-atlas"><i /><i /><i /><span>✦</span></div>}
    {book.cover === 'silencio' && <div className="cover-art cover-art-silencio"><i /><i /><i /></div>}
    {book.cover === 'mar' && <div className="cover-art cover-art-mar"><i /><i /><i /></div>}
    {book.cover === 'sombras' && <div className="cover-art cover-art-sombras"><i /><i /><i /></div>}
    <span className="cover-publisher">LUMEN · EDICIONES</span>
    <div className="cover-bottom"><span>{book.title}</span><small>{book.author}</small></div>
  </div>
}
