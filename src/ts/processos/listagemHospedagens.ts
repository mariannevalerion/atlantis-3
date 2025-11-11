import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Hospedagem from "../modelos/hospedagem";

export default class ListagemHospedagens extends Processo {
    private hospedagens: Hospedagem[]

    constructor() {
        super()
        this.hospedagens = Armazem.InstanciaUnica.Hospedagens
    }

    processar(): void {
        console.clear()
        console.log('Iniciando a listagem de hospedagens...')
        console.log(`-------------------------------------------------`)

        if (this.hospedagens.length === 0) {
            console.log('Não há hospedagens cadastradas.')
            return
        }

        this.hospedagens.forEach(hospedagem => {
            console.log(`Cliente: ${hospedagem.Cliente.Nome}`)
            console.log(`Acomodação: ${hospedagem.Acomodacao.NomeAcomadacao}`)
            console.log(`Data de início: ${hospedagem.DataInicio.toLocaleDateString()}`)
            console.log(`Status: ${hospedagem.Ativa ? 'Ativa' : 'Encerrada'}`)

            if (!hospedagem.Ativa && hospedagem.DataFim) {
                console.log(`Data de encerramento: ${hospedagem.DataFim.toLocaleDateString()}`)
            }

            console.log(`-------------------------------------------------`)
        })
    }
}