// Animação no input
const input = document.querySelector('input');

input.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
});

input.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
});

// Validação do formulário
document.getElementById('forgotForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        alert('Por favor, digite seu email ou usuário!');
        return;
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    const isUsername = email.length >= 3 && !email.includes('@');
    
    if (!isValidEmail && !isUsername) {
        alert('Por favor, digite um email válido ou nome de usuário (mínimo 3 caracteres)!');
        return;
    }
    
    // Animação de loading no botão
    const btn = document.querySelector('.recover-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.style.background = '#a8d8a8';
    btn.disabled = true;
    
    // Simular envio de email
    setTimeout(() => {
        // Remover formulário e mostrar mensagem de sucesso
        const form = document.getElementById('forgotForm');
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>📧 Email Enviado!</h3>
            <p>Enviamos as instruções para recuperar sua senha para <strong>${email}</strong>.</p>
            <p>Verifique sua caixa de entrada e spam.</p>
        `;
        
        form.parentNode.insertBefore(successMessage, form);
        form.style.display = 'none';
        
        // Alterar texto do link de volta
        const backLink = document.querySelector('.back-to-login p');
        backLink.innerHTML = 'Instruções enviadas! <a href="login.html" class="back-link">Voltar ao login</a>';
        
    }, 2000);
});

// Efeito de hover nos links
const links = document.querySelectorAll('a');
links.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(-3px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Validação em tempo real
document.getElementById('email').addEventListener('input', function() {
    const value = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(value);
    const isUsername = value.length >= 3 && !value.includes('@');
    
    if (value === '') {
        this.style.borderColor = '#e8f5e8';
        return;
    }
    
    if (isValidEmail || isUsername) {
        this.style.borderColor = '#a8d8a8';
        this.style.boxShadow = '0 0 0 3px rgba(168, 216, 168, 0.1)';
    } else {
        this.style.borderColor = '#ff9999';
        this.style.boxShadow = '0 0 0 3px rgba(255, 153, 153, 0.1)';
    }
});