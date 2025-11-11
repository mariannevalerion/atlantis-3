import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Hospedagem from "../modelos/hospedagem";

export default class EncerramentoHospedagem extends Processo {
    private hospedagens: Hospedagem[]

    constructor() {
        super()
        this.hospedagens = Armazem.InstanciaUnica.Hospedagens
    }

    processar(): void {
        console.log('Iniciando o encerramento de uma hospedagem...')

        let hospedagensAtivas = this.hospedagens.filter(h => h.Ativa)

        if (hospedagensAtivas.length === 0) {
            console.log('Não há hospedagens ativas para encerrar.')
            return
        }

        console.log('Hospedagens ativas:')
        hospedagensAtivas.forEach((hospedagem, index) => {
            console.log(`${index + 1} - Cliente: ${hospedagem.Cliente.Nome}, Acomodação: ${hospedagem.Acomodacao.NomeAcomadacao}`)
        })

        let indiceHospedagem = this.entrada.receberNumero('Selecione a hospedagem para encerrar pelo número:') - 1
        let hospedagemSelecionada = hospedagensAtivas[indiceHospedagem]

        let dataFim = this.entrada.receberData('Qual a data de encerramento da hospedagem?')

        hospedagemSelecionada.encerrarHospedagem(dataFim)

        console.log('Hospedagem encerrada com sucesso!')
    }
}