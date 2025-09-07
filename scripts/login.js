            import { initFirebaseApp } from './firebase-config.js'
            const firebaseReady = initFirebaseApp()

            function animateSwap(hideEl, showEl, dir) {
                hideEl.style.opacity = '0'
                hideEl.style.transform = dir === 'left' ? 'translateX(-20px)' : 'translateX(20px)'
                setTimeout(() => {
                    hideEl.style.display = 'none'
                    showEl.style.display = 'block'
                    showEl.style.opacity = '0'
                    showEl.style.transform = dir === 'left' ? 'translateX(20px)' : 'translateX(-20px)'
                    setTimeout(() => {
                        showEl.style.opacity = '1'
                        showEl.style.transform = 'translateX(0)'
                    }, 10)
                }, 200)
            }

            function switchToSignup() {
                const loginForm = document.getElementById('loginForm')
                const signupForm = document.getElementById('signupForm')
                animateSwap(loginForm, signupForm, 'left')
            }

            function switchToLogin() {
                const loginForm = document.getElementById('loginForm')
                const signupForm = document.getElementById('signupForm')
                animateSwap(signupForm, loginForm, 'right')
            }

            window.switchToSignup = switchToSignup
            window.switchToLogin = switchToLogin

            async function afterAuth(user) {
                const idToken = await user.getIdToken()
                localStorage.setItem('eduverse_id_token', idToken)
                try {
                    await fetch('http://localhost:8000/api/v1/auth/verify', {
                        headers: { Authorization: `Bearer ${idToken}` }
                    })
                } catch (_) {}
                window.location.href = '../pages/index.html'
            }

            // Form submission handlers
            document.getElementById('loginFormElement').addEventListener('submit', async function(e) {
                e.preventDefault()
                const email = document.getElementById('loginEmail').value.trim()
                const password = document.getElementById('loginPassword').value
                try {
                    const { auth, authModule } = await firebaseReady
                    const cred = await authModule.signInWithEmailAndPassword(auth, email, password)
                    await afterAuth(cred.user)
                } catch (err) {
                    alert(err.message || 'Failed to sign in')
                }
            })

            document.getElementById('signupFormElement').addEventListener('submit', async function(e) {
                e.preventDefault()
                const name = document.getElementById('signupName').value.trim()
                const email = document.getElementById('signupEmail').value.trim()
                const password = document.getElementById('signupPassword').value
                const confirmPassword = document.getElementById('signupConfirm').value
                if (password !== confirmPassword) { alert('Passwords do not match'); return }
                try {
                    const { auth, authModule } = await firebaseReady
                    const cred = await authModule.createUserWithEmailAndPassword(auth, email, password)
                    if (name) { await authModule.updateProfile(cred.user, { displayName: name }) }
                    await afterAuth(cred.user)
                } catch (err) {
                    alert(err.message || 'Failed to sign up')
                }
            })

            // Social login handlers
            document.querySelectorAll('.social-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const providerText = this.textContent.trim()
                    if (providerText.includes('Google')) {
                        try {
                            const { auth, authModule } = await firebaseReady
                            const provider = new authModule.GoogleAuthProvider()
                            const result = await authModule.signInWithPopup(auth, provider)
                            await afterAuth(result.user)
                        } catch (err) {
                            alert(err.message || 'Google sign-in failed')
                        }
                    } else {
                        alert('Social login not implemented')
                    }
                })
            })
    