import promptSync from "prompt-sync";

export default class Entrada {
    public receberNumero(mensagem: string): number {
        let prompt = promptSync();
        let tentativas = 0;
        const maxTentativas = 3;

        while (tentativas < maxTentativas) {
            try {
                let valor = prompt(`${mensagem} `);
                
                if (!valor || valor.trim() === '') {
                    console.log('❌ Erro: Valor não pode estar vazio!');
                    tentativas++;
                    continue;
                }

                let numero = parseFloat(valor.replace(',', '.'));
                
                if (isNaN(numero)) {
                    console.log('❌ Erro: Por favor, digite um número válido!');
                    tentativas++;
                    continue;
                }

                return numero;
            } catch (error) {
                console.log('❌ Erro: Entrada inválida. Tente novamente.');
                tentativas++;
            }
        }
        
        throw new Error('Número máximo de tentativas excedido para entrada numérica.');
    }

    public receberTexto(mensagem: string, obrigatorio: boolean = true, tamanhoMinimo: number = 1, tamanhoMaximo: number = 100): string {
        let prompt = promptSync();
        let tentativas = 0;
        const maxTentativas = 3;

        while (tentativas < maxTentativas) {
            let texto = prompt(`${mensagem} `);
            
            if (!texto) texto = '';
            texto = texto.trim();

            if (obrigatorio && texto === '') {
                console.log('❌ Erro: Este campo é obrigatório!');
                tentativas++;
                continue;
            }

            if (texto.length > 0 && texto.length < tamanhoMinimo) {
                console.log(`❌ Erro: Texto deve ter pelo menos ${tamanhoMinimo} caracteres!`);
                tentativas++;
                continue;
            }

            if (texto.length > tamanhoMaximo) {
                console.log(`❌ Erro: Texto deve ter no máximo ${tamanhoMaximo} caracteres!`);
                tentativas++;
                continue;
            }

            if (this.contemCaracteresInvalidos(texto)) {
                console.log('❌ Erro: Texto contém caracteres inválidos!');
                tentativas++;
                continue;
            }

            return texto;
        }
        
        throw new Error('Número máximo de tentativas excedido para entrada de texto.');
    }

    public receberNome(mensagem: string): string {
        let prompt = promptSync();
        let tentativas = 0;
        const maxTentativas = 3;

        while (tentativas < maxTentativas) {
            let nome = prompt(`${mensagem} `);
            
            if (!nome) nome = '';
            nome = nome.trim();

            if (nome === '') {
                console.log('❌ Erro: Nome é obrigatório!');
                tentativas++;
                continue;
            }

            if (nome.length < 2) {
                console.log('❌ Erro: Nome deve ter pelo menos 2 caracteres!');
                tentativas++;
                continue;
            }

            if (nome.length > 50) {
                console.log('❌ Erro: Nome deve ter no máximo 50 caracteres!');
                tentativas++;
                continue;
            }

            if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(nome)) {
                console.log('❌ Erro: Nome deve conter apenas letras, espaços, hífen e apostrófe!');
                tentativas++;
                continue;
            }

            if (mensagem.toLowerCase().includes('nome') && !mensagem.toLowerCase().includes('social') && nome.split(' ').length < 2) {
                console.log('❌ Erro: Por favor, digite o nome completo (nome e sobrenome)!');
                tentativas++;
                continue;
            }

            return nome;
        }
        
