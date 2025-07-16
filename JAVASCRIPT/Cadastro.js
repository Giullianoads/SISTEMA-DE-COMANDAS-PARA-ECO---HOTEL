// Função para alternar visibilidade da senha
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const button = input.nextElementSibling;
            
            if (input.type === 'password') {
                input.type = 'text';
                button.innerHTML = '🙈';
            } else {
                input.type = 'password';
                button.innerHTML = '👁️';
            }
        }

        // Formatação de CPF
        document.getElementById('cpf').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });

        // Formatação de telefone
        document.getElementById('telefone').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });

        // Verificação de força da senha
        document.getElementById('senha').addEventListener('input', function(e) {
            const password = e.target.value;
            const strengthDiv = document.getElementById('passwordStrength');
            
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^a-zA-Z0-9]/)) strength++;
            
            strengthDiv.className = 'password-strength';
            if (strength === 1) strengthDiv.classList.add('weak');
            else if (strength === 2 || strength === 3) strengthDiv.classList.add('medium');
            else if (strength === 4) strengthDiv.classList.add('strong');
            
            checkPasswordMatch();
        });

        // Verificação de confirmação de senha
        document.getElementById('confirmarSenha').addEventListener('input', checkPasswordMatch);

        function checkPasswordMatch() {
            const password = document.getElementById('senha').value;
            const confirmPassword = document.getElementById('confirmarSenha').value;
            const matchDiv = document.getElementById('passwordMatch');
            
            if (confirmPassword === '') {
                matchDiv.textContent = '';
                matchDiv.className = 'password-match';
            } else if (password === confirmPassword) {
                matchDiv.textContent = '✓ Senhas coincidem';
                matchDiv.className = 'password-match match';
            } else {
                matchDiv.textContent = '✗ Senhas não coincidem';
                matchDiv.className = 'password-match no-match';
            }
        }

        // Validação do formulário
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('senha').value;
            const confirmPassword = document.getElementById('confirmarSenha').value;
            
            if (senha !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }
            
            if (senha.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres!');
                return;
            }

            // Envio dos dados para o backend
            try {
                const response = await fetch('http://localhost:3001/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, senha, usuario, cpf, telefone })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Cadastro realizado com sucesso!');
                    window.location.href = 'login.html';
                } else {
                    alert(data.error || 'Erro ao cadastrar.');
                }
            } catch (error) {
                alert('Erro de conexão com o servidor.');
            }
        });