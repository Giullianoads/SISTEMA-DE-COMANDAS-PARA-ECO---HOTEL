document.addEventListener('DOMContentLoaded', function() {
    // Objeto com as ações e mensagens de confirmação
    const modalActions = {
        pedidosBtn: {
            title: "Sistema de Pedidos",
            content: `
                <div class="modal-section">
                    <h3>Cardápio</h3>
                    <select class="modal-select" id="pedidoSelect">
                        <option value="cafe">Café da Manhã - R$ 25,00</option>
                        <option value="almoco">Almoço - R$ 45,00</option>
                        <option value="jantar">Jantar - R$ 50,00</option>
                    </select>
                    <div class="modal-quantity">
                        <label>Quantidade:</label>
                        <input type="number" id="pedidoQtd" min="1" value="1">
                    </div>
                    <button class="modal-action-btn" id="confirmarPedido">Enviar Pedido</button>
                </div>
            `,
            confirmMessage: "Pedido enviado com sucesso! O serviço de quarto será notificado."
        },
        passeiosBtn: {
            title: "Agendamento de Passeios",
            content: `
                <div class="modal-section">
                    <h3>Passeios Disponíveis</h3>
                    <select class="modal-select" id="passeioSelect">
                        <option value="barco">Passeio de Barco - R$ 120,00</option>
                        <option value="trilha">Trilha Ecológica - R$ 80,00</option>
                        <option value="focagem">Focagem Noturna - R$ 150,00</option>
                    </select>
                    <div class="modal-datetime">
                        <label>Data:</label>
                        <input type="date" id="passeioData">
                        <label>Hora:</label>
                        <input type="time" id="passeioHora">
                    </div>
                    <div class="modal-participants">
                        <label>Participantes:</label>
                        <input type="number" id="passeioParticipantes" min="1" value="1">
                    </div>
                    <button class="modal-action-btn" id="confirmarPasseio">Confirmar Reserva</button>
                </div>
            `,
            confirmMessage: "Reserva confirmada! Você receberá um comprovante por e-mail."
        },
        hospedagemBtn: {
            title: "Serviços de Hospedagem",
            content: `
                <div class="modal-section">
                    <h3>Serviços Disponíveis</h3>
                    <div class="modal-checkbox-group">
                        <label><input type="checkbox" id="limpeza"> Limpeza Diária (+R$ 20,00/dia)</label>
                        <label><input type="checkbox" id="servicoQuarto"> Serviço de Quarto 24h</label>
                        <label><input type="checkbox" id="despertar"> Chamada de Despertar</label>
                    </div>
                    <div class="modal-notes">
                        <label>Observações:</label>
                        <textarea id="hospedagemObs" rows="3"></textarea>
                    </div>
                    <button class="modal-action-btn" id="confirmarHospedagem">Solicitar Serviços</button>
                </div>
            `,
            confirmMessage: "Serviços solicitados! Nossa equipe será notificada."
        },
        contaBtn: {
            title: "Fechamento de Conta",
            content: `
                <div class="modal-section">
                    <h3>Resumo Financeiro</h3>
                    <div class="modal-summary">
                        <div class="summary-item">
                            <span>Hospedagem:</span>
                            <span>R$ 1.200,00</span>
                        </div>
                        <div class="summary-item">
                            <span>Alimentação:</span>
                            <span>R$ 320,50</span>
                        </div>
                        <div class="summary-item">
                            <span>Passeios:</span>
                            <span>R$ 240,00</span>
                        </div>
                        <div class="summary-item total">
                            <span>Total:</span>
                            <span>R$ 1.760,50</span>
                        </div>
                    </div>
                    <div class="modal-payment">
                        <label>Forma de Pagamento:</label>
                        <select id="formaPagamento">
                            <option value="credito">Cartão de Crédito</option>
                            <option value="debito">Cartão de Débito</option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="transferencia">Transferência Bancária</option>
                        </select>
                    </div>
                    <button class="modal-action-btn finalizar" id="confirmarFechamento">Finalizar Estadia</button>
                </div>
            `,
            confirmMessage: "Conta fechada com sucesso! Obrigado pela preferência."
        }
    };

    // Função para mostrar confirmação
    function showConfirmation(message, modalContainer) {
        const confirmationHTML = `
            <div class="confirmation-overlay">
                <div class="confirmation-box">
                    <div class="confirmation-icon">✓</div>
                    <h3>Confirmação</h3>
                    <p>${message}</p>
                    <button class="confirmation-ok">OK</button>
                </div>
            </div>
        `;
        
        modalContainer.innerHTML += confirmationHTML;
        
        // Fechar ao clicar em OK
        modalContainer.querySelector('.confirmation-ok').onclick = () => {
            modalContainer.remove();
        };
    }

    // Sistema de Modal Dinâmico
    function createModal(title, content, confirmMessage) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'ecopantanal-modal';
        modalContainer.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${title}</h2>
                ${content}
            </div>
        `;
        
        document.body.appendChild(modalContainer);
        
        // Fechar modal
        modalContainer.querySelector('.close-modal').onclick = () => {
            modalContainer.remove();
        };
        
        // Fechar ao clicar fora
        modalContainer.onclick = (e) => {
            if (e.target === modalContainer) {
                modalContainer.remove();
            }
        };
        
        // Retornar o container para adicionar eventos específicos
        return modalContainer;
    }

    // Atribuir eventos aos botões principais
    Object.keys(modalActions).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.onclick = () => {
                const { title, content, confirmMessage } = modalActions[btnId];
                const modalContainer = createModal(title, content, confirmMessage);
                
                // Adicionar eventos específicos para cada modal
                switch(btnId) {
                    case 'pedidosBtn':
                        modalContainer.querySelector('#confirmarPedido').onclick = () => {
                            const pedido = modalContainer.querySelector('#pedidoSelect').value;
                            const quantidade = modalContainer.querySelector('#pedidoQtd').value;
                            console.log(`Pedido confirmado: ${quantidade}x ${pedido}`);
                            showConfirmation(confirmMessage, modalContainer);
                        };
                        break;
                        
                    case 'passeiosBtn':
                        modalContainer.querySelector('#confirmarPasseio').onclick = () => {
                            const passeio = modalContainer.querySelector('#passeioSelect').value;
                            const data = modalContainer.querySelector('#passeioData').value;
                            const hora = modalContainer.querySelector('#passeioHora').value;
                            const participantes = modalContainer.querySelector('#passeioParticipantes').value;
                            console.log(`Passeio confirmado: ${passeio} para ${data} às ${hora} com ${participantes} participantes`);
                            showConfirmation(confirmMessage, modalContainer);
                        };
                        break;
                        
                    case 'hospedagemBtn':
                        modalContainer.querySelector('#confirmarHospedagem').onclick = () => {
                            const limpeza = modalContainer.querySelector('#limpeza').checked;
                            const servicoQuarto = modalContainer.querySelector('#servicoQuarto').checked;
                            const despertar = modalContainer.querySelector('#despertar').checked;
                            const observacoes = modalContainer.querySelector('#hospedagemObs').value;
                            console.log(`Serviços solicitados: Limpeza=${limpeza}, Serviço24h=${servicoQuarto}, Despertar=${despertar}, Obs:${observacoes}`);
                            showConfirmation(confirmMessage, modalContainer);
                        };
                        break;
                        
                    case 'contaBtn':
                        modalContainer.querySelector('#confirmarFechamento').onclick = () => {
                            const pagamento = modalContainer.querySelector('#formaPagamento').value;
                            console.log(`Conta fechada com pagamento via ${pagamento}`);
                            showConfirmation(confirmMessage, modalContainer);
                        };
                        break;
                }
            };
        } else {
            console.error(`Botão ${btnId} não encontrado!`);
        }
    });
    fetch('/api/pedidos', {
    method: 'POST',
    body: JSON.stringify({
        item: pedido,
        quantidade: quantidade
    }),
    headers: {
        'Content-Type': 'application/json'
    }
})
});