        throw new Error('Número máximo de tentativas excedido para entrada de nome.');
    }

    public receberDocumento(mensagem: string, tipo: string): string {
        let prompt = promptSync();
        let tentativas = 0;
        const maxTentativas = 3;

        while (tentativas < maxTentativas) {
            let documento = prompt(`${mensagem} `);
            
            if (!documento) documento = '';
            documento = documento.trim().replace(/[^\w]/g, '');

            if (documento === '') {
                console.log('❌ Erro: Número do documento é obrigatório!');
                tentativas++;
                continue;
            }

            if (tipo.toLowerCase() === 'rg') {
                if (documento.length < 7 || documento.length > 12) {
                    console.log('❌ Erro: RG deve ter entre 7 e 12 caracteres!');
                    tentativas++;
                    continue;
                }
            } else if (tipo.toLowerCase() === 'cpf') {
                if (documento.length !== 11) {
                    console.log('❌ Erro: CPF deve ter exatamente 11 dígitos!');
                    tentativas++;
                    continue;
                }
                if (!this.validarCPF(documento)) {
                    console.log('❌ Erro: CPF inválido!');
                    tentativas++;
                    continue;
                }
            } else if (tipo.toLowerCase() === 'passaporte') {
                if (documento.length < 6 || documento.length > 12) {
                    console.log('❌ Erro: Passaporte deve ter entre 6 e 12 caracteres!');
                    tentativas++;
                    continue;
                }
            }

            return documento;
        }
        
        throw new Error('Número máximo de tentativas excedido para entrada de documento.');
    }

    public receberData(mensagem: string, permitirFuturo: boolean = true, permitirPassado: boolean = true): Date {
        let prompt = promptSync();
        let tentativas = 0;
        const maxTentativas = 3;

        while (tentativas < maxTentativas) {
            try {
                let texto = prompt(`${mensagem}, no padrão dd/MM/yyyy: `);
                
                if (!texto || texto.trim() === '') {
                    console.log('❌ Erro: Data é obrigatória!');
                    tentativas++;
                    continue;
                }

                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto.trim())) {
                    console.log('❌ Erro: Data deve estar no formato dd/MM/yyyy!');
                    tentativas++;
                    continue;
                }

                let partes = texto.trim().split('/');
                let dia = parseInt(partes[0]);
                let mes = parseInt(partes[1]);
                let ano = parseInt(partes[2]);

                if (dia < 1 || dia > 31) {
                    console.log('❌ Erro: Dia deve estar entre 1 e 31!');
                    tentativas++;
                    continue;
                }

                if (mes < 1 || mes > 12) {
                    console.log('❌ Erro: Mês deve estar entre 1 e 12!');
                    tentativas++;
                    continue;
                }

                if (ano < 1900 || ano > 2100) {
                    console.log('❌ Erro: Ano deve estar entre 1900 e 2100!');
                    tentativas++;
                    continue;
                }

                let data = new Date(ano, mes - 1, dia);
                
                if (data.getDate() !== dia || data.getMonth() !== (mes - 1) || data.getFullYear() !== ano) {
                    console.log('❌ Erro: Data inválida!');
                    tentativas++;
                    continue;
                }

                let hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                data.setHours(0, 0, 0, 0);

                if (!permitirPassado && data < hoje) {
                    console.log('❌ Erro: Data não pode ser no passado!');
                    tentativas++;
                    continue;
                }

                if (!permitirFuturo && data > hoje) {
                    console.log('❌ Erro: Data não pode ser no futuro!');
                    tentativas++;
                    continue;
                }

                if (mensagem.toLowerCase().includes('nascimento')) {
                    let idade = hoje.getFullYear() - data.getFullYear();
                    if (idade < 0 || idade > 120) {
                        console.log('❌ Erro: Data de nascimento inválida (idade deve estar entre 0 e 120 anos)!');
                        tentativas++;
                        continue;
                    }
                }

                return data;
            } catch (error) {
                console.log('❌ Erro: Data inválida. Tente novamente.');
                tentativas++;
            }
        }
        
        throw new Error('Número máximo de tentativas excedido para entrada de data.');
    }

    public receberCodigoPostal(mensagem: string): string {
        let prompt = promptSync();
        let tentativas = 0;
        const maxTentativas = 3;

        while (tentativas < maxTentativas) {
            let codigo = prompt(`${mensagem} `);
            
            if (!codigo) codigo = '';
            codigo = codigo.trim().replace(/[^\w\-]/g, '');

            if (codigo === '') {
                console.log('❌ Erro: Código postal é obrigatório!');
                tentativas++;
                continue;
            }

            if (codigo.length < 5 || codigo.length > 12) {
                console.log('❌ Erro: Código postal deve ter entre 5 e 12 caracteres!');
                tentativas++;
                continue;
            }

            if (/^\d{8}$/.test(codigo) || /^\d{5}-?\d{3}$/.test(codigo)) {
                return codigo;
            }

            if (/^[A-Z0-9\-]{5,12}$/i.test(codigo)) {
                return codigo;
            }

            console.log('❌ Erro: Formato de código postal inválido!');
            tentativas++;
        }
        
        throw new Error('Número máximo de tentativas excedido para entrada de código postal.');
    }

    private contemCaracteresInvalidos(texto: string): boolean {
        const caracteresProibidos = /[<>\"'%;()&+]/;
        return caracteresProibidos.test(texto);
    }

    private validarCPF(cpf: string): boolean {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) return false;
        
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digito1 = resto < 2 ? 0 : resto;
        
        if (parseInt(cpf.charAt(9)) !== digito1) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digito2 = resto < 2 ? 0 : resto;
        
        return parseInt(cpf.charAt(10)) === digito2;
    }
}