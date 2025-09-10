const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use(express.static(__dirname));

// CACHE INTELIGENTE - Carrega dados uma vez na memória
let cacheDados = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Função para carregar dados com cache
function carregarDados() {
    const agora = Date.now();
    
    // Se cache existe e não expirou, retorna cache
    if (cacheDados && (agora - cacheTimestamp) < CACHE_DURATION) {
        console.log('📦 Retornando dados do CACHE');
        return cacheDados;
    }
    
    console.log('🔄 Carregando dados do arquivo...');
    const inicio = Date.now();
    
    try {
        const dados = fs.readFileSync('servidor-invertido.txt', 'utf8');
        const linhas = dados.trim().split('\n');
        
        // Detectar formato automaticamente
        let cabecalho, registros;
        
        // Verificar se tem cabeçalho
        const temCabecalho = linhas[0].includes('CPF,AG,NOME,IDADE,TELEFONE,UF') || 
                            linhas[0].includes('CPF,AG,NOME,IDADE,UF,TELEFONE') ||
                            linhas[0].includes('TELEFONE,CPF,AG,NOME,IDADE,UF');
        
        if (temCabecalho) {
            // Formato com cabeçalho: CPF,AG,NOME,IDADE,TELEFONE,UF
            console.log('📋 Formato detectado: COM CABEÇALHO');
            cabecalho = linhas[0].split(',');
            registros = linhas.slice(1).map(linha => {
                const valores = linha.split(',');
                const registro = {};
                cabecalho.forEach((coluna, index) => {
                    registro[coluna.trim()] = valores[index] ? valores[index].trim() : '';
                });
                return registro;
            });
        } else {
            // Formato sem cabeçalho: CPF,AG,NOME,IDADE,TELEFONE,UF
            console.log('📋 Formato detectado: SEM CABEÇALHO (CPF,AG,NOME,IDADE,TELEFONE,UF)');
            cabecalho = ['CPF', 'AG', 'NOME', 'IDADE', 'TELEFONE', 'UF'];
            registros = linhas.map(linha => {
                const valores = linha.split(',');
                return {
                    'CPF': valores[0] ? valores[0].trim() : '',
                    'AG': valores[1] ? valores[1].trim() : '',
                    'NOME': valores[2] ? valores[2].trim() : '',
                    'IDADE': valores[3] ? valores[3].trim() : '',
                    'TELEFONE': valores[4] ? valores[4].trim() : '',
                    'UF': valores[5] ? valores[5].trim() : ''
                };
            });
        }
        
        // Ajustar mapeamento para formato invertido (TELEFONE,CPF,AG,NOME,IDADE,UF)
        if (cabecalho[0] === 'TELEFONE') {
            console.log('📋 Formato detectado: INVERTIDO (TELEFONE,CPF,AG,NOME,IDADE,UF)');
            registros = registros.map(registro => ({
                'CPF': registro.CPF,
                'AG': registro.AG,
                'NOME': registro.NOME,
                'IDADE': registro.IDADE,
                'TELEFONE': registro.TELEFONE,
                'UF': registro.UF
            }));
        }
        
        // Atualizar cache
        cacheDados = registros;
        cacheTimestamp = agora;
        
        const tempo = Date.now() - inicio;
        console.log(`✅ Dados carregados em ${tempo}ms - ${registros.length} registros`);
        
        return registros;
    } catch (error) {
        console.error('❌ Erro ao ler arquivo:', error);
        throw error;
    }
}

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'sistema-consulta.html'));
});

// Rota para carregar dados do servidor.txt (COM CACHE)
app.get('/api/dados', (req, res) => {
    try {
        const registros = carregarDados();
        res.json(registros);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        res.status(500).json({ error: 'Erro ao carregar dados' });
    }
});

// Rota para forçar atualização do cache
app.get('/api/atualizar-cache', (req, res) => {
    try {
        cacheDados = null;
        cacheTimestamp = 0;
        const registros = carregarDados();
        res.json({ 
            message: 'Cache atualizado com sucesso', 
            registros: registros.length,
            tempo: 'Dados recarregados do arquivo'
        });
    } catch (error) {
        console.error('Erro ao atualizar cache:', error);
        res.status(500).json({ error: 'Erro ao atualizar cache' });
    }
});

