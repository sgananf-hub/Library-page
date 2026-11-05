import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Clock3, Camera, Mail, MapPin, Phone } from 'lucide-react'

const events = [
  { date: '10', month: 'OCT', label: 'Club de lectura', title: 'Las historias que nos encuentran', details: 'Sábado · 4:00 p. m. · Entrada libre', description: 'Conversaremos sobre los libros que llegan a nuestra vida en el momento preciso.' },
  { date: '24', month: 'OCT', label: 'Encuentro de poesía', title: 'Versos a media luz', details: 'Sábado · 5:30 p. m. · Cupos limitados', description: 'Una lectura compartida con voces locales y una taza de café.' },
  { date: '07', month: 'NOV', label: 'Conversatorio', title: 'Escribir la ciudad', details: 'Sábado · 3:00 p. m. · Entrada libre', description: 'Autores emergentes hablan de memoria, barrios y ficción contemporánea.' },
]

export function Events({ onReserve }) {
  return <section id="eventos" className="events-section section-pad"><div className="section-heading"><div><span className="section-kicker">05 / NOS ENCONTRAMOS</span><h2>Historias que<br /><em>se comparten.</em></h2></div><p>La lectura también sucede en compañía. Ven a conversar, escuchar y descubrir nuevas voces.</p></div><div className="events-list">{events.map(event => <article className="event-card" key={event.title}><div className="event-date"><strong>{event.date}</strong><span>{event.month} 2026</span></div><div className="event-content"><span>{event.label}</span><h3>{event.title}</h3><p>{event.description}</p><small>{event.details}</small></div><button type="button" onClick={() => onReserve(event.title)}>Solicitar cupo <ArrowUpRight size={18} /></button></article>)}</div></section>
}

export function ReadersClub() {
  const [form, setForm] = useState({ name: '', email: '', age: '' })
  const [sent, setSent] = useState(false)

  const update = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
    setSent(false)
  }

  const submit = event => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    console.log({ nombre: form.name, correo: form.email, edad: form.age })
    setSent(true)
  }

  return (
    <section id="club" className="readers-club section-pad">
      <div className="section-heading">
        <div>
          <span className="section-kicker">07 / CLUB DE LECTORES</span>
          <h2>Cuéntanos quién<br /><em>va a leer.</em></h2>
        </div>
        <p>Déjanos tu nombre, correo y edad para recomendarte libros y avisarte de novedades.</p>
      </div>
      <form className="club-form" onSubmit={submit}>
        <label>
          Nombre
          <input name="name" value={form.name} onChange={update} autoComplete="name" required minLength="2" placeholder="Tu nombre" />
        </label>
        <label>
          Correo
          <input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required placeholder="tucorreo@ejemplo.com" />
        </label>
        <label>
          Edad
          <input name="age" type="number" value={form.age} onChange={update} required min="1" max="120" placeholder="18" />
        </label>
        <button type="submit" className="primary-action">Enviar</button>
      </form>
      {sent && (
        <div className="form-success" role="status">
          <strong>Datos recibidos.</strong>
          <p>Hola {form.name}. Registramos el correo {form.email} y {form.age} años. En una app real aquí se enviarían al servidor.</p>
        </div>
      )}
    </section>
  )
}

export function ContactSection({ selectedEvent }) {
  const [form, setForm] = useState(() => ({ name: '', email: '', age: '', subject: selectedEvent ? `Cupo para ${selectedEvent}` : '', message: '' }))
  const [ready, setReady] = useState(false)
  const update = event => { setForm(current => ({ ...current, [event.target.name]: event.target.value })); setReady(false) }
  const submit = event => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    console.log({ nombre: form.name, correo: form.email, edad: form.age, asunto: form.subject, mensaje: form.message })
    setReady(true)
  }
  const mailto = `mailto:hola@lumenlibros.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Hola, soy ${form.name}, tengo ${form.age} años.\n\n${form.message}\n\nPuedes responderme a: ${form.email}`)}`
  return <section id="contacto" className="business-contact section-pad"><div className="contact-intro"><span className="section-kicker">08 / VISÍTANOS O ESCRÍBENOS</span><h2>Siempre hay lugar<br /><em>para otra historia.</em></h2><p>Estamos en Pereira, en el Centro Comercial Unicentro. Pasa por una recomendación o déjanos un mensaje.</p><div className="store-info"><div><MapPin size={19} /><span><strong>Dirección</strong>Centro Comercial Unicentro, Local 225, Pereira, Risaralda</span></div><div><Clock3 size={19} /><span><strong>Horarios</strong>Lunes a sábado · 10:00 a. m. – 8:00 p. m.<br />Domingos y festivos · 11:00 a. m. – 6:00 p. m.</span></div><div><Phone size={19} /><span><strong>Teléfono</strong><a href="tel:+576065550148">+57 (606) 555 0148</a></span></div><div><Mail size={19} /><span><strong>Correo</strong><a href="mailto:hola@lumenlibros.com">hola@lumenlibros.com</a></span></div></div><div className="socials"><span>SÍGUENOS</span><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram, perfil de muestra"><Camera size={18} /> Instagram <ArrowUpRight size={15} /></a><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook, perfil de muestra">Facebook <ArrowUpRight size={15} /></a></div><small className="demo-note">Datos de contacto y redes de muestra para esta demostración.</small></div><div className="contact-form-wrap"><span className="form-index">FORMULARIO DE CONTACTO / 01</span><h3>Cuéntanos qué necesitas.</h3><form onSubmit={submit}><div className="form-row"><label>Nombre completo<input name="name" value={form.name} onChange={update} autoComplete="name" required minLength="2" placeholder="Tu nombre" /></label><label>Correo electrónico<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required placeholder="tucorreo@ejemplo.com" /></label></div><label>Edad<input name="age" type="number" value={form.age} onChange={update} required min="1" max="120" placeholder="18" /></label><label>Asunto<input name="subject" value={form.subject} onChange={update} required minLength="3" placeholder="¿En qué podemos ayudarte?" /></label><label>Mensaje<textarea name="message" value={form.message} onChange={update} required rows="5" placeholder="Escribe tu mensaje aquí" /></label><button type="submit" className="primary-action">Preparar mensaje <ArrowRight size={18} /></button></form>{ready && <div className="form-success" role="status"><strong>Tu mensaje está listo.</strong><p>Ábrelo en tu aplicación de correo para enviarlo. No se ha enviado todavía.</p><a href={mailto}>Abrir correo <ArrowUpRight size={17} /></a></div>}</div></section>
}
