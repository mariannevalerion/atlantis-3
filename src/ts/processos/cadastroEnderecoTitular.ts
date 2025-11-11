import Processo from "../abstracoes/processo";
import Cliente from "../modelos/cliente";
import Endereco from "../modelos/endereco";

export default class CadastroEnderecoTitular extends Processo {
    private cliente: Cliente

    constructor(cliente: Cliente) {
        super()
        this.cliente = cliente
    }

    processar(): void {
        console.log('Coletando os dados de endereço...')

        try {
            let rua = this.entrada.receberTexto('Qual a rua?', true, 5, 100)
            
            let bairro = this.entrada.receberTexto('Qual o bairro?', true, 2, 50)
            
            let cidade = this.entrada.receberTexto('Qual a cidade?', true, 2, 50)
            
            if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(cidade)) {
                console.log('❌ Erro: Nome da cidade inválido!')
                return
            }
            
            let estado = this.entrada.receberTexto('Qual o estado?', true, 2, 30)
            
            if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(estado)) {
                console.log('❌ Erro: Nome do estado inválido!')
                return
            }
            
            let pais = this.entrada.receberTexto('Qual o país?', true, 2, 30)
            
            if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(pais)) {
                console.log('❌ Erro: Nome do país inválido!')
                return
            }
            
            let codigoPostal = this.entrada.receberCodigoPostal('Qual o código postal?')
            
            let endereco = new Endereco(rua, bairro, cidade, estado, pais, codigoPostal)
            this.cliente.Endereco = endereco
            
            console.log('✅ Endereço cadastrado com sucesso!')
            
        } catch (error) {
            console.log('❌ Erro durante o cadastro do endereço:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
            throw error
        }
    }
}