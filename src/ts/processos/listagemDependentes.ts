import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import ImpressaorCliente from "../impressores/impressorCliente";
import Impressor from "../interfaces/impressor";
import Cliente from "../modelos/cliente";

export default class ListagemDependentes extends Processo {
    private clientes: Cliente[]
    private impressor!: Impressor

    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }

    processar(): void {
        console.clear()
        console.log('Iniciando a listagem de dependentes...')
        
        try {
            let titulares = this.clientes.filter(cliente => !cliente.Titular)
            
            if (titulares.length === 0) {
                console.log('❌ Não há titulares cadastrados no sistema.')
                return
            }

            console.log('Titulares disponíveis:')
            console.log(`-------------------------------------------------`)
            titulares.forEach((titular, index) => {
                let dependentesCount = titular.Dependentes.length
                console.log(`${index + 1} - ${titular.Nome} (${dependentesCount} dependente(s))`)
            })
            console.log(`-------------------------------------------------`)

            let indiceTitular = this.entrada.receberNumero('Selecione o titular para ver os dependentes:') - 1
            
            if (indiceTitular < 0 || indiceTitular >= titulares.length) {
                console.log('❌ Erro: Número de titular inválido!')
                return
            }
            
            let titularSelecionado = titulares[indiceTitular]
            
            console.log(`\n📋 Dependentes de: ${titularSelecionado.Nome}`)
            console.log(`-------------------------------------------------`)
            
            if (titularSelecionado.Dependentes.length === 0) {
                console.log('Este titular não possui dependentes cadastrados.')
                return
            }
            
            titularSelecionado.Dependentes.forEach((dependente, index) => {
                console.log(`\n👤 Dependente ${index + 1}:`)
                this.impressor = new ImpressaorCliente(dependente)
                console.log(this.impressor.imprimir())
                console.log(`-------------------------------------------------`)
            })
            
            console.log(`\n📊 Resumo:`)
            console.log(`Titular: ${titularSelecionado.Nome}`)
            console.log(`Total de dependentes: ${titularSelecionado.Dependentes.length}`)
            console.log(`Data de cadastro do titular: ${titularSelecionado.DataCadastro.toLocaleDateString()}`)
            
        } catch (error) {
            console.log('❌ Erro durante a listagem de dependentes:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
        }
    }
} 