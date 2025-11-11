import Processo from "../abstracoes/processo";
import { TipoDocumento } from "../enumeracoes/TipoDocumento";
import Cliente from "../modelos/cliente";
import Documento from "../modelos/documento";

export default class CadastroCpf extends Processo {
    private cliente: Cliente
    constructor(cliente: Cliente) {
        super()
        this.cliente = cliente
    }

    processar(): void {
        console.log('Cadastrando documento CPF...')
        
        let cpfExistente = this.cliente.Documentos.find(doc => doc.Tipo === TipoDocumento.CPF)
        if (cpfExistente) {
            console.log('❌ Erro: Cliente já possui um CPF cadastrado!')
            console.log(`CPF atual: ${this.formatarCPF(cpfExistente.Numero)}`)
            return
        }
        
        let numero = this.receberCPF()
        
        let armazem = require('../dominio/armazem').default.InstanciaUnica
        let documentoExistente = armazem.Clientes.some((cliente: any) => 
            cliente.Documentos.some((doc: any) => 
                doc.Tipo === TipoDocumento.CPF && doc.Numero === numero
            )
        )
        
        if (documentoExistente) {
            console.log('❌ Erro: Este número de CPF já está cadastrado no sistema!')
            return
        }
        
        let dataExpedicao = this.entrada.receberData('Qual a data de emissão do CPF?', false, true)
        
        let cpf = new Documento(numero, TipoDocumento.CPF, dataExpedicao)
        this.cliente.Documentos.push(cpf)
        
        console.log('✅ CPF cadastrado com sucesso!')
        console.log(`Número: ${this.formatarCPF(numero)}`)
        console.log(`Data de emissão: ${dataExpedicao.toLocaleDateString()}`)
    }

    private receberCPF(): string {
        let promptSync = require('prompt-sync')();
        
        while (true) {
            let input = promptSync('Qual o número do CPF (11 dígitos)? ');
            
            if (!input) {
                console.log('❌ Erro: CPF é obrigatório!');
                continue;
            }
            
            let numero = input.replace(/\D/g, '');
            
            if (numero.length !== 11) {
                console.log('❌ Erro: CPF deve ter exatamente 11 dígitos!');
                continue;
            }
            
            return numero;
        }
    }

    private formatarCPF(cpf: string): string {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
} 