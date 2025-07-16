-- Sistema de Comandas para Hotel
-- Tabelas corrigidas e otimizadas

-- Tipos ENUM para PostgreSQL
CREATE TYPE tipo_usuario_enum AS ENUM ('Supervisor', 'Funcionario');
CREATE TYPE tipo_produto_enum AS ENUM ('Produto', 'Servico');
CREATE TYPE tipo_cliente_enum AS ENUM ('Adulto', 'Crianca');
CREATE TYPE status_hospedagem_enum AS ENUM ('Ativa', 'Finalizada', 'Cancelada');
CREATE TYPE status_comanda_enum AS ENUM ('Aberta', 'Fechada', 'Cancelada');
CREATE TYPE status_item_enum AS ENUM ('Pendente', 'Preparando', 'Entregue', 'Cancelado');
CREATE TYPE forma_pagamento_enum AS ENUM ('Dinheiro', 'Cartao_Credito', 'Cartao_Debito', 'Pix', 'Transferencia', 'Outro');
CREATE TYPE acao_produto_enum AS ENUM ('Cadastro', 'Edicao', 'Exclusao', 'Ativacao', 'Desativacao');
CREATE TYPE acao_comanda_enum AS ENUM ('Abertura', 'Fechamento', 'AdicaoItem', 'RemocaoItem', 'EdicaoItem', 'Cancelamento');
CREATE TYPE acao_hospedagem_enum AS ENUM ('Checkin', 'Checkout', 'Alteracao', 'Cancelamento');

-- Tabelas
CREATE TABLE Usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario tipo_usuario_enum NOT NULL,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ProdutosServicos (
    produto_servico_id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    tipo tipo_produto_enum NOT NULL,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categorias (
    categoria_id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true
);

CREATE TABLE ProdutoServicoCategoria (
    produto_servico_id INT,
    categoria_id INT,
    PRIMARY KEY (produto_servico_id, categoria_id),
    FOREIGN KEY (produto_servico_id) REFERENCES ProdutosServicos(produto_servico_id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(categoria_id) ON DELETE CASCADE
);

CREATE TABLE Quartos (
    quarto_id SERIAL PRIMARY KEY,
    numero VARCHAR(50) NOT NULL UNIQUE,
    andar INT,
    tipo_quarto VARCHAR(100),
    capacidade INT NOT NULL,
    preco_diaria DECIMAL(10, 2),
    disponivel BOOLEAN DEFAULT true,
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Clientes (
    cliente_id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo_cliente tipo_cliente_enum NOT NULL,
    documento VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    data_nascimento DATE,
    endereco TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Hospedagens (
    hospedagem_id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    quarto_id INT NOT NULL,
    data_checkin TIMESTAMP NOT NULL,
    data_checkout TIMESTAMP,
    data_checkout_prevista TIMESTAMP,
    valor_diaria DECIMAL(10, 2),
    total_hospedagem DECIMAL(10, 2),
    status status_hospedagem_enum DEFAULT 'Ativa',
    observacoes TEXT,
    usuario_checkin_id INT,
    usuario_checkout_id INT,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id),
    FOREIGN KEY (quarto_id) REFERENCES Quartos(quarto_id),
    FOREIGN KEY (usuario_checkin_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (usuario_checkout_id) REFERENCES Usuarios(usuario_id)
);

CREATE TABLE Comandas (
    comanda_id SERIAL PRIMARY KEY,
    hospedagem_id INT NOT NULL,
    quarto_id INT NOT NULL,
    cliente_id INT NOT NULL,
    data_abertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_fechamento TIMESTAMP,
    status status_comanda_enum NOT NULL DEFAULT 'Aberta',
    valor_total DECIMAL(10, 2) DEFAULT 0.00,
    desconto DECIMAL(10, 2) DEFAULT 0.00,
    valor_final DECIMAL(10, 2) DEFAULT 0.00,
    usuario_abertura_id INT NOT NULL,
    usuario_fechamento_id INT,
    observacoes TEXT,
    FOREIGN KEY (hospedagem_id) REFERENCES Hospedagens(hospedagem_id),
    FOREIGN KEY (quarto_id) REFERENCES Quartos(quarto_id),
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id),
    FOREIGN KEY (usuario_abertura_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (usuario_fechamento_id) REFERENCES Usuarios(usuario_id)
);

CREATE TABLE ItensComanda (
    item_comanda_id SERIAL PRIMARY KEY,
    comanda_id INT NOT NULL,
    produto_servico_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    desconto_item DECIMAL(10, 2) DEFAULT 0.00,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_item status_item_enum DEFAULT 'Pendente',
    observacoes TEXT,
    usuario_id INT,
    FOREIGN KEY (comanda_id) REFERENCES Comandas(comanda_id) ON DELETE CASCADE,
    FOREIGN KEY (produto_servico_id) REFERENCES ProdutosServicos(produto_servico_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

CREATE TABLE Pagamentos (
    pagamento_id SERIAL PRIMARY KEY,
    comanda_id INT,
    hospedagem_id INT,
    valor_pago DECIMAL(10, 2) NOT NULL,
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    forma_pagamento forma_pagamento_enum NOT NULL,
    numero_transacao VARCHAR(255),
    observacoes TEXT,
    usuario_id INT,
    FOREIGN KEY (comanda_id) REFERENCES Comandas(comanda_id),
    FOREIGN KEY (hospedagem_id) REFERENCES Hospedagens(hospedagem_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

CREATE TABLE LogsProdutosServicos (
    log_id SERIAL PRIMARY KEY,
    produto_servico_id INT NOT NULL,
    usuario_id INT NOT NULL,
    acao acao_produto_enum NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valores_anteriores JSON,
    valores_novos JSON,
    detalhes TEXT,
    FOREIGN KEY (produto_servico_id) REFERENCES ProdutosServicos(produto_servico_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

CREATE TABLE LogsComandas (
    log_comanda_id SERIAL PRIMARY KEY,
    comanda_id INT NOT NULL,
    usuario_id INT NOT NULL,
    acao acao_comanda_enum NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    item_comanda_id INT,
    detalhes TEXT,
    FOREIGN KEY (comanda_id) REFERENCES Comandas(comanda_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (item_comanda_id) REFERENCES ItensComanda(item_comanda_id)
);

CREATE TABLE LogsHospedagens (
    log_hospedagem_id SERIAL PRIMARY KEY,
    hospedagem_id INT NOT NULL,
    usuario_id INT NOT NULL,
    acao acao_hospedagem_enum NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detalhes TEXT,
    FOREIGN KEY (hospedagem_id) REFERENCES Hospedagens(hospedagem_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

-- Índices para melhor performance
CREATE INDEX idx_comandas_status ON Comandas(status);
CREATE INDEX idx_comandas_data_abertura ON Comandas(data_abertura);
CREATE INDEX idx_hospedagens_status ON Hospedagens(status);
CREATE INDEX idx_hospedagens_datas ON Hospedagens(data_checkin, data_checkout);
CREATE INDEX idx_itens_comanda_status ON ItensComanda(status_item);
CREATE INDEX idx_quartos_disponivel ON Quartos(disponivel);
CREATE INDEX idx_usuarios_tipo ON Usuarios(tipo_usuario);