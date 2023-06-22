const CRC_POLYNOMIAL_16 = 0x8005; // Polinômio CRC-16
const INITIAL_CRC_VALUE_16 = 0xffff; // Valor inicial do CRC para CRC-16
const CRC_MASK_16 = 0xffff; // Máscara para manter o valor do CRC em 16 bits

const CRC_POLYNOMIAL_32 = 0x04c11db7; // Polinômio CRC-32
const INITIAL_CRC_VALUE_32 = 0xffffffff; // Valor inicial do CRC para CRC-32
const CRC_MASK_32 = 0xffffffff; // Máscara para manter o valor do CRC em 32 bits

// Função para calcular o CRC-16
function generateCRC16(inputData) {
  let crc = INITIAL_CRC_VALUE_16;

  for (let i = 0; i < inputData.length; i++) {
    crc ^= (inputData.charCodeAt(i) << 8) & CRC_MASK_16; // XOR com o próximo byte

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ CRC_POLYNOMIAL_16; // Aplica o polinômio ao CRC
      } else {
        crc = crc << 1;
      }
    }
  }

  crc = crc & CRC_MASK_16; // Aplica a máscara para manter o CRC em 16 bits
  return crc.toString(16).toUpperCase(); // Converte o CRC para uma string hexadecimal maiúscula
}

// Função para calcular o CRC-32
function generateCRC32(inputData) {
  let crc = INITIAL_CRC_VALUE_32;

  for (let i = 0; i < inputData.length; i++) {
    crc ^= (inputData.charCodeAt(i) << 24) & CRC_MASK_32; // XOR com o próximo byte

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x80000000) !== 0) {
        crc = (crc << 1) ^ CRC_POLYNOMIAL_32; // Aplica o polinômio ao CRC
      } else {
        crc = crc << 1;
      }
    }
  }

  crc = crc & CRC_MASK_32; // Aplica a máscara para manter o CRC em 32 bits
  return crc.toString(16).toUpperCase(); // Converte o CRC para uma string hexadecimal maiúscula
}

// Função para verificar se o CRC-16 recebido é igual ao CRC calculado
function verifyCRC16(inputData, receivedCRC) {
  const calculatedCRC = generateCRC16(inputData);
  return calculatedCRC === receivedCRC;
}

// Função para verificar se o CRC-32 recebido é igual ao CRC calculado
function verifyCRC32(inputData, receivedCRC) {
  const calculatedCRC = generateCRC32(inputData);
  return calculatedCRC === receivedCRC;
}

// Código principal para receber a entrada do usuário e verificar os CRCs
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Digite uma palavra: ', (inputData) => {
  if (!isASCII(inputData)) {
    console.log('Erro: A entrada deve conter apenas caracteres ASCII.');
    readline.close();
    return;
  }

  const crc16 = generateCRC16(inputData);
  console.log(`CRC-16 gerado: ${crc16}`);

  const crc32 = generateCRC32(inputData);
  console.log(`CRC-32 gerado: ${crc32}`);

  readline.question('Digite o CRC-16 recebido: ', (receivedCRC16) => {
    const isDataValid16 = verifyCRC16(inputData, receivedCRC16);

    readline.question('Digite o CRC-32 recebido: ', (receivedCRC32) => {
      const isDataValid32 = verifyCRC32(inputData, receivedCRC32);

      if (isDataValid16) {
        console.log('O CRC-16 recebido está correto.');
      } else {
        console.log('Erro detectado no CRC-16 recebido.');
      }

      if (isDataValid32) {
        console.log('O CRC-32 recebido está correto.');
      } else {
        console.log('Erro detectado no CRC-32 recebido.');
      }

      readline.close();
    });
  });
});

// Função para verificar se uma string contém apenas caracteres ASCII
function isASCII(str) {
  return /^[\x00-\x7F]*$/.test(str);
}
