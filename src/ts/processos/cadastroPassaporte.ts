import Processo from "../abstracoes/processo";
import { TipoDocumento } from "../enumeracoes/TipoDocumento";
import Cliente from "../modelos/cliente";
import Documento from "../modelos/documento";

export default class CadastroPassaporte extends Processo {
    private cliente: Cliente
    constructor(cliente: Cliente) {
        super()
        this.cliente = cliente
    }

    processar(): void {
        console.log('Cadastrando documento Passaporte...')
        
        let passaporteExistente = this.cliente.Documentos.find(doc => doc.Tipo === TipoDocumento.Passaporte)
        if (passaporteExistente) {
            console.log('❌ Erro: Cliente já possui um Passaporte cadastrado!')
            console.log(`Passaporte atual: ${passaporteExistente.Numero.toUpperCase()}`)
            return
        }
        
        let numero = this.receberPassaporte()
        
        let armazem = require('../dominio/armazem').default.InstanciaUnica
        let documentoExistente = armazem.Clientes.some((cliente: any) => 
            cliente.Documentos.some((doc: any) => 
                doc.Tipo === TipoDocumento.Passaporte && doc.Numero === numero
            )
        )
        
        if (documentoExistente) {
            console.log('❌ Erro: Este número de Passaporte já está cadastrado no sistema!')
            return
        }
        
        let dataExpedicao = this.entrada.receberData('Qual a data de expedição do Passaporte?', false, true)
        
        let passaporte = new Documento(numero, TipoDocumento.Passaporte, dataExpedicao)
        this.cliente.Documentos.push(passaporte)
        
        console.log('✅ Passaporte cadastrado com sucesso!')
        console.log(`Número: ${numero.toUpperCase()}`)
        console.log(`Data de expedição: ${dataExpedicao.toLocaleDateString()}`)
    }

    private receberPassaporte(): string {
        let promptSync = require('prompt-sync')();
        
        while (true) {
            let input = promptSync('Qual o número do Passaporte (6-12 caracteres)? ');
            
            if (!input) {
                console.log('❌ Erro: Passaporte é obrigatório!');
                continue;
            }
            
            let numero = input.trim().toUpperCase().replace(/\s/g, '');
            
            if (!/^[A-Z0-9]+$/.test(numero)) {
                console.log('❌ Erro: Passaporte deve conter apenas letras e números!');
                continue;
            }
            
            if (numero.length < 6 || numero.length > 12) {
                console.log('❌ Erro: Passaporte deve ter entre 6 e 12 caracteres!');
                continue;
            }
            
            return numero;
        }
    }
} 