// Rota para buscar dados adicionais na API externa
app.get('/api/dados-extras/:cpf', async (req, res) => {
    try {
        const { cpf } = req.params;
        const url = `https://api.bronxservices.net/consulta/dHJhdmVsZXI6QENhc3RpZWwxMA==/srs22/cpf/${cpf}`;
        
        console.log(`🔍 Buscando dados para CPF: ${cpf}`);
        console.log(`🌐 URL da API: ${url}`);
        
        const response = await fetch(url);
        console.log(`📡 Status da resposta: ${response.status}`);
        
        if (response.ok) {
            const dados = await response.json();
            console.log(`✅ Dados recebidos com sucesso`);
            res.json(dados);
        } else if (response.status === 502) {
            console.log(`❌ API externa indisponível (502 Bad Gateway)`);
            res.status(503).json({ 
                error: 'API externa temporariamente indisponível',
                message: 'A API externa está fora do ar no momento. Tente novamente mais tarde.',
                status: 502
            });
        } else {
            console.log(`❌ Erro na API externa: ${response.status}`);
            res.status(response.status).json({ 
                error: 'Erro na API externa',
                message: `A API externa retornou erro ${response.status}`,
                status: response.status
            });
        }
    } catch (error) {
        console.error('❌ Erro ao buscar dados externos:', error);
        res.status(500).json({ 
            error: 'Erro de conexão',
            message: 'Não foi possível conectar com a API externa. Verifique sua conexão com a internet.',
            details: error.message
        });
    }
});

// Novas rotas para consultas da API Bronx
app.get('/api/consulta-cpf/:cpf', async (req, res) => {
    try {
        const cpf = req.params.cpf;
        const url = `https://api.bronxservices.net/consulta/dHJhdmVsZXI6QENhc3RpZWwxMA==/srs22/cpf/${cpf}`;
        
        const response = await fetch(url);
        
        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('API retornou HTML em vez de JSON:', await response.text());
            return res.status(500).json({ 
                message: 'API externa retornou formato inválido. Tente novamente mais tarde.' 
            });
        }
        
        const dados = await response.json();
        
        if (response.ok) {
            res.json(dados);
        } else {
            res.status(response.status).json({ message: 'Erro na consulta da API externa' });
        }
    } catch (error) {
        console.error('Erro na consulta CPF:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.get('/api/consulta-telefone/:telefone', async (req, res) => {
    try {
        const telefone = req.params.telefone;
        const url = `https://api.bronxservices.net/consulta/dHJhdmVsZXI6QENhc3RpZWwxMA==/srs22/telefone/${telefone}`;
        
        const response = await fetch(url);
        
        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('API retornou HTML em vez de JSON:', await response.text());
            return res.status(500).json({ 
                message: 'API externa retornou formato inválido. Tente novamente mais tarde.' 
            });
        }
        
        const dados = await response.json();
        
        if (response.ok) {
            res.json(dados);
        } else {
            res.status(response.status).json({ message: 'Erro na consulta da API externa' });
        }
    } catch (error) {
        console.error('Erro na consulta telefone:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.get('/api/consulta-nome/:nome', async (req, res) => {
    try {
        const nome = req.params.nome;
        const url = `https://api.bronxservices.net/consulta/dHJhdmVsZXI6QENhc3RpZWwxMA==/serasa/nome/${encodeURIComponent(nome)}`;
        
        const response = await fetch(url);
        
        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('API retornou HTML em vez de JSON:', await response.text());
            return res.status(500).json({ 
                message: 'API externa retornou formato inválido. Tente novamente mais tarde.' 
            });
        }
        
        const dados = await response.json();
        
        if (response.ok) {
            res.json(dados);
        } else {
            res.status(response.status).json({ message: 'Erro na consulta da API externa' });
        }
    } catch (error) {
        console.error('Erro na consulta nome:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.get('/api/consulta-endereco/:cpf', async (req, res) => {
    try {
        const cpf = req.params.cpf;
        const url = `https://api.bronxservices.net/consulta/dHJhdmVsZXI6QENhc3RpZWwxMA==/serasa/enderecos/${cpf}`;
        
        const response = await fetch(url);
        
        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('API retornou HTML em vez de JSON:', await response.text());
            return res.status(500).json({ 
                message: 'API externa retornou formato inválido. Tente novamente mais tarde.' 
            });
        }
        
        const dados = await response.json();
        
        if (response.ok) {
            res.json(dados);
        } else {
            res.status(response.status).json({ message: 'Erro na consulta da API externa' });
        }
    } catch (error) {
        console.error('Erro na consulta endereço:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Função para obter IP local
function getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

// Iniciar servidor
app.listen(PORT, () => {
    const localIP = getLocalIP();
    console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║                    🏆 DUBAI CONSULTAS 🏆                    ║`);
    console.log(`╠══════════════════════════════════════════════════════════════╣`);
    console.log(`║                                                              ║`);
    console.log(`║  🔗 Local:     http://localhost:${PORT}                        ║`);
    console.log(`║  🌐 Rede:      http://${localIP}:${PORT}                        ║`);
    console.log(`║                                                              ║`);
    console.log(`║  👤 Login:     admin                                          ║`);
    console.log(`║  🔐 Senha:     admin123                                       ║`);
    console.log(`║                                                              ║`);
    console.log(`║  💡 Para parar: Ctrl+C                                       ║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝\n`);
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).send('Erro interno do servidor');
});
