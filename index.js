const fs = require('fs');

function converterParaBinario(caractere) {
  const binario = caractere.charCodeAt(0).toString(2).padStart(8, '0');
  return binario;
}

function calcularBitParidade(binario) {
  let count = 0;
  for (let i = 0; i < binario.length; i++) {
    if (binario[i] === '1') {
      count++;
    }
  }
  return count % 2 === 0 ? '0' : '1';
}

function gerarArquivoParidade(palavra) {
  let conteudoArquivo = '';

  for (let i = 0; i < palavra.length; i++) {
    const caractere = palavra[i];
    const binario = converterParaBinario(caractere);
    const bitParidade = calcularBitParidade(binario);
    conteudoArquivo += `${caractere}: ${binario} ${bitParidade}\n`;
  }

  fs.writeFileSync('arquivo_paridade.txt', conteudoArquivo, 'utf8');
}

function simularErroTransmissao() {
  const conteudoArquivo = fs.readFileSync('arquivo_paridade.txt', 'utf8');
  let novoConteudoArquivo = '';

  for (let i = 0; i < conteudoArquivo.length; i++) {
    if (Math.random() < 0.1) {
      const caractereAtual = conteudoArquivo[i];
      if (caractereAtual === '0') {
        novoConteudoArquivo += '1';
      } else if (caractereAtual === '1') {
        novoConteudoArquivo += '0';
      } else {
        novoConteudoArquivo += caractereAtual;
      }
    } else {
      novoConteudoArquivo += conteudoArquivo[i];
    }
  }

  fs.writeFileSync('arquivo_erro.txt', novoConteudoArquivo, 'utf8');
}

const palavra = 'Olá';
gerarArquivoParidade(palavra);
console.log('Arquivo de paridade gerado com sucesso.');

simularErroTransmissao();
console.log('Arquivo com erro de transmissão gerado com sucesso.');
