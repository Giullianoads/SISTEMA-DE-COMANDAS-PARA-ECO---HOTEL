// Remove todos os dados simulados e prepare para integração com API
let quartos = [];

function criarCardQuarto(quarto) {
    const statusClasses = {
        'Ocupado': 'status-ocupado',
        'Disponível': 'status-disponivel',
        'Limpeza': 'status-limpeza',
        'Manutenção': 'status-manutencao'
    };

    let conteudoQuarto = '';
    if (quarto.status === 'Ocupado') {
        conteudoQuarto = `
            <div class="room-info room-guest">${quarto.hospede || ''}</div>
            <div class="room-info">${quarto.checkin || ''} – ${quarto.checkout || ''}</div>
            <div class="room-info">${quarto.pacote || ''}</div>
            <div class="room-info">${quarto.noites || ''} noites • ${quarto.pessoas || ''}</div>
        `;
    } else {
        conteudoQuarto = `
            <div class="room-info">${quarto.info || quarto.observacoes || ''}</div>
            <div class="room-info">${quarto.vista || quarto.localizacao || ''}</div>
        `;
    }

    // Corrige para aceitar preco_diaria do banco, e previne erro se undefined
    let preco = quarto.preco_diaria || quarto.preco || 0;
    return `
        <div class="room-card" data-room-id="${quarto.quarto_id || quarto.id}" data-status="${quarto.status || (quarto.disponivel === false ? 'Ocupado' : 'Disponível')}" onclick="selecionarQuarto(${quarto.quarto_id || quarto.id})">
            <div class="room-header">
                <div class="room-number">Quarto ${quarto.numero}</div>
                <div class="status-badge ${statusClasses[quarto.status || (quarto.disponivel === false ? 'Ocupado' : 'Disponível')]}">${quarto.status || (quarto.disponivel === false ? 'Ocupado' : 'Disponível')}</div>
            </div>
            <div class="room-suite">${quarto.suite || quarto.tipo_quarto || ''}</div>
            ${conteudoQuarto}
            <div class="room-price">R$ ${Number(preco).toFixed(2)}/noite</div>
            <div class="room-footer">
                <div class="status-control">
                    <label>Status:</label>
                    <select class="status-select" onchange="alterarStatus(${quarto.quarto_id || quarto.id}, this.value)" onclick="event.stopPropagation()">
                        <option value="Ocupado" ${(quarto.status === 'Ocupado' || quarto.disponivel === false) ? 'selected' : ''}>Ocupado</option>
                        <option value="Disponível" ${(quarto.status === 'Disponível' || quarto.disponivel !== false) ? 'selected' : ''}>Disponível</option>
                        <option value="Limpeza" ${quarto.status === 'Limpeza' ? 'selected' : ''}>Limpeza</option>
                        <option value="Manutenção" ${quarto.status === 'Manutenção' ? 'selected' : ''}>Manutenção</option>
                    </select>
                </div>
                <div class="room-action">›</div>
            </div>
        </div>
    `;
}

function renderizarQuartos(quartosParaRenderizar = quartos) {
    const container = document.getElementById('roomsContainer');
    container.innerHTML = quartosParaRenderizar.map(criarCardQuarto).join('');
    atualizarEstatisticas();
}

function atualizarEstatisticas() {
    const ocupados = quartos.filter(q => q.status === 'Ocupado').length;
    const total = quartos.length;
    const percentual = Math.round((ocupados / total) * 100);
    
    document.getElementById('ocupados-count').textContent = `${ocupados}/${total}`;
    document.getElementById('ocupacao-progress').style.width = `${percentual}%`;
    
    // Aqui você pode buscar outros dados da API
    const totalHospedes = quartos.filter(q => q.status === 'Ocupado').reduce((acc, q) => {
        if (q.pessoas) {
            const adultos = parseInt(q.pessoas.match(/(\d+) adulto/)?.[1] || 0);
            const criancas = parseInt(q.pessoas.match(/(\d+) criança/)?.[1] || 0);
            return acc + adultos + criancas;
        }
        return acc;
    }, 0);
    
    document.getElementById('hospedes-count').textContent = totalHospedes;
}

