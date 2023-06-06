const fs = require('fs');

function charToBinary(char) {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
}

function calculateParityBit(binary) {
    const count = binary.split('1').length - 1;

    return count % 2 !== 0 ? '1' : '0';
}

function save(data) {
    const filename = 'paridade.json';
    const fileStream = fs.createWriteStream(filename);

    fileStream.write(JSON.stringify(data));

    fileStream.end();

    readline.close();
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let word = '';

readline.question('Digite uma palavra: ', (inputWord) => {
    word = inputWord;

    const data = [];

    for (let i = 0; i < word.length; i++) {
        const char = word.charAt(i);
        const binary = charToBinary(char);

        data.push({
            char: char,
            char_ascii: char.charCodeAt(0),
            binary: binary,
            parityBit: calculateParityBit(binary)
        });
    }

    readline.question('Deseja editar algum bit? (S/N): ', (choice) => {
        if (choice.toUpperCase() === 'S') {
            readline.question('Digite a posição do bit a ser editado: ', (position) => {
                position = parseInt(position);

                if (!isNaN(position) && position >= 0 && position < word.length) {
                    const binary = data[position].binary;

                    data[position].binary = binary.substr(0, position) + (binary.charAt(position) === '1' ? '0' : '1') + binary.substr(position + 1);
                    data[position].parityBit = Math.floor(Math.random() * 2).toString();

                    save(data);
                } else {
                    console.log('Posição inválida.');
                }
            });
        } else {
            save(data);
        }
    });
});



readline.on('close', () => {
    fs.readFile( 'paridade.json', (err, content) => {
        if (err) {
            console.error(err);
            return;
        }

        const data = JSON.parse(content);

        console.log('Arquivo de paridade:');
        console.log(data);

        let errorDetected = false;

        for (let i = 0; i < data.length; i++) {
            const correctBinary = charToBinary(data[i].char);
            const correctParityBit = calculateParityBit(correctBinary);

            if (
                data[i].binary !== correctBinary
                    || data[i].parityBit !== correctParityBit
            ) {
                console.log(`Erro detectado na posição ${i} (${data[i].char}). Binário deve ser ${correctBinary} e bit de paridade ${correctParityBit}`);
                errorDetected = true;
            }
        }

        if (!errorDetected) {
            console.log('Nenhum erro detectado na transmissão.');
        }
    });
});



