-- V1: Criação das 7 tabelas de domínio e constraints críticas (Shopping Analytics & Loyalty Hub)

CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    CONSTRAINT uk_categorias_nome UNIQUE (nome)
);

CREATE TABLE lojas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnpj VARCHAR(14) NOT NULL,
    nome VARCHAR(150) NOT NULL,
    categoria_id UUID NOT NULL REFERENCES categorias(id),
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_lojas_cnpj UNIQUE (cnpj)
);

CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cpf_hash VARCHAR(64) NOT NULL,
    cpf_mascarado VARCHAR(14) NOT NULL,
    nome VARCHAR(150) NOT NULL,
    consentimento_lgpd BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_clientes_cpf_hash UNIQUE (cpf_hash)
);

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    cliente_id UUID REFERENCES clientes(id),
    loja_id UUID REFERENCES lojas(id),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_usuarios_email UNIQUE (email),
    CONSTRAINT ck_usuarios_role CHECK (role IN ('CONSUMIDOR', 'LOJISTA', 'ADMIN_SHOPPING'))
);

CREATE TABLE notas_fiscais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave_acesso CHAR(44) NOT NULL,
    cliente_id UUID NOT NULL REFERENCES clientes(id),
    loja_id UUID NOT NULL REFERENCES lojas(id),
    valor_total NUMERIC(10, 2) NOT NULL,
    data_emissao TIMESTAMPTZ NOT NULL,
    data_cadastro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT uk_notas_fiscais_chave_acesso UNIQUE (chave_acesso),
    CONSTRAINT ck_notas_fiscais_valor_positivo CHECK (valor_total > 0),
    CONSTRAINT ck_notas_fiscais_status CHECK (status IN ('APROVADA', 'REJEITADA'))
);

CREATE TABLE vouchers_estacionamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id),
    data_referencia DATE NOT NULL,
    valor_acumulado NUMERIC(10, 2) NOT NULL,
    codigo_qr VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'LIBERADO',
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_vouchers_codigo_qr UNIQUE (codigo_qr),
    CONSTRAINT uk_voucher_cliente_data UNIQUE (cliente_id, data_referencia),
    CONSTRAINT ck_vouchers_valor_acumulado CHECK (valor_acumulado >= 0),
    CONSTRAINT ck_vouchers_status CHECK (status IN ('LIBERADO', 'UTILIZADO', 'EXPIRADO'))
);

CREATE TABLE campanhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loja_id UUID NOT NULL REFERENCES lojas(id),
    titulo VARCHAR(150) NOT NULL,
    desconto_percentual INTEGER NOT NULL,
    criterio_alvo VARCHAR(100) NOT NULL,
    publico_atingido INTEGER NOT NULL DEFAULT 0,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_campanhas_desconto CHECK (desconto_percentual BETWEEN 1 AND 100),
    CONSTRAINT ck_campanhas_publico CHECK (publico_atingido >= 0)
);

CREATE INDEX idx_lojas_categoria_id ON lojas(categoria_id);
CREATE INDEX idx_notas_fiscais_cliente_emissao ON notas_fiscais(cliente_id, data_emissao);
CREATE INDEX idx_notas_fiscais_loja_emissao ON notas_fiscais(loja_id, data_emissao);

