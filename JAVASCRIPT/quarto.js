// Adiciona eventos de clique a todos os cards de quarto
document.addEventListener('DOMContentLoaded', function() {
    const roomCards = document.querySelectorAll('.room-clickable');
    
    roomCards.forEach(card => {
        card.addEventListener('click', function() {
            // Pega o número do quarto do atributo data-room
            const roomNumber = this.getAttribute('data-room');
            
            // Redireciona para o painel do quarto com o número como parâmetro
            window.location.href = `/HTML/quarto.html?quarto=${roomNumber}`;
        });
    });
    
    // Adiciona estilo de cursor pointer para os cards clicáveis
    const style = document.createElement('style');
    style.textContent = `
        .room-clickable {
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .room-clickable:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
});