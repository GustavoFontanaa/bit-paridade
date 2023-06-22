const CRC_POLYNOMIAL_16 = 0x8005; // CRC-16 polynomial
const INITIAL_CRC_VALUE_16 = 0xffff; // Initial CRC value for CRC-16
const CRC_MASK_16 = 0xffff; // Mask the CRC value to 16 bits

const CRC_POLYNOMIAL_32 = 0x04c11db7; // CRC-32 polynomial
const INITIAL_CRC_VALUE_32 = 0xffffffff; // Initial CRC value for CRC-32
const CRC_MASK_32 = 0xffffffff; // Mask the CRC value to 32 bits

function generateCRC16(inputData) {
  let crc = INITIAL_CRC_VALUE_16;

  for (let i = 0; i < inputData.length; i++) {
    crc ^= (inputData.charCodeAt(i) << 8) & CRC_MASK_16; // XOR with next byte

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ CRC_POLYNOMIAL_16;
      } else {
        crc = crc << 1;
      }
    }
  }

  crc = crc & CRC_MASK_16;
  return crc.toString(16).toUpperCase();
}

function generateCRC32(inputData) {
  let crc = INITIAL_CRC_VALUE_32;

  for (let i = 0; i < inputData.length; i++) {
    crc ^= (inputData.charCodeAt(i) << 24) & CRC_MASK_32; // XOR with next byte

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x80000000) !== 0) {
        crc = (crc << 1) ^ CRC_POLYNOMIAL_32;
      } else {
        crc = crc << 1;
      }
    }
  }

  crc = crc & CRC_MASK_32;
  return crc.toString(16).toUpperCase();
}

function verifyCRC16(inputData, receivedCRC) {
  const calculatedCRC = generateCRC16(inputData);
  return calculatedCRC === receivedCRC;
}

function verifyCRC32(inputData, receivedCRC) {
  const calculatedCRC = generateCRC32(inputData);
  return calculatedCRC === receivedCRC;
}

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

function isASCII(str) {
  return /^[\x00-\x7F]*$/.test(str);
}