function selecionarQuarto(quartoId) {
    // Busca o quarto pelo id para pegar o número
    const quarto = quartos.find(q => (q.quarto_id || q.id) == quartoId);
    if (quarto) {
        // Passa o número do quarto na URL
        window.location.href = `/HTML/quarto.html?quarto=${encodeURIComponent(quarto.numero)}`;
    } else {
        alert('Quarto não encontrado!');
    }
}

function alterarStatus(quartoId, novoStatus) {
    const quarto = quartos.find(q => q.id === quartoId);
    if (quarto) {
        quarto.status = novoStatus;
        // Aqui você faria a requisição para a API
        // await fetch(`/api/quartos/${quartoId}/status`, { method: 'PUT', body: JSON.stringify({status: novoStatus}) });
        renderizarQuartos();
    }
}

function aplicarFiltros() {
    const busca = document.getElementById('searchInput').value.toLowerCase();
    const statusFiltro = document.getElementById('statusFilter').value;
    
    let quartosFiltrados = quartos;
    
    if (busca) {
        quartosFiltrados = quartosFiltrados.filter(q => 
            q.numero.toLowerCase().includes(busca) ||
            q.suite.toLowerCase().includes(busca) ||
            (q.hospede && q.hospede.toLowerCase().includes(busca))
        );
    }
    
    if (statusFiltro) {
        quartosFiltrados = quartosFiltrados.filter(q => q.status === statusFiltro);
    }
    
    renderizarQuartos(quartosFiltrados);
}

function ordenarQuartos() {
    quartos.sort((a, b) => {
        // Ordenar por status (Ocupado primeiro) e depois por número
        const statusOrder = { 'Ocupado': 1, 'Limpeza': 2, 'Manutenção': 3, 'Disponível': 4 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        return parseInt(a.numero) - parseInt(b.numero);
    });
    renderizarQuartos();
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', aplicarFiltros);
document.getElementById('statusFilter').addEventListener('change', aplicarFiltros);

// Função para buscar quartos do backend
async function carregarDados() {
    document.getElementById('loading').style.display = 'flex';
    try {
        const response = await fetch('http://localhost:3001/api/quartos');
        quartos = await response.json();
    } catch (e) {
        alert('Erro ao carregar quartos do banco de dados.');
        quartos = [];
    }
    document.getElementById('loading').style.display = 'none';
    renderizarQuartos();
}

// Eventos para mostrar/ocultar o formulário de cadastro de quarto
document.addEventListener('DOMContentLoaded', () => {
    const btnAddRoom = document.getElementById('btnAddRoom');
    const addRoomContainer = document.getElementById('addRoomContainer');
    const btnCancelarAddRoom = document.getElementById('btnCancelarAddRoom');
    const addRoomForm = document.getElementById('addRoomForm');

    btnAddRoom.addEventListener('click', () => {
        addRoomContainer.style.display = 'block';
    });
    btnCancelarAddRoom.addEventListener('click', () => {
        addRoomContainer.style.display = 'none';
        addRoomForm.reset();
    });

    addRoomForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const numero = document.getElementById('numeroQuarto').value;
        const suite = document.getElementById('suiteQuarto').value;
        const capacidade = document.getElementById('capacidadeQuarto').value;
        const preco = document.getElementById('precoQuarto').value;
        const tipo_quarto = document.getElementById('tipoQuarto').value;
        const localizacao = document.getElementById('localizacaoQuarto').value;
        try {
            const response = await fetch('http://localhost:3001/api/quartos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numero, suite, capacidade, preco, tipo_quarto, localizacao })
            });
            if (response.ok) {
                alert('Quarto cadastrado com sucesso!');
                addRoomContainer.style.display = 'none';
                addRoomForm.reset();
                await carregarDados();
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao cadastrar quarto.');
            }
        } catch (err) {
            alert('Erro de conexão com o servidor.');
        }
    });
});

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
});

// Atualizar dados periodicamente
setInterval(() => {
    // Aqui você pode fazer polling da API para dados em tempo real
    // carregarDados();
}, 30000); // A cada 30 segundos