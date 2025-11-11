import Processo from "../abstracoes/processo";
import { TipoDocumento } from "../enumeracoes/TipoDocumento";
import Cliente from "../modelos/cliente";
import Documento from "../modelos/documento";

export default class CadastroRg extends Processo {
    private cliente: Cliente
    constructor(cliente: Cliente) {
        super()
        this.cliente = cliente
    }

    processar(): void {
        try {
            console.log('Cadastrando documento RG...')
            
            let rgExistente = this.cliente.Documentos.find(doc => doc.Tipo === TipoDocumento.RG)
            if (rgExistente) {
                console.log('❌ Erro: Cliente já possui um RG cadastrado!')
                console.log(`RG atual: ${rgExistente.Numero}`)
                return
            }
            
            let numero = this.entrada.receberDocumento('Qual o número do RG?', 'rg')
            
            let armazem = require('../dominio/armazem').default.InstanciaUnica
            let documentoExistente = armazem.Clientes.some((cliente: any) => 
                cliente.Documentos.some((doc: any) => 
                    doc.Tipo === TipoDocumento.RG && doc.Numero === numero
                )
            )
            
            if (documentoExistente) {
                console.log('❌ Erro: Este número de RG já está cadastrado no sistema!')
                return
            }
            
            let dataExpedicao = this.entrada.receberData('Qual a data de expedição do RG?', false, true)
            
            if (dataExpedicao <= this.cliente.DataNascimento) {
                console.log('❌ Erro: Data de expedição deve ser posterior à data de nascimento!')
                return
            }
                
            let hoje = new Date()
            let diferencaAnos = hoje.getFullYear() - dataExpedicao.getFullYear()
            if (diferencaAnos > 50) {
                console.log('❌ Erro: Data de expedição muito antiga (máximo 50 anos)!')
                return
            }
            
            let rg = new Documento(numero, TipoDocumento.RG, dataExpedicao)
            this.cliente.Documentos.push(rg)
            
            console.log('✅ RG cadastrado com sucesso!')
            console.log(`Número: ${numero}`)
            console.log(`Data de expedição: ${dataExpedicao.toLocaleDateString()}`)
            
        } catch (error) {
            console.log('❌ Erro durante o cadastro do RG:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
        }
    }
}