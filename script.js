/**
 * Gerenciador de Humor dos Alunos - Sistema POO
 * Desenvolvido por Neo Lucca
 * 
 * Este sistema utiliza Programação Orientada a Objetos para gerenciar
 * o humor dos alunos em um ambiente escolar.
 */

// Definição da classe para representar um Aluno
class Aluno {
    constructor(id, nome, idade, humor, turma, atividade = '', observacao = '') {
      this.id = id;
      this.nome = nome;
      this.idade = parseInt(idade);
      this.humor = humor;
      this.turma = turma;
      this.atividade = atividade;
      this.observacao = observacao;
      this.dataCadastro = new Date();
    }
  
    // Método para obter emoji correspondente ao humor
    getEmojiHumor() {
      const emojis = {
        'feliz': '😄',
        'triste': '😢',
        'estressado': '😠',
        'cansado': '😴',
        'ansioso': '😰',
        'entediado': '😐',
        'motivado': '💪',
        'confiante': '😎'
      };
      return emojis[this.humor] || '❓';
    }
    
    // Método para obter o nome formatado do humor
    getNomeHumor() {
      const nomes = {
        'feliz': 'Feliz',
        'triste': 'Triste',
        'estressado': 'Estressado',
        'cansado': 'Cansado',
        'ansioso': 'Ansioso',
        'entediado': 'Entediado',
        'motivado': 'Motivado',
        'confiante': 'Confiante'
      };
      return nomes[this.humor] || 'Desconhecido';
    }
    
    // Método para atualizar dados do aluno
    atualizar(novosDados) {
      this.nome = novosDados.nome || this.nome;
      this.idade = parseInt(novosDados.idade) || this.idade;
      this.humor = novosDados.humor || this.humor;
      this.turma = novosDados.turma || this.turma;
      this.atividade = novosDados.atividade !== undefined ? novosDados.atividade : this.atividade;
      this.observacao = novosDados.observacao !== undefined ? novosDados.observacao : this.observacao;
    }
    
