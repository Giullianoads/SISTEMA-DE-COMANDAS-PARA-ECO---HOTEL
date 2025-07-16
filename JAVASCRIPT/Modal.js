document.addEventListener('DOMContentLoaded', function() {
    // Pega o número do quarto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const numeroQuarto = urlParams.get('quarto') || '000';
    
    // Atualiza o título do quarto
    document.getElementById('roomName').textContent = `QUARTO ${numeroQuarto}`;
    
    // Aqui você pode adicionar o restante da lógica do painel de quarto
    // como os gráficos, modais, etc. que mostramos anteriormente
    
    console.log(`Painel do quarto ${numeroQuarto} carregado`);
});