import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Cliente from "../modelos/cliente";
import ImpressaorCliente from "../impressores/impressorCliente";
import Impressor from "../interfaces/impressor";

export default class ExclusaoCliente extends Processo {
    private clientes: Cliente[]
    private hospedagens: any[]
    private impressor!: Impressor

    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
        this.hospedagens = Armazem.InstanciaUnica.Hospedagens
    }

    processar(): void {
        console.log('Iniciando a exclusão de cliente...')
        
        if (this.clientes.length === 0) {
            console.log('❌ Erro: Não há clientes cadastrados no sistema!')
            return
        }

        console.log('Clientes disponíveis para exclusão:')
        this.clientes.forEach((cliente, index) => {
            let tipo = cliente.Titular ? 'Dependente' : 'Titular'
            let dependentesInfo = !cliente.Titular ? ` (${cliente.Dependentes.length} dependente(s))` : ''
            
            let hospedagemAtiva = this.hospedagens.find(h => h.Cliente === cliente && h.Ativa)
            let statusHospedagem = hospedagemAtiva ? ' [HOSPEDADO - NÃO PODE EXCLUIR]' : ''
            
            console.log(`${index + 1} - ${cliente.Nome} (${tipo})${dependentesInfo}${statusHospedagem}`)
        })

        let indiceCliente = this.entrada.receberNumero('Selecione o cliente para excluir pelo número:') - 1
        
        if (indiceCliente < 0 || indiceCliente >= this.clientes.length) {
            console.log('❌ Erro: Número de cliente inválido!')
            return
        }
        
        let clienteSelecionado = this.clientes[indiceCliente]
        
        let hospedagemAtiva = this.hospedagens.find(h => h.Cliente === clienteSelecionado && h.Ativa)
        if (hospedagemAtiva) {
            console.log('❌ Erro: Não é possível excluir cliente com hospedagem ativa!')
            console.log(`Acomodação: ${hospedagemAtiva.Acomodacao.NomeAcomadacao}`)
            console.log('Encerre a hospedagem antes de excluir o cliente.')
            return
        }
        
        console.log('\n📋 Cliente a ser excluído:')
        this.impressor = new ImpressaorCliente(clienteSelecionado)
        console.log(this.impressor.imprimir())
        
        if (!clienteSelecionado.Titular && clienteSelecionado.Dependentes.length > 0) {
            console.log(`⚠️  Este titular possui ${clienteSelecionado.Dependentes.length} dependente(s).`)
            console.log('1 - Excluir titular e todos os dependentes')
            console.log('2 - Transferir dependentes para outro titular')
            console.log('0 - Cancelar')
            
            let opcao = this.entrada.receberNumero('Escolha uma opção:')
            
            if (opcao === 0) {
                console.log('Exclusão cancelada.')
                return
            } else if (opcao === 2) {
                if (!this.transferirDependentes(clienteSelecionado)) {
                    return
                }
            }
        }
        
        this.excluirCliente(clienteSelecionado)
    }

    private transferirDependentes(titularAntigo: Cliente): boolean {
        let outrosTitulares = this.clientes.filter(c => 
            !c.Titular && c !== titularAntigo
        )
        
        if (outrosTitulares.length === 0) {
            console.log('❌ Erro: Não há outros titulares disponíveis!')
            return false
        }
        
        console.log('\nTitulares disponíveis:')
        outrosTitulares.forEach((titular, index) => {
            console.log(`${index + 1} - ${titular.Nome}`)
        })
        
        let indiceTitular = this.entrada.receberNumero('Selecione o novo titular:') - 1
        
        if (indiceTitular < 0 || indiceTitular >= outrosTitulares.length) {
            console.log('❌ Erro: Titular inválido!')
            return false
        }
        
        let novoTitular = outrosTitulares[indiceTitular]
        
        titularAntigo.Dependentes.forEach(dependente => {
            ;(dependente as any).titular = novoTitular
            dependente.Endereco = novoTitular.Endereco
            novoTitular.Dependentes.push(dependente)
        })
        
        console.log(`✅ ${titularAntigo.Dependentes.length} dependente(s) transferido(s) para ${novoTitular.Nome}`)
        
        ;(titularAntigo as any).dependentes = []
        
        return true
    }

    private excluirCliente(cliente: Cliente): void {
        let nomeCliente = cliente.Nome
        let quantidadeDependentes = 0
        
        if (!cliente.Titular && cliente.Dependentes.length > 0) {
            quantidadeDependentes = cliente.Dependentes.length
            
            cliente.Dependentes.forEach(dependente => {
                let indiceDependente = this.clientes.indexOf(dependente)
                if (indiceDependente > -1) {
                    this.clientes.splice(indiceDependente, 1)
                }
            })
        }
        
        if (cliente.Titular) {
            let indiceDependente = cliente.Titular.Dependentes.indexOf(cliente)
            if (indiceDependente > -1) {
                cliente.Titular.Dependentes.splice(indiceDependente, 1)
            }
        }
          
        let indiceCliente = this.clientes.indexOf(cliente)
        if (indiceCliente > -1) {
            this.clientes.splice(indiceCliente, 1)
        }
        
        console.log('✅ Cliente excluído com sucesso!')
        console.log(`Cliente excluído: ${nomeCliente}`)
        
        if (quantidadeDependentes > 0) {
            console.log(`Dependentes excluídos: ${quantidadeDependentes}`)
        }
        
        console.log(`Total de clientes restantes: ${this.clientes.length}`)
    }
} 