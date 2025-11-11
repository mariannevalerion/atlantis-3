import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Acomodacao from "../modelos/acomodacao";
import Cliente from "../modelos/cliente";
import Hospedagem from "../modelos/hospedagem";

export default class CadastroHospedagem extends Processo {
    private hospedagens: Hospedagem[]
    private clientes: Cliente[]
    private acomodacoes: Acomodacao[]

    constructor() {
        super()
        this.hospedagens = Armazem.InstanciaUnica.Hospedagens
        this.clientes = Armazem.InstanciaUnica.Clientes
        this.acomodacoes = Armazem.InstanciaUnica.Acomodacoes
    }

    processar(): void {
        console.log('Iniciando o cadastro de uma nova hospedagem...')

        try {
            if (this.clientes.length === 0) {
                console.log('❌ Erro: Não há clientes cadastrados no sistema!')
                console.log('É necessário cadastrar pelo menos um cliente antes de criar uma hospedagem.')
                return
            }

            if (this.acomodacoes.length === 0) {
                console.log('❌ Erro: Não há acomodações cadastradas no sistema!')
                console.log('É necessário cadastrar pelo menos uma acomodação antes de criar uma hospedagem.')
                return
            }

            console.log('Clientes disponíveis:')
            this.clientes.forEach((cliente, index) => {
                let hospedagemAtiva = this.hospedagens.find(h => 
                    h.Cliente === cliente && h.Ativa
                )
                let status = hospedagemAtiva ? ' (JÁ HOSPEDADO)' : ' (DISPONÍVEL)'
                console.log(`${index + 1} - ${cliente.Nome}${status}`)
            })

            let indiceCliente = this.entrada.receberNumero('Selecione o cliente pelo número:') - 1
            

            if (indiceCliente < 0 || indiceCliente >= this.clientes.length) {
                console.log('❌ Erro: Número de cliente inválido!')
                return
            }
            
            let clienteSelecionado = this.clientes[indiceCliente]

            let hospedagemAtiva = this.hospedagens.find(h => 
                h.Cliente === clienteSelecionado && h.Ativa
            )
            
            if (hospedagemAtiva) {
                console.log('❌ Erro: Este cliente já possui uma hospedagem ativa!')
                console.log(`Acomodação atual: ${hospedagemAtiva.Acomodacao.NomeAcomadacao}`)
                console.log(`Data de início: ${hospedagemAtiva.DataInicio.toLocaleDateString()}`)
                console.log('É necessário encerrar a hospedagem atual antes de criar uma nova.')
                return
            }

            console.log('Acomodações disponíveis:')
            this.acomodacoes.forEach((acomodacao, index) => {
                let ocupada = this.hospedagens.find(h => 
                    h.Acomodacao === acomodacao && h.Ativa
                )
                let status = ocupada ? ' (OCUPADA)' : ' (DISPONÍVEL)'
                console.log(`${index + 1} - ${acomodacao.NomeAcomadacao}${status}`)
            })

            let indiceAcomodacao = this.entrada.receberNumero('Selecione a acomodação pelo número:') - 1
            
            if (indiceAcomodacao < 0 || indiceAcomodacao >= this.acomodacoes.length) {
                console.log('❌ Erro: Número de acomodação inválido!')
                return
            }
            
            let acomodacaoSelecionada = this.acomodacoes[indiceAcomodacao]

            let acomodacaoOcupada = this.hospedagens.find(h => 
                h.Acomodacao === acomodacaoSelecionada && h.Ativa
            )
            
            if (acomodacaoOcupada) {
                console.log('❌ Erro: Esta acomodação já está ocupada!')
                console.log(`Cliente atual: ${acomodacaoOcupada.Cliente.Nome}`)
                console.log(`Data de início: ${acomodacaoOcupada.DataInicio.toLocaleDateString()}`)
                console.log('Por favor, selecione uma acomodação disponível.')
                return
            }

            let dataInicio = this.entrada.receberData('Qual a data de início da hospedagem?', true, false)
            
            let hoje = new Date()
            hoje.setHours(0, 0, 0, 0)
            dataInicio.setHours(0, 0, 0, 0)
            
            let diferencaDias = Math.floor((dataInicio.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
            
            if (diferencaDias < -30) {
                console.log('❌ Erro: Data de início não pode ser mais de 30 dias no passado!')
                return
            }

            if (diferencaDias > 365) {
                console.log('❌ Erro: Data de início não pode ser mais de 1 ano no futuro!')
                return
            }

            let conflito = this.hospedagens.find(h => 
                h.Acomodacao === acomodacaoSelecionada && 
                h.DataInicio.getTime() === dataInicio.getTime()
            )
            
            if (conflito) {
                console.log('❌ Erro: Já existe uma hospedagem para esta acomodação na mesma data!')
                return
            }

            let hospedagem = new Hospedagem(clienteSelecionado, acomodacaoSelecionada, dataInicio)
            this.hospedagens.push(hospedagem)

            console.log('✅ Hospedagem cadastrada com sucesso!')
            console.log(`Cliente: ${clienteSelecionado.Nome}`)
            console.log(`Acomodação: ${acomodacaoSelecionada.NomeAcomadacao}`)
            console.log(`Data de início: ${dataInicio.toLocaleDateString()}`)
            console.log(`Status: Ativa`)
            
            let hospedagensAtivas = this.hospedagens.filter(h => h.Ativa)
            console.log(`\nTotal de hospedagens ativas: ${hospedagensAtivas.length}`)
            
        } catch (error) {
            console.log('❌ Erro durante o cadastro da hospedagem:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
            console.log('Cadastro cancelado.')
        }
    }
}