import { useEffect, useState } from 'react'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
  useUser,
} from '@clerk/clerk-react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'

const initialForm = {
  name: '',
  repository: '',
  sourceWebhookSecret: '',
  destinationWebhookUrl: '',
}

const initialView = {
  mode: 'list',
  editId: null,
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button className="button secondary copy-button" type="button" onClick={handleCopy}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function HomePage() {
  const { isLoaded, user } = useUser()

  if (!isLoaded) {
    return <p className="muted">Loading your session…</p>
  }

  return (
    <section className="hero-card">
      <div className="hero-copy">
        <p className="eyebrow">ORBYT</p>
        <h1>Connect GitHub issues to Discord with your own Orbyt.</h1>
        <p>
          Create an Orbyt for your repository, paste its unique webhook URL into GitHub,
          and receive Discord notifications without sharing endpoints with other users.
        </p>
      </div>

      <div className="hero-actions">
        <SignedOut>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </SignedOut>

        <SignedIn>
          <Link className="button primary" to="/dashboard">
            Open dashboard
          </Link>
          <p className="muted">Signed in as {user?.fullName || user?.primaryEmailAddress?.emailAddress}</p>
        </SignedIn>
      </div>
    </section>
  )
}

function DashboardPage() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [orbyts, setOrbyts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [view, setView] = useState(initialView)
  const [logsByOrbyt, setLogsByOrbyt] = useState({})
  const [logsLoadingByOrbyt, setLogsLoadingByOrbyt] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [createdWebhookUrl, setCreatedWebhookUrl] = useState(null)

  const loadOrbyts = async () => {
    const token = await getToken()
    const response = await fetch('/api/subscriptions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Unable to load your Orbyts right now.')
    }

    const payload = await response.json()
    setOrbyts(payload.data || [])
  }

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    loadOrbyts()
      .catch((error) => {
        setFeedback({ type: 'error', message: error.message })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [getToken, isLoaded])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const resetCreateView = () => {
    setForm(initialForm)
    setView(initialView)
    setCreatedWebhookUrl(null)
  }

  const openCreateMode = () => {
    setForm(initialForm)
    setCreatedWebhookUrl(null)
    setFeedback(null)
    setView({ mode: 'create', editId: null })
  }

  const openEditMode = (orbyt) => {
    setForm({
      name: orbyt.name || '',
      repository: orbyt.repository || '',
      sourceWebhookSecret: orbyt.sourceWebhookSecret || '',
      destinationWebhookUrl: orbyt.destinationWebhookUrl || '',
    })
    setCreatedWebhookUrl(orbyt.webhookUrl || null)
    setFeedback(null)
    setView({ mode: 'edit', editId: orbyt.id })
  }

  const toggleLogs = async (orbytId) => {
    if (logsByOrbyt[orbytId]) {
      setLogsByOrbyt((current) => {
        const clone = { ...current }
        delete clone[orbytId]
        return clone
      })
      return
    }

    setLogsLoadingByOrbyt((current) => ({ ...current, [orbytId]: true }))
    try {
      const token = await getToken()
      const response = await fetch(`/api/subscriptions/${orbytId}/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to load logs right now.')
      }

      setLogsByOrbyt((current) => ({ ...current, [orbytId]: payload.data || [] }))
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setLogsLoadingByOrbyt((current) => ({ ...current, [orbytId]: false }))
    }
  }

  const deleteOrbyt = async (orbytId) => {
    const confirmed = window.confirm('Delete this Orbyt? This also removes its logs.')
    if (!confirmed) {
      return
    }

    try {
      const token = await getToken()
      const response = await fetch(`/api/subscriptions/${orbytId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to delete the Orbyt.')
      }

      setFeedback({ type: 'success', message: 'Orbyt deleted.' })
      await loadOrbyts()
      if (view.mode === 'edit' && view.editId === orbytId) {
        resetCreateView()
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setFeedback(null)
    setCreatedWebhookUrl(null)

    try {
      const token = await getToken()
      const isEdit = view.mode === 'edit' && view.editId
      const response = await fetch(isEdit ? `/api/subscriptions/${view.editId}` : '/api/subscriptions', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to create the Orbyt.')
      }

      const createdOrUpdatedUrl = payload.data?.webhookUrl || null
      setForm(initialForm)
      setCreatedWebhookUrl(payload.data?.webhookUrl || null)
      setFeedback({
        type: 'success',
        message: isEdit
          ? 'Orbyt updated.'
          : 'Orbyt created. Add the GitHub webhook URL below to your repository settings.',
      })
      await loadOrbyts()
      if (isEdit) {
        setCreatedWebhookUrl(createdOrUpdatedUrl)
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="dashboard-card">
      <div className="topbar">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Welcome back, {user?.firstName || 'there'}.</h2>
        </div>
        <div className="topbar-actions">
          {view.mode === 'list' ? (
            <button className="button primary" type="button" onClick={openCreateMode}>
              Create an Orbyt
            </button>
          ) : (
            <button className="button secondary" type="button" onClick={resetCreateView}>
              Back to Orbyts
            </button>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {view.mode !== 'list' ? (
        <form className="panel form-panel create-panel" onSubmit={handleSubmit}>
          <div className="section-heading">
            <h3>{view.mode === 'edit' ? 'Edit Orbyt' : 'Create a new Orbyt'}</h3>
            <p>Fields marked with <span className="required">*</span> are required.</p>
          </div>

          <div className="field-group">
            <label htmlFor="name">Orbyt name <span className="required">*</span></label>
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Release notifications" required />
          </div>

          <div className="field-group">
            <label htmlFor="repository">GitHub repository <span className="required">*</span></label>
            <input id="repository" name="repository" value={form.repository} onChange={handleChange} placeholder="owner/repo" required />
          </div>

          <div className="field-group">
            <label htmlFor="sourceWebhookSecret">GitHub webhook secret <span className="required">*</span></label>
            <input id="sourceWebhookSecret" name="sourceWebhookSecret" value={form.sourceWebhookSecret} onChange={handleChange} placeholder="Secret from GitHub webhook settings" required />
          </div>

          <div className="field-group">
            <label htmlFor="destinationWebhookUrl">Discord webhook URL <span className="required">*</span></label>
            <input id="destinationWebhookUrl" name="destinationWebhookUrl" value={form.destinationWebhookUrl} onChange={handleChange} placeholder="https://discord.com/api/webhooks/..." required />
          </div>

          {createdWebhookUrl ? (
            <div className="webhook-url-box">
              <p className="webhook-url-label">Your GitHub payload URL</p>
              <div className="webhook-url-row">
                <code className="webhook-url">{createdWebhookUrl}</code>
                <CopyButton value={createdWebhookUrl} />
              </div>
              <p className="muted webhook-hint">Paste this URL into GitHub → Settings → Webhooks → Payload URL.</p>
            </div>
          ) : null}

          <button className="button primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : view.mode === 'edit' ? 'Update Orbyt' : 'Create Orbyt'}
          </button>

          {feedback ? <p className={`feedback ${feedback.type}`}>{feedback.message}</p> : null}
        </form>
      ) : (
        <div className="panel list-panel full-width">
          <div className="section-heading">
            <h3>Your Orbyts</h3>
            <p>All your created Orbyts appear here. Open logs, edit details, or delete when needed.</p>
          </div>

          {isLoading ? (
            <p className="muted">Loading your Orbyts…</p>
          ) : orbyts.length === 0 ? (
            <p className="muted">No Orbyts yet. Create one to get your webhook URL.</p>
          ) : (
            <div className="orbyt-list">
              {orbyts.map((orbyt) => (
                <article key={orbyt.id} className="orbyt-item">
                  <div className="orbyt-item-header">
                    <div>
                      <strong>{orbyt.name}</strong>
                      <p>{orbyt.repository}</p>
                    </div>
                    <span className={`status-pill ${orbyt.active ? 'active' : 'inactive'}`}>
                      {orbyt.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {orbyt.webhookUrl ? (
                    <div className="webhook-url-row compact">
                      <code className="webhook-url">{orbyt.webhookUrl}</code>
                      <CopyButton value={orbyt.webhookUrl} />
                    </div>
                  ) : null}
                  <div className="item-actions">
                    <button className="button secondary small" type="button" onClick={() => openEditMode(orbyt)}>
                      Edit
                    </button>
                    <button className="button secondary small" type="button" onClick={() => toggleLogs(orbyt.id)}>
                      {logsByOrbyt[orbyt.id] ? 'Hide Logs' : 'View Logs'}
                    </button>
                    <button className="button danger small" type="button" onClick={() => deleteOrbyt(orbyt.id)}>
                      Delete
                    </button>
                  </div>
                  {logsLoadingByOrbyt[orbyt.id] ? <p className="muted">Loading logs…</p> : null}
                  {logsByOrbyt[orbyt.id] ? (
                    logsByOrbyt[orbyt.id].length === 0 ? (
                      <p className="muted">No logs for this Orbyt yet.</p>
                    ) : (
                      <div className="logs-list">
                        {logsByOrbyt[orbyt.id].map((log) => (
                          <div key={log.id} className="log-item">
                            <p className="log-meta">
                              {log.eventType || 'issues'} - {new Date(log.sentAt).toLocaleString()}
                            </p>
                            <p>{log.message}</p>
                          </div>
                        ))}
                      </div>
                    )
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <section className="hero-card">
          <p className="eyebrow">Access required</p>
          <h2>Please sign in to view your dashboard.</h2>
          <div className="hero-actions">
            <SignInButton mode="modal" />
            <Link className="button secondary" to="/">
              Back home
            </Link>
          </div>
        </section>
      </SignedOut>
    </>
  )
}

function App() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const isConfigured = Boolean(publishableKey && publishableKey !== 'your_clerk_publishable_key')

  if (!isConfigured) {
    return (
      <main className="app-shell">
        <section className="hero-card">
          <p className="eyebrow">Clerk setup required</p>
          <h1>Add your Clerk publishable key to the web environment.</h1>
          <p>
            Create a <code>.env.local</code> file in the web folder with a valid
            <code>VITE_CLERK_PUBLISHABLE_KEY</code> value to enable sign-in.
          </p>
        </section>
      </main>
    )
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <BrowserRouter>
        <main className="app-shell">
          <nav className="top-nav">
            <Link to="/">ORBYT</Link>
            <div className="nav-actions">
              <Link to="/">Home</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ClerkProvider>
  )
}

export default App
