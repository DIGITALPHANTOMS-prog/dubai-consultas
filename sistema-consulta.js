// Variável global para armazenar os dados carregados do servidor
let dadosConsulta = [];

// Função para carregar dados do servidor
async function carregarDados() {
    try {
        const response = await fetch('/api/dados');
        if (response.ok) {
            dadosConsulta = await response.json();
            console.log(`✅ ${dadosConsulta.length} registros carregados com sucesso`);
            console.log('Primeiro registro:', dadosConsulta[0]);
        } else {
            console.error('❌ Erro ao carregar dados do servidor');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
    }
}

// Função de login
function fazerLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        // Login bem-sucedido
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('menuPrincipal').classList.add('active');
        
        // Limpar campos
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        // Salvar estado de login
        localStorage.setItem('logado', 'true');
    } else {
        alert('Usuário ou senha incorretos!');
    }
}

// Função de logout
function fazerLogout() {
    document.getElementById('menuPrincipal').classList.remove('active');
    document.getElementById('consultarDados').classList.remove('active');
    document.getElementById('consultaScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    
    // Limpar estado de login
    localStorage.removeItem('logado');
    
    // Limpar resultados
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('resultadoConsulta').innerHTML = '';
}

// Funções do menu principal
function mostrarConsultarDados() {
    document.getElementById('menuPrincipal').classList.remove('active');
    document.getElementById('consultarDados').classList.add('active');
}

function mostrarPainelConsulta() {
    document.getElementById('menuPrincipal').classList.remove('active');
    document.getElementById('consultaScreen').classList.add('active');
}

function voltarMenu() {
    document.getElementById('consultarDados').classList.remove('active');
    document.getElementById('consultaScreen').classList.remove('active');
    document.getElementById('menuPrincipal').classList.add('active');
}

// Novas funções de consulta da API
async function consultarCPF() {
    const cpf = document.getElementById('cpfConsulta').value.trim();
    
    if (!cpf) {
        alert('Digite um CPF para consultar!');
        return;
    }
    
    const resultadoDiv = document.getElementById('resultadoConsulta');
    resultadoDiv.innerHTML = '<div class="loading">🔄 Consultando CPF...</div>';
    
    try {
        const response = await fetch(`/api/consulta-cpf/${cpf}`);
        const dados = await response.json();
        
        if (response.ok) {
            exibirResultadoCPF(dados);
        } else {
            resultadoDiv.innerHTML = `<div class="erro">❌ Erro: ${dados.message || 'Erro na consulta'}</div>`;
        }
    } catch (error) {
        if (error.message.includes('Unexpected token')) {
            resultadoDiv.innerHTML = '<div class="erro">❌ API externa indisponível ou retornando formato inválido. Tente novamente mais tarde.</div>';
        } else {
            resultadoDiv.innerHTML = '<div class="erro">❌ Erro de conexão com a API</div>';
        }
        console.error('Erro:', error);
    }
}

async function consultarTelefone() {
    const telefone = document.getElementById('telefoneConsulta').value.trim();
    
    if (!telefone) {
        alert('Digite um telefone para consultar!');
        return;
    }
    
    const resultadoDiv = document.getElementById('resultadoConsulta');
    resultadoDiv.innerHTML = '<div class="loading">🔄 Consultando telefone...</div>';
    
    try {
        const response = await fetch(`/api/consulta-telefone/${telefone}`);
        const dados = await response.json();
        
        if (response.ok) {
            exibirResultadoTelefone(dados);
        } else {
            resultadoDiv.innerHTML = `<div class="erro">❌ Erro: ${dados.message || 'Erro na consulta'}</div>`;
        }
    } catch (error) {
        if (error.message.includes('Unexpected token')) {
            resultadoDiv.innerHTML = '<div class="erro">❌ API externa indisponível ou retornando formato inválido. Tente novamente mais tarde.</div>';
        } else {
            resultadoDiv.innerHTML = '<div class="erro">❌ Erro de conexão com a API</div>';
        }
        console.error('Erro:', error);
    }
}

async function consultarNome() {
    const nome = document.getElementById('nomeConsulta').value.trim();
    
    if (!nome) {
        alert('Digite um nome para consultar!');
        return;
    }
    
    const resultadoDiv = document.getElementById('resultadoConsulta');
    resultadoDiv.innerHTML = '<div class="loading">🔄 Consultando nome...</div>';
    
    try {
        const response = await fetch(`/api/consulta-nome/${encodeURIComponent(nome)}`);
        const dados = await response.json();
        
        if (response.ok) {
            exibirResultadoNome(dados);
        } else {
            resultadoDiv.innerHTML = `<div class="erro">❌ Erro: ${dados.message || 'Erro na consulta'}</div>`;
        }
    } catch (error) {
        if (error.message.includes('Unexpected token')) {
            resultadoDiv.innerHTML = '<div class="erro">❌ API externa indisponível ou retornando formato inválido. Tente novamente mais tarde.</div>';
        } else {
            resultadoDiv.innerHTML = '<div class="erro">❌ Erro de conexão com a API</div>';
        }
        console.error('Erro:', error);
    }
}

async function consultarEndereco() {
    const cpf = document.getElementById('cpfEndereco').value.trim();
    
    if (!cpf) {
        alert('Digite um CPF para buscar endereços!');
        return;
    }
    
    const resultadoDiv = document.getElementById('resultadoConsulta');
    resultadoDiv.innerHTML = '<div class="loading">🔄 Consultando endereços...</div>';
    
    try {
        const response = await fetch(`/api/consulta-endereco/${cpf}`);
        const dados = await response.json();
        
        if (response.ok) {
            exibirResultadoEndereco(dados);
        } else {
            resultadoDiv.innerHTML = `<div class="erro">❌ Erro: ${dados.message || 'Erro na consulta'}</div>`;
        }
    } catch (error) {
        if (error.message.includes('Unexpected token')) {
            resultadoDiv.innerHTML = '<div class="erro">❌ API externa indisponível ou retornando formato inválido. Tente novamente mais tarde.</div>';
        } else {
            resultadoDiv.innerHTML = '<div class="erro">❌ Erro de conexão com a API</div>';
        }
        console.error('Erro:', error);
    }
}

// Funções para exibir resultados da API
function exibirResultadoCPF(dados) {
    const resultadoDiv = document.getElementById('resultadoConsulta');
    
    let html = `
        <div class="resultado-item">
            <h3>✅ Dados encontrados para CPF: ${dados.dados.CPF}</h3>
            <div class="dados">
                <p><strong>Nome:</strong> ${dados.dados.NOME}</p>
                <p><strong>Data de Nascimento:</strong> ${dados.dados.NASC ? new Date(dados.dados.NASC).toLocaleDateString('pt-BR') : 'N/A'}</p>
                <p><strong>Sexo:</strong> ${dados.dados.SEXO}</p>
                <p><strong>Nome da Mãe:</strong> ${dados.dados.NOME_MAE}</p>
                <p><strong>RG:</strong> ${dados.dados.RG}</p>
                <p><strong>Renda:</strong> ${dados.dados.RENDA ? `R$ ${parseFloat(dados.dados.RENDA).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'N/A'}</p>
                <p><strong>Score:</strong> ${dados.score}</p>
            </div>
        </div>
    `;
    
    if (dados.emails && dados.emails.length > 0) {
        html += `
            <div class="emails">
                <h4>📧 Emails (${dados.emails.length})</h4>
                ${dados.emails.slice(0, 3).map(email => `
                    <p><strong>${email.PRIORIDADE}º:</strong> ${email.EMAIL} (${email.EMAIL_SCORE})</p>
                `).join('')}
            </div>
        `;
    }
    
    if (dados.telefones && dados.telefones.length > 0) {
        html += `
            <div class="telefones">
                <h4>📱 Telefones (${dados.telefones.length})</h4>
                ${dados.telefones.slice(0, 3).map(tel => `
                    <p><strong>${tel.PRIORIDADE}º:</strong> (${tel.DDD}) ${tel.TELEFONE} (${tel.CLASSIFICACAO})</p>
                `).join('')}
            </div>
        `;
    }
    
    if (dados.enderecos && dados.enderecos.length > 0) {
        html += `
            <div class="enderecos">
                <h4>🏠 Endereços (${dados.enderecos.length})</h4>
                ${dados.enderecos.slice(0, 2).map(end => `
                    <p><strong>${end.PRIORIDADE}º:</strong> ${end.ENDERECO}, ${end.BAIRRO}, ${end.CIDADE}-${end.UF}, CEP: ${end.CEP}</p>
                `).join('')}
            </div>
        `;
    }
    
    resultadoDiv.innerHTML = html;
}

function exibirResultadoTelefone(dados) {
    const resultadoDiv = document.getElementById('resultadoConsulta');
    
    let html = `
        <div class="resultado-item">
            <h3>✅ Dados encontrados para telefone</h3>
    `;
    
    dados.forEach((pessoa, index) => {
        html += `
            <div class="pessoa">
                <h4>Pessoa ${index + 1}</h4>
                <div class="dados">
                    <p><strong>Nome:</strong> ${pessoa.dados.NOME}</p>
                    <p><strong>CPF:</strong> ${pessoa.dados.CPF}</p>
                    <p><strong>Data de Nascimento:</strong> ${pessoa.dados.NASC ? new Date(pessoa.dados.NASC).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    <p><strong>Sexo:</strong> ${pessoa.dados.SEXO}</p>
                    <p><strong>Renda:</strong> ${pessoa.dados.RENDA ? `R$ ${parseFloat(pessoa.dados.RENDA).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'N/A'}</p>
                </div>
            </div>
        `;
        
        if (pessoa.EMAILS && pessoa.EMAILS.length > 0) {
            html += `
                <div class="emails">
                    <h5>📧 Emails (${pessoa.EMAILS.length})</h5>
                    ${pessoa.EMAILS.slice(0, 2).map(email => `
                        <p><strong>${email.PRIORIDADE}º:</strong> ${email.EMAIL} (${email.EMAIL_SCORE})</p>
                    `).join('')}
                </div>
            `;
        }
    });
    
    html += '</div>';
    resultadoDiv.innerHTML = html;
}

function exibirResultadoNome(dados) {
    const resultadoDiv = document.getElementById('resultadoConsulta');
    
    let html = `
        <div class="resultado-item">
            <h3>✅ Dados encontrados para nome</h3>
    `;
    
    dados.forEach((pessoa, index) => {
        html += `
            <div class="pessoa">
                <h4>Pessoa ${index + 1}</h4>
                <div class="dados">
                    <p><strong>Nome:</strong> ${pessoa.dados.NOME}</p>
                    <p><strong>CPF:</strong> ${pessoa.dados.CPF}</p>
                    <p><strong>Data de Nascimento:</strong> ${pessoa.dados.NASC ? new Date(pessoa.dados.NASC).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    <p><strong>Sexo:</strong> ${pessoa.dados.SEXO}</p>
                    <p><strong>Renda:</strong> ${pessoa.dados.RENDA ? `R$ ${parseFloat(pessoa.dados.RENDA).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'N/A'}</p>
                </div>
            </div>
        `;
        
        if (pessoa.telefones && pessoa.telefones.length > 0) {
            html += `
                <div class="telefones">
                    <h5>📱 Telefones (${pessoa.telefones.length})</h5>
                    ${pessoa.telefones.slice(0, 2).map(tel => `
                        <p><strong>${tel.PRIORIDADE}º:</strong> (${tel.DDD}) ${tel.TELEFONE} (${tel.CLASSIFICACAO})</p>
                    `).join('')}
                </div>
            `;
        }
    });
    
    html += '</div>';
    resultadoDiv.innerHTML = html;
}

function exibirResultadoEndereco(dados) {
    const resultadoDiv = document.getElementById('resultadoConsulta');
    
    let html = `
        <div class="resultado-item">
            <h3>✅ Endereços encontrados</h3>
            <div class="enderecos">
    `;
    
    dados.forEach((endereco, index) => {
        html += `
            <div class="endereco">
                <h4>Endereço ${index + 1}</h4>
                <div class="dados">
                    <p><strong>Logradouro:</strong> ${endereco.LOGR_TIPO} ${endereco.LOGR_NOME}, ${endereco.LOGR_NUMERO}</p>
                    <p><strong>Complemento:</strong> ${endereco.LOGR_COMPLEMENTO || 'N/A'}</p>
                    <p><strong>Bairro:</strong> ${endereco.BAIRRO}</p>
                    <p><strong>Cidade:</strong> ${endereco.CIDADE}-${endereco.UF}</p>
                    <p><strong>CEP:</strong> ${endereco.CEP}</p>
                    <p><strong>Data de Atualização:</strong> ${endereco.DT_ATUALIZACAO ? new Date(endereco.DT_ATUALIZACAO).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    resultadoDiv.innerHTML = html;
}

// Função para consultar por telefone (sistema atual)
function consultarPorTelefone() {
    const telefone = document.getElementById('telefone').value.trim();
    
    if (!telefone) {
        alert('Digite um telefone para consultar!');
        return;
    }
    
    // Limpar telefone para busca (remover caracteres especiais)
    const telefoneLimpo = telefone.replace(/\D/g, '');
    
    // Buscar nos dados (busca exata simples como CPF)
    const resultado = dadosConsulta.find(dado => {
        const telefoneDado = dado.TELEFONE.replace(/\D/g, '');
        return telefoneDado === telefoneLimpo;
    });
    
    console.log('Telefone buscado:', telefoneLimpo);
    console.log('Total de registros:', dadosConsulta.length);
    
    exibirResultado(resultado, 'telefone', telefone);
}

// Função para consultar por CPF (sistema atual)
function consultarPorCPF() {
    const cpf = document.getElementById('cpf').value.trim();
    
    if (!cpf) {
        alert('Digite um CPF para consultar!');
        return;
    }
    
    // Limpar CPF para busca (remover caracteres especiais)
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Buscar nos dados
    const resultado = dadosConsulta.find(dado => {
        const cpfDado = dado.CPF.replace(/\D/g, '');
        return cpfDado === cpfLimpo;
    });
    
    console.log('CPF buscado:', cpfLimpo);
    console.log('Total de registros:', dadosConsulta.length);
    
    exibirResultado(resultado, 'CPF', cpf);
}

// Função para exibir resultado (sistema atual)
async function exibirResultado(resultado, tipo, valor) {
    const resultadoDiv = document.getElementById('resultado');
    
    if (resultado) {
        // Mostrar dados básicos primeiro
        resultadoDiv.innerHTML = `
            <div class="resultado-item">
                <h3>✅ Dados encontrados para ${tipo}: ${valor}</h3>
                <div class="dados">
                    <p><strong>Nome:</strong> ${resultado.NOME}</p>
                    <p><strong>CPF:</strong> ${resultado.CPF}</p>
                    <p><strong>Telefone:</strong> ${resultado.TELEFONE}</p>
                    <p><strong>Agência:</strong> ${resultado.AG}</p>
                    ${resultado.CONTA && resultado.CONTA !== 'N/A' ? `<p><strong>Conta:</strong> ${resultado.CONTA}</p>` : ''}
                    ${resultado.BANCO && resultado.BANCO !== 'N/A' ? `<p><strong>Banco:</strong> ${resultado.BANCO}</p>` : ''}
                    ${resultado.IDADE && resultado.IDADE !== 'N/A' ? `<p><strong>Idade:</strong> ${resultado.IDADE} anos</p>` : ''}
                    <p><strong>UF:</strong> ${resultado.UF}</p>
                </div>
                <div class="loading-extras">
                    <p>🔄 Buscando dados adicionais...</p>
                </div>
            </div>
        `;
        
        // Buscar dados adicionais da API externa
        try {
            const response = await fetch(`/api/dados-extras/${resultado.CPF}`);
            const dadosExtras = await response.json();
            
            if (response.ok) {
                exibirDadosExtras(resultadoDiv, dadosExtras);
            } else {
                let mensagem = 'Não foi possível carregar dados adicionais da API externa.';
                
                if (dadosExtras.message) {
                    mensagem = dadosExtras.message;
                } else if (response.status === 503) {
                    mensagem = 'A API externa está temporariamente indisponível. Tente novamente mais tarde.';
                } else if (response.status === 404) {
                    mensagem = 'Dados adicionais não encontrados para este CPF.';
                }
                
                resultadoDiv.innerHTML += `
                    <div class="dados-extras">
                        <h4>📊 Dados Adicionais</h4>
                        <div class="erro-api">
                            <p>⚠️ ${mensagem}</p>
                            ${dadosExtras.status ? `<p><small>Código de erro: ${dadosExtras.status}</small></p>` : ''}
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Erro ao buscar dados extras:', error);
            resultadoDiv.innerHTML += `
                <div class="dados-extras">
                    <h4>📊 Dados Adicionais</h4>
                    <div class="erro-api">
                        <p>⚠️ Erro de conexão com a API externa.</p>
                        <p><small>Verifique sua conexão com a internet.</small></p>
                    </div>
                </div>
            `;
        }
    } else {
        resultadoDiv.innerHTML = `
            <div class="resultado-item">
                <h3>❌ Nenhum resultado encontrado para ${tipo}: ${valor}</h3>
                <p>Verifique os dados informados e tente novamente.</p>
            </div>
        `;
    }
}

// Função para exibir dados extras (sistema atual)
function exibirDadosExtras(resultadoDiv, dadosExtras) {
    const dados = dadosExtras.dados;
    const emails = dadosExtras.emails || [];
    const telefones = dadosExtras.telefones || [];
    const enderecos = dadosExtras.enderecos || [];
    
    // Calcular idade
    const dataNasc = dados.NASC ? new Date(dados.NASC) : null;
    const idade = dataNasc ? Math.floor((new Date() - dataNasc) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A';
    
    // Remover loading e adicionar dados extras
    const loadingElement = resultadoDiv.querySelector('.loading-extras');
    if (loadingElement) {
        loadingElement.remove();
    }
    
    resultadoDiv.innerHTML += `
        <div class="dados-extras">
            <h4>📊 Dados Adicionais da API</h4>
            
            <div class="dados-pessoais">
                <h5>👤 Dados Pessoais</h5>
                <p><strong>Nome Completo:</strong> ${dados.NOME || 'N/A'}</p>
                <p><strong>Data de Nascimento:</strong> ${dados.NASC ? new Date(dados.NASC).toLocaleDateString('pt-BR') : 'N/A'}</p>
                <p><strong>Idade:</strong> ${idade} anos</p>
                <p><strong>Sexo:</strong> ${dados.SEXO || 'N/A'}</p>
                <p><strong>Nome da Mãe:</strong> ${dados.NOME_MAE || 'N/A'}</p>
                <p><strong>Nome do Pai:</strong> ${dados.NOME_PAI || 'N/A'}</p>
                <p><strong>RG:</strong> ${dados.RG || 'N/A'}</p>
                <p><strong>Título de Eleitor:</strong> ${dados.TITULO_ELEITOR || 'N/A'}</p>
            </div>
            
            <div class="dados-financeiros">
                <h5>💰 Dados Financeiros</h5>
                <p><strong>Renda:</strong> ${dados.RENDA ? `R$ ${parseFloat(dados.RENDA).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'N/A'}</p>
                <p><strong>Faixa de Renda:</strong> ${dados.FAIXA_RENDA_ID || 'N/A'}</p>
                <p><strong>Score:</strong> ${dadosExtras.score || 'N/A'}</p>
            </div>
            
            ${emails.length > 0 ? `
            <div class="emails">
                <h5>📧 Emails (${emails.length})</h5>
                ${emails.slice(0, 3).map(email => `
                    <p><strong>${email.PRIORIDADE}º:</strong> ${email.EMAIL} (${email.EMAIL_SCORE})</p>
                `).join('')}
            </div>
            ` : ''}
            
            ${telefones.length > 0 ? `
            <div class="telefones">
                <h5>📱 Telefones (${telefones.length})</h5>
                ${telefones.slice(0, 3).map(tel => `
                    <p><strong>${tel.PRIORIDADE}º:</strong> (${tel.DDD}) ${tel.TELEFONE} (${tel.CLASSIFICACAO})</p>
                `).join('')}
            </div>
            ` : ''}
            
            ${enderecos.length > 0 ? `
            <div class="enderecos">
                <h5>🏠 Endereços (${enderecos.length})</h5>
                ${enderecos.slice(0, 2).map(end => `
                    <p><strong>${end.PRIORIDADE}º:</strong> ${end.ENDERECO}, ${end.BAIRRO}, ${end.CIDADE}-${end.UF}, CEP: ${end.CEP}</p>
                `).join('')}
            </div>
            ` : ''}
        </div>
    `;
}

// Verificar se já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados do servidor
    carregarDados();
    
    if (localStorage.getItem('logado') === 'true') {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('menuPrincipal').classList.add('active');
    }
    
    // Permitir login com Enter
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fazerLogin();
        }
    });
    
    // Permitir consulta com Enter
    document.getElementById('telefone').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            consultarPorTelefone();
        }
    });
    
    document.getElementById('cpf').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            consultarPorCPF();
        }
    });
});
