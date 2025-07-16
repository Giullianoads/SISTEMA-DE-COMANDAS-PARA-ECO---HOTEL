// Animação nos inputs
const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');

inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Validação do formulário


document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    if (!usuario || !senha) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    const btn = document.querySelector('.login-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Entrando...';
    btn.style.background = '#a8d8a8';

    try {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, senha })
        });
        const data = await response.json();
        if (response.ok) {
            alert(`Bem-vindo ao sistema, ${data.nome}!`);
            window.location.href = '/HTML/telaprincipal.html';
        } else {
            alert(data.error || 'Erro ao fazer login.');
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    } finally {
        btn.textContent = originalText;
        btn.style.background = 'linear-gradient(135deg, #6fa8dc, #2e7d4a)';
    }
});

// Efeito de hover nos links
const links = document.querySelectorAll('a');
links.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});