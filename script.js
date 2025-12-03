const cotacaoURL = 'https://economia.awesomeapi.com.br/json/last/EUR-USD';
const taxaConversaoReais = 5.32; // valor manual da célula G11 da Tabela 3

// Recupera valores salvos
document.getElementById('contratos').value = localStorage.getItem('contratos') || '0.01';
document.getElementById('precoMedio').value = localStorage.getItem('precoMedio') || '1.10000';

async function atualizarTabela() {
  try {
    const response = await fetch(cotacaoURL);
    const data = await response.json();

    if (!data.EURUSD || !data.EURUSD.bid) {
      throw new Error("Dados inválidos da API");
    }

    const valorAtual = parseFloat(data.EURUSD.bid);
    const agora = new Date();
    const horaAtual = agora.toLocaleTimeString();
    const dataAtual = agora.toLocaleDateString();

    const contratos = parseFloat(document.getElementById('contratos').value) || 0;
    const precoMedio = parseFloat(document.getElementById('precoMedio').value) || 0;

    const pips = ((valorAtual - precoMedio) / 0.0001);
    const dolar = pips * (contratos * 10);
    const reais = dolar * taxaConversaoReais;

    document.getElementById('hora').textContent = horaAtual;
    document.getElementById('data').textContent = dataAtual;
    document.getElementById('valorAtual').textContent = valorAtual.toFixed(5);
    document.getElementById('pips').textContent = pips.toFixed(2);
    document.getElementById('dolar').textContent = dolar.toFixed(2);
    document.getElementById('reais').textContent = reais.toFixed(2);
  } catch (error) {
    console.error('Erro ao buscar cotação:', error);
    document.getElementById('valorAtual').textContent = 'Erro';
    document.getElementById('pips').textContent = '';
    document.getElementById('dolar').textContent = '';
    document.getElementById('reais').textContent = '';
  }
}

// Atualiza ao carregar e a cada minuto
atualizarTabela();
setInterval(atualizarTabela, 60000);

// Atualiza e salva ao alterar os inputs
document.getElementById('contratos').addEventListener('input', () => {
  localStorage.setItem('contratos', document.getElementById('contratos').value);
  atualizarTabela();
});

document.getElementById('precoMedio').addEventListener('input', () => {
  localStorage.setItem('precoMedio', document.getElementById('precoMedio').value);
  atualizarTabela();
});