// Firebase Web configuration and initialization
// Loads public config from backend using env vars, then initializes Firebase

async function loadPublicFirebaseConfig() {
  const res = await fetch('http://localhost:8000/api/v1/auth/firebase-config')
  let json
  try {
    json = await res.json()
  } catch (_) {
    // ignore
  }
  if (!res.ok) {
    const message = (json && (json.message || json.error || json.errors)) || res.statusText
    throw new Error(`Backend config error: ${message}`)
  }
  const cfg = json?.data || {}
  const required = ['apiKey','authDomain','projectId','appId']
  const missing = required.filter(k => !cfg[k])
  if (missing.length) {
    throw new Error(`Missing Firebase web config keys: ${missing.join(', ')}`)
  }
  return cfg
}

export async function initFirebaseApp() {
  const firebaseConfig = await loadPublicFirebaseConfig()
  const [appModule, authModule] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
  ])
  const { initializeApp } = appModule
  const { getAuth } = authModule
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  return { app, auth, authModule }
}