    // Método para converter o objeto para string no formato JSON
    toJSON() {
      return {
        id: this.id,
        nome: this.nome,
        idade: this.idade,
        humor: this.humor,
        turma: this.turma,
        atividade: this.atividade,
        observacao: this.observacao,
        dataCadastro: this.dataCadastro
      };
    }
  }
  
  // Classe para gerenciar o armazenamento de dados no localStorage
  class ArmazenamentoService {
    constructor(chave) {
      this.chave = chave;
    }
    
    // Salvar dados no localStorage
    salvar(dados) {
      localStorage.setItem(this.chave, JSON.stringify(dados));
    }
    
    // Carregar dados do localStorage
    carregar() {
      const dados = localStorage.getItem(this.chave);
      return dados ? JSON.parse(dados) : [];
    }
    
    // Limpar todos os dados
    limpar() {
      localStorage.removeItem(this.chave);
    }
  }
  
  // Classe responsável pela gestão dos alunos
  class GerenciadorAlunos {
    constructor() {
      this.armazenamento = new ArmazenamentoService('alunos_dados');
      this.alunos = [];
      this.carregarAlunos();
    }
    
    // Carrega os alunos do armazenamento e converte para instâncias da classe Aluno
    carregarAlunos() {
      const dadosAlunos = this.armazenamento.carregar();
      this.alunos = dadosAlunos.map(dados => {
        const aluno = new Aluno(
          dados.id,
          dados.nome,
          dados.idade,
          dados.humor,
          dados.turma,
          dados.atividade,
          dados.observacao
        );
        aluno.dataCadastro = new Date(dados.dataCadastro);
        return aluno;
      });
    }
    
    // Salva o estado atual dos alunos no armazenamento
    salvarAlunos() {
      this.armazenamento.salvar(this.alunos);
    }
    
    // Adiciona um novo aluno
    adicionarAluno(nome, idade, humor, turma, atividade = '', observacao = '') {
      const id = this.gerarId();
      const aluno = new Aluno(id, nome, idade, humor, turma, atividade, observacao);
      this.alunos.push(aluno);
      this.salvarAlunos();
      return aluno;
    }
    
    // Gera um ID único baseado em timestamp
    gerarId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // Atualiza um aluno existente
    atualizarAluno(id, novosDados) {
      const aluno = this.encontrarAluno(id);
      if (aluno) {
        aluno.atualizar(novosDados);
        this.salvarAlunos();
        return true;
      }
      return false;
    }
    
    // Remove um aluno
    removerAluno(id) {
      const indice = this.alunos.findIndex(aluno => aluno.id === id);
      if (indice !== -1) {
        this.alunos.splice(indice, 1);
        this.salvarAlunos();
        return true;
      }
      return false;
    }
    
    // Encontra um aluno pelo ID
    encontrarAluno(id) {
      return this.alunos.find(aluno => aluno.id === id);
    }
    
    // Retorna todos os alunos
    obterTodosAlunos() {
      return [...this.alunos];
    }
    
    // Filtra alunos por humor e/ou turma
    filtrarAlunos(filtroHumor = 'todos', filtroTurma = 'todas') {
      return this.alunos.filter(aluno => {
        const matchHumor = filtroHumor === 'todos' || aluno.humor === filtroHumor;
        const matchTurma = filtroTurma === 'todas' || aluno.turma === filtroTurma;
        return matchHumor && matchTurma;
      });
    }
    
    // Calcula estatísticas sobre os alunos
    calcularEstatisticas() {
      if (this.alunos.length === 0) {
        return {
          total: 0,
          mediaIdade: 0,
          humorPredominante: '-',
          contadorHumores: {},
          estatisticasTurmas: []
        };
      }
      
      // Calcula a média de idade
      const somaIdades = this.alunos.reduce((soma, aluno) => soma + aluno.idade, 0);
      const mediaIdade = somaIdades / this.alunos.length;
      
      // Conta a frequência de cada humor
      const contadorHumores = {};
      this.alunos.forEach(aluno => {
        contadorHumores[aluno.humor] = (contadorHumores[aluno.humor] || 0) + 1;
      });
      
      // Encontra o humor predominante
      let humorPredominante = Object.keys(contadorHumores)[0];
      Object.keys(contadorHumores).forEach(humor => {
        if (contadorHumores[humor] > contadorHumores[humorPredominante]) {
          humorPredominante = humor;
        }
      });
      
      // Agrupa alunos por turma
      const alunosPorTurma = {};
      this.alunos.forEach(aluno => {
        if (!alunosPorTurma[aluno.turma]) {
          alunosPorTurma[aluno.turma] = [];
        }
        alunosPorTurma[aluno.turma].push(aluno);
      });
      
      // Calcula estatísticas por turma
      const estatisticasTurmas = Object.keys(alunosPorTurma).map(turma => {
        const alunosTurma = alunosPorTurma[turma];
        
        // Conta humores na turma
        const humoresTurma = {};
        alunosTurma.forEach(aluno => {
          humoresTurma[aluno.humor] = (humoresTurma[aluno.humor] || 0) + 1;
        });
        
        // Encontra humor predominante na turma
        let humorPredominanteTurma = Object.keys(humoresTurma)[0];
        Object.keys(humoresTurma).forEach(humor => {
          if (humoresTurma[humor] > humoresTurma[humorPredominanteTurma]) {
            humorPredominanteTurma = humor;
          }
        });
        
        return {
          turma,
          totalAlunos: alunosTurma.length,
          humorPredominante: humorPredominanteTurma
        };
      });
      
      return {
        total: this.alunos.length,
        mediaIdade: mediaIdade.toFixed(1),
        humorPredominante,
        contadorHumores,
        estatisticasTurmas
      };
    }
  }
  
  // Classe para lidar com notificações
  class NotificacaoService {
    constructor() {
      this.notificacaoElement = document.getElementById('notificacao');
      this.mensagemElement = document.getElementById('notificacaoMensagem');
      this.iconeElement = document.getElementById('notificacaoIcone');
      this.timeoutId = null;
    }
    
    // Mostra uma notificação de sucesso
    mostrarSucesso(mensagem, duracao = 3000) {
      this.mostrar(mensagem, 'fa-check-circle', 'var(--cor-primaria)', duracao);
    }
    
    // Mostra uma notificação de erro
    mostrarErro(mensagem, duracao = 3000) {
      this.mostrar(mensagem, 'fa-exclamation-circle', '#f72585', duracao);
    }
    
    // Mostra uma notificação de alerta
    mostrarAlerta(mensagem, duracao = 3000) {
      this.mostrar(mensagem, 'fa-exclamation-triangle', '#fb8500', duracao);
    }
    
    // Método privado para mostrar a notificação
    mostrar(mensagem, icone, cor, duracao) {
      // Limpa o timeout anterior se existir
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      // Define mensagem e ícone
      this.mensagemElement.textContent = mensagem;
      this.iconeElement.className = `fas ${icone}`;
      this.iconeElement.style.color = cor;
      
      // Mostra a notificação
      this.notificacaoElement.classList.add('mostrar');
      
      // Define o timeout para esconder
      this.timeoutId = setTimeout(() => {
        this.esconder();
      }, duracao);
    }
    
    // Esconde a notificação
    esconder() {
      this.notificacaoElement.classList.remove('mostrar');
      this.timeoutId = null;
    }
  }
  
  // Classe controladora da interface do usuário
  class ControladorUI {
    constructor() {
      this.gerenciadorAlunos = new GerenciadorAlunos();
      this.notificacao = new NotificacaoService();
      
      // Referências para seções
      this.secoes = {
        cadastro: document.getElementById('cadastroSection'),
        listagem: document.getElementById('listagemSection'),
        estatisticas: document.getElementById('estatisticasSection')
      };
      
      // Botões de navegação
      this.botoes = {
        cadastro: document.getElementById('btnCadastro'),
        listagem: document.getElementById('btnListagem'),
        estatisticas: document.getElementById('btnEstatisticas')
      };
      
      // Formulário de aluno
      this.form = document.getElementById('formAluno');
      
      // Lista de alunos
      this.listaElement = document.getElementById('listaAlunos');
      this.msgSemAlunos = document.getElementById('msgSemAlunos');
      
      // Filtros
      this.filtros = {
        humor: document.getElementById('filtroHumor'),
        turma: document.getElementById('filtroTurma'),
        buscar: document.getElementById('btnBusca')
      };
      
      // Elementos de estatísticas
      this.estatisticas = {
        totalAlunos: document.getElementById('totalAlunos'),
        humorPredominante: document.getElementById('humorPredominante'),
        mediaIdade: document.getElementById('mediaIdade'),
        graficoHumor: document.getElementById('graficoHumor'),
        tabelaTurmas: document.querySelector('#tabelaTurmas tbody')
      };
      
      // Inicializa os eventos
      this.inicializarEventos();
      
      // Exibe a lista de alunos
      this.atualizarListaAlunos();
    }
    
    // Configura todos os listeners de eventos
    inicializarEventos() {
      // Eventos de navegação
      this.botoes.cadastro.addEventListener('click', () => this.alternarSecao('cadastro'));
      this.botoes.listagem.addEventListener('click', () => this.alternarSecao('listagem'));
      this.botoes.estatisticas.addEventListener('click', () => {
        this.alternarSecao('estatisticas');
        this.atualizarEstatisticas();
      });
      
      // Evento de submissão do formulário
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.registrarAluno();
      });
      
      // Evento para filtrar alunos
      this.filtros.buscar.addEventListener('click', () => {
        this.atualizarListaAlunos(
          this.filtros.humor.value,
          this.filtros.turma.value
        );
      });
    }
    
    // Alterna entre as seções da interface
    alternarSecao(secaoId) {
      // Oculta todas as seções
      Object.keys(this.secoes).forEach(key => {
        this.secoes[key].classList.remove('secao-ativa');
        this.secoes[key].classList.add('secao-inativa');
        this.botoes[key].classList.remove('active');
      });
      
      // Mostra a seção selecionada
      this.secoes[secaoId].classList.remove('secao-inativa');
      this.secoes[secaoId].classList.add('secao-ativa');
      this.botoes[secaoId].classList.add('active');
    }
    
    // Registra um novo aluno
    registrarAluno() {
      const nome = document.getElementById('nome').value;
      const idade = document.getElementById('idade').value;
      const humor = document.getElementById('humor').value;
      const turma = document.getElementById('turma').value;
      const atividade = document.getElementById('atividade').value;
      const observacao = document.getElementById('observacao').value;
      
      try {
        this.gerenciadorAlunos.adicionarAluno(nome, idade, humor, turma, atividade, observacao);
        this.notificacao.mostrarSucesso(`Aluno ${nome} cadastrado com sucesso!`);
        this.form.reset();
        this.atualizarListaAlunos();
        
        // Muda para a seção de listagem após um curto delay
        setTimeout(() => {
          this.alternarSecao('listagem');
        }, 1000);
      } catch (error) {
        this.notificacao.mostrarErro('Erro ao cadastrar aluno: ' + error.message);
      }
    }
    
    // Atualiza a lista de alunos na interface
    atualizarListaAlunos(filtroHumor = 'todos', filtroTurma = 'todas') {
      const alunos = this.gerenciadorAlunos.filtrarAlunos(filtroHumor, filtroTurma);
      
      // Limpa a lista atual
      this.listaElement.innerHTML = '';
      
      // Verifica se existem alunos
      if (alunos.length === 0) {
        this.msgSemAlunos.classList.remove('hidden');
        return;
      }
      
      // Esconde a mensagem de "nenhum aluno"
      this.msgSemAlunos.classList.add('hidden');
      
      // Adiciona cada aluno à lista
      alunos.forEach(aluno => {
        const cardElement = this.criarCardAluno(aluno);
        this.listaElement.appendChild(cardElement);
      });
    }
    
    // Cria o elemento HTML para o card de um aluno
    criarCardAluno(aluno) {
      const card = document.createElement('div');
      card.className = 'card-aluno';
      card.id = `aluno-${aluno.id}`;
      
      // Define a cor da borda baseada no humor
      const cores = {
        'feliz': '#4cc9f0',
        'motivado': '#7209b7',
        'confiante': '#4361ee',
        'entediado': '#adb5bd',
        'ansioso': '#fb8500',
        'cansado': '#8d99ae',
        'triste': '#023047',
        'estressado': '#d00000'
      };
      
      card.style.borderLeftColor = cores[aluno.humor] || 'var(--cor-primaria)';
      
      // Conteúdo do card
      card.innerHTML = `
        <h3>${aluno.nome} <span class="humor-emoji">${aluno.getEmojiHumor()}</span></h3>
        <div class="aluno-info">
          <p><strong>Idade:</strong> ${aluno.idade} anos</p>
          <p><strong>Turma:</strong> ${aluno.turma}</p>
          <p><strong>Humor:</strong> ${aluno.getEmojiHumor()} ${aluno.getNomeHumor()}</p>
          ${aluno.atividade ? `<p><strong>Atividade Extra:</strong> ${aluno.atividade}</p>` : ''}
          ${aluno.observacao ? `<p><strong>Observações:</strong> ${aluno.observacao}</p>` : ''}
        </div>
        <div class="acoes-aluno">
          <button class="btn-acao btn-editar" data-id="${aluno.id}">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn-acao btn-excluir" data-id="${aluno.id}">
            <i class="fas fa-trash-alt"></i> Excluir
          </button>
        </div>
      `;
      
      // Adiciona os eventos aos botões
      card.querySelector('.btn-editar').addEventListener('click', () => this.editarAluno(aluno.id));
      card.querySelector('.btn-excluir').addEventListener('click', () => this.excluirAluno(aluno.id));
      
      return card;
    }
    
    // Prepara a interface para edição de um aluno existente
    editarAluno(id) {
      const aluno = this.gerenciadorAlunos.encontrarAluno(id);
      if (!aluno) {
        this.notificacao.mostrarErro('Aluno não encontrado!');
        return;
      }
      
      // Preenche o formulário com os dados do aluno
      document.getElementById('nome').value = aluno.nome;
      document.getElementById('idade').value = aluno.idade;
      document.getElementById('humor').value = aluno.humor;
      document.getElementById('turma').value = aluno.turma;
      document.getElementById('atividade').value = aluno.atividade;
      document.getElementById('observacao').value = aluno.observacao;
      
      // Modifica temporariamente o formulário para atualização
      const submitBtn = this.form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar';
      
      // Remove o evento de submit original
      const originalSubmit = this.form.onsubmit;
      this.form.onsubmit = null;
      
      // Adiciona um novo evento para atualização
      const handleUpdate = (e) => {
        e.preventDefault();
        
        const novosDados = {
          nome: document.getElementById('nome').value,
          idade: document.getElementById('idade').value,
          humor: document.getElementById('humor').value,
          turma: document.getElementById('turma').value,
          atividade: document.getElementById('atividade').value,
          observacao: document.getElementById('observacao').value
        };
        
        if (this.gerenciadorAlunos.atualizarAluno(id, novosDados)) {
          this.notificacao.mostrarSucesso(`Aluno ${novosDados.nome} atualizado com sucesso!`);
          this.atualizarListaAlunos();
          
          // Restaura o formulário para o estado original
          this.form.reset();
          submitBtn.innerHTML = originalText;
          this.form.onsubmit = originalSubmit;
          
          // Rola para a seção de listagem
          this.alternarSecao('listagem');
        } else {
          this.notificacao.mostrarErro('Erro ao atualizar aluno!');
        }
        
        // Remove este handler específico
        this.form.removeEventListener('submit', handleUpdate);
      };
      
      // Adiciona o evento de atualização
      this.form.addEventListener('submit', handleUpdate);
      
      // Muda para a seção de cadastro
      this.alternarSecao('cadastro');
    }
    
    // Exclui um aluno
    excluirAluno(id) {
      const aluno = this.gerenciadorAlunos.encontrarAluno(id);
      if (!aluno) {
        this.notificacao.mostrarErro('Aluno não encontrado!');
        return;
      }
      
      // Confirma a exclusão
      if (confirm(`Tem certeza que deseja excluir o aluno ${aluno.nome}?`)) {
        if (this.gerenciadorAlunos.removerAluno(id)) {
          // Remove o card da interface
          const card = document.getElementById(`aluno-${id}`);
          if (card) {
            card.classList.add('fade-out');
            setTimeout(() => {
              card.remove();
              // Verifica se a lista ficou vazia
              if (this.listaElement.children.length === 0) {
                this.msgSemAlunos.classList.remove('hidden');
              }
            }, 300);
          }
          
          this.notificacao.mostrarSucesso(`Aluno ${aluno.nome} excluído com sucesso!`);
        } else {
          this.notificacao.mostrarErro('Erro ao excluir aluno!');
        }
      }
    }
    
    // Atualiza a seção de estatísticas
    atualizarEstatisticas() {
      const stats = this.gerenciadorAlunos.calcularEstatisticas();
      
      // Atualiza os cards de estatísticas
      this.estatisticas.totalAlunos.textContent = stats.total;
      
      // Formata o humor predominante
      if (stats.humorPredominante !== '-') {
        const aluno = new Aluno('', '', 0, stats.humorPredominante);
        this.estatisticas.humorPredominante.textContent = `${aluno.getEmojiHumor()} ${aluno.getNomeHumor()}`;
      } else {
        this.estatisticas.humorPredominante.textContent = '-';
      }
      
      this.estatisticas.mediaIdade.textContent = stats.mediaIdade;
      
      // Constrói o gráfico de barras
      this.atualizarGraficoHumores(stats.contadorHumores);
      
      // Atualiza a tabela de turmas
      this.atualizarTabelaTurmas(stats.estatisticasTurmas);
    }
    
    // Atualiza o gráfico de barras de humores
    atualizarGraficoHumores(contadorHumores) {
      // Limpa o gráfico atual
      this.estatisticas.graficoHumor.innerHTML = '';
      
      // Se não houver dados, exibe mensagem
      if (Object.keys(contadorHumores).length === 0) {
        this.estatisticas.graficoHumor.innerHTML = '<p class="sem-dados">Nenhum dado disponível</p>';
        return;
      }
      
      // Encontra o valor máximo para escala
      const maxValor = Math.max(...Object.values(contadorHumores));
      
      // Define a ordem de exibição dos humores
      const ordemHumores = [
        'feliz', 'motivado', 'confiante', 'entediado', 
        'ansioso', 'cansado', 'triste', 'estressado'
      ];
      
      // Filtra os humores que existem nos dados
      const humoresExistentes = ordemHumores.filter(humor => contadorHumores[humor] !== undefined);
      
      // Cria uma barra para cada humor
      humoresExistentes.forEach(humor => {
        const valor = contadorHumores[humor];
        const altura = Math.max((valor / maxValor) * 100, 10); // Mínimo de 10% de altura
        
        const barra = document.createElement('div');
        barra.className = 'barra';
        barra.style.height = `${altura}%`;
        
        // Emoji e nome do humor
        const aluno = new Aluno('', '', 0, humor);
        
        barra.innerHTML = `
          <span class="barra-valor">${valor}</span>
          <span class="barra-label">
            ${aluno.getEmojiHumor()}<br>
            ${aluno.getNomeHumor()}
          </span>
        `;
        
        this.estatisticas.graficoHumor.appendChild(barra);
      });
    }
    
    // Atualiza a tabela de estatísticas por turma
    atualizarTabelaTurmas(estatisticasTurmas) {
      // Limpa a tabela atual
      this.estatisticas.tabelaTurmas.innerHTML = '';
      
      // Se não houver dados, exibe mensagem
      if (estatisticasTurmas.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="3">Nenhuma turma cadastrada</td>';
        this.estatisticas.tabelaTurmas.appendChild(tr);
        return;
      }
      
      // Adiciona cada turma à tabela
      estatisticasTurmas.forEach(estatistica => {
        const tr = document.createElement('tr');
        
        // Emoji e nome do humor predominante
        const aluno = new Aluno('', '', 0, estatistica.humorPredominante);
        
        tr.innerHTML = `
          <td>${estatistica.turma}</td>
          <td>${estatistica.totalAlunos}</td>
          <td>${aluno.getEmojiHumor()} ${aluno.getNomeHumor()}</td>
        `;
        
        this.estatisticas.tabelaTurmas.appendChild(tr);
      });
    }
  }
  
  // Instancia o controlador quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', () => {
    // Instancia o controlador principal
    window.controladorAluno = new ControladorUI();
    
    // Adiciona classe CSS para animações após carregamento
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
  });
  
  // Adiciona algumas funcionalidades extras para melhorar a UX
  document.addEventListener('DOMContentLoaded', () => {
    // Adiciona animação ao emoji de humor no select
    const humorSelect = document.getElementById('humor');
    humorSelect.addEventListener('change', function() {
      const humorSelectContainer = document.querySelector('.humor-select');
      const humor = this.value;
      
      // Mapa de emojis
      const emojis = {
        'feliz': '😄',
        'triste': '😢',
        'estressado': '😠',
        'cansado': '😴',
        'ansioso': '😰',
        'entediado': '😐',
        'motivado': '💪',
        'confiante': '😎'
      };
      
      // Atualiza o emoji no pseudo-elemento
      humorSelectContainer.dataset.emoji = emojis[humor] || '😊';
      
      // Anima o emoji
      humorSelectContainer.classList.add('animating');
      setTimeout(() => {
        humorSelectContainer.classList.remove('animating');
      }, 500);
    });
  });
