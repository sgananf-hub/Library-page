import { useEffect, useState } from 'react'
import './Community.css'

const API = 'https://jsonplaceholder.typicode.com'

export default function Community() {
  const [users, setUsers] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [posts, setPosts] = useState([])
  const [usersState, setUsersState] = useState('loading')
  const [postsState, setPostsState] = useState('idle')
  const [usersRetry, setUsersRetry] = useState(0)
  const [postsRetry, setPostsRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    async function loadUsers() {
      setUsersState('loading')
      try {
        const response = await fetch(`${API}/users`, { signal: controller.signal })
        if (!response.ok) throw new Error('Error al consultar usuarios')
        const data = await response.json()
        setUsers(data)
        setUsersState('success')
      } catch (error) {
        if (error.name !== 'AbortError') setUsersState('error')
      }
    }
    loadUsers()
    return () => controller.abort()
  }, [usersRetry])

  useEffect(() => {
    if (!selectedId) return
    const controller = new AbortController()
    async function loadPosts() {
      setPosts([])
      setPostsState('loading')
      try {
        const response = await fetch(`${API}/posts?userId=${selectedId}`, { signal: controller.signal })
        if (!response.ok) throw new Error('Error al consultar publicaciones')
        const data = await response.json()
        setPosts(data)
        setPostsState('success')
      } catch (error) {
        if (error.name !== 'AbortError') setPostsState('error')
      }
    }
    loadPosts()
    return () => controller.abort()
  }, [selectedId, postsRetry])

  const selectedUser = users.find(user => String(user.id) === selectedId)
  return <section id="comunidad" className="community-section section-pad">
    <div className="section-heading"><div><span className="section-kicker">COMUNIDAD / VOCES Y PUBLICACIONES</span><h2>Historias que<br /><em>nos conectan.</em></h2></div><p>Explora los perfiles y publicaciones de ejemplo de JSONPlaceholder. Los textos se muestran tal como los devuelve la API.</p></div>
    <div className="community-layout">
      <div className="community-users"><h3>Usuarios</h3><p className="community-hint">Selecciona una persona para ver sus publicaciones.</p>
        {usersState === 'loading' && <p role="status">Cargando usuarios...</p>}
        {usersState === 'error' && <div role="alert"><p>No se pudieron cargar los usuarios. Revisa tu conexión.</p><button className="community-retry" onClick={() => setUsersRetry(value => value + 1)}>Reintentar</button></div>}
        {usersState === 'success' && <div className="user-list">{users.map(user => <button type="button" key={user.id} className={`user-card ${selectedId === String(user.id) ? 'selected' : ''}`} onClick={() => setSelectedId(String(user.id))} aria-pressed={selectedId === String(user.id)}><strong>{user.name}</strong><span>{user.email}</span><span>{user.company.name}</span></button>)}</div>}
      </div>
      <div className="community-posts" aria-live="polite"><span className="section-kicker">PUBLICACIONES</span><h3>{selectedUser ? selectedUser.name : 'Elige un usuario'}</h3>
        {postsState === 'idle' && <p>Sus publicaciones aparecerán aquí.</p>}
        {postsState === 'loading' && <p role="status">Cargando publicaciones...</p>}
        {postsState === 'error' && <div role="alert"><p>No se pudieron cargar las publicaciones. Revisa tu conexión.</p><button className="community-retry" onClick={() => setPostsRetry(value => value + 1)}>Reintentar</button></div>}
        {postsState === 'success' && (posts.length ? <div className="post-list">{posts.map(post => <article className="post-card" key={post.id}><h4>{post.title}</h4><p>{post.body}</p></article>)}</div> : <p>Este usuario no tiene publicaciones.</p>)}
      </div>
    </div>
  </section>
}
