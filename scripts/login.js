            function switchToSignup() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            
            loginForm.style.opacity = '0';
            loginForm.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
                signupForm.style.opacity = '0';
                signupForm.style.transform = 'translateX(20px)';
                
                setTimeout(() => {
                    signupForm.style.opacity = '1';
                    signupForm.style.transform = 'translateX(0)';
                }, 10);
            }, 200);
        }

        function switchToLogin() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            
            signupForm.style.opacity = '0';
            signupForm.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                signupForm.style.display = 'none';
                loginForm.style.display = 'block';
                loginForm.style.opacity = '0';
                loginForm.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    loginForm.style.opacity = '1';
                    loginForm.style.transform = 'translateX(0)';
                }, 10);
            }, 200);
        }

        // Form submission handlers
        document.getElementById('loginFormElement').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Login functionality would be implemented here');
        });

        document.getElementById('signupFormElement').addEventListener('submit', function(e) {
            e.preventDefault();
            const password = e.target.querySelector('input[type="password"]').value;
            const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            alert('Signup functionality would be implemented here');
        });

        // Social login handlers
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const provider = this.textContent.trim();
                alert(`${provider} login would be implemented here`);
            });
        });
    