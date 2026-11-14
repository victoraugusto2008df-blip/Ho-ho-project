-- V3: clientes inativos há mais de 60 dias na loja do lojista de demonstração (Zara Shopping Hub),
-- para a campanha "Clientes da sua loja inativos há 60 dias" ter público maior que zero (AD-030).

INSERT INTO clientes (id, cpf_hash, cpf_mascarado, nome, consentimento_lgpd) VALUES
    ('33333333-3333-3333-3333-333333333304', 'a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff04', '***.555.666-**', 'Pedro Alves', TRUE),
    ('33333333-3333-3333-3333-333333333305', 'a1b2c3d4e5f60718293a4b5c6d7e8f90112233445566778899aabbccddeeff05', '***.777.888-**', 'Julia Rocha', TRUE);

INSERT INTO notas_fiscais (id, chave_acesso, cliente_id, loja_id, valor_total, data_emissao, data_cadastro, status) VALUES
    ('55555555-5555-5555-5555-555555555516', '35261111111111000101650010000000160000000016', '33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222201', 120.00, DATE_TRUNC('day', CURRENT_TIMESTAMP) - INTERVAL '75 days' + INTERVAL '15 hours', CURRENT_TIMESTAMP - INTERVAL '75 days', 'APROVADA'),
    ('55555555-5555-5555-5555-555555555517', '35261111111111000101650010000000170000000017', '33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222201', 80.00, DATE_TRUNC('day', CURRENT_TIMESTAMP) - INTERVAL '90 days' + INTERVAL '17 hours', CURRENT_TIMESTAMP - INTERVAL '90 days', 'APROVADA');
