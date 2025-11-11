import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Cliente from "../modelos/cliente";
import CadastrarDocumentosCliente from "./cadastroDocumentosCliente";
import CadastroEnderecoTitular from "./cadastroEnderecoTitular";

export default class CadastroClienteTitular extends Processo {
    processar(): void {
        console.log('Iniciando o cadastro de um novo cliente...')
        
        try {
            let nome = this.entrada.receberNome('Qual o nome completo do novo cliente?')
            
            let nomeSocial = this.entrada.receberTexto('Qual o nome social do novo cliente? (deixe em branco se não houver)', false, 0, 50)
            if (nomeSocial === '') nomeSocial = nome;
            
            let dataNascimento = this.entrada.receberData('Qual a data de nascimento?', false, true)
            
            let armazem = Armazem.InstanciaUnica
            let clienteExistente = armazem.Clientes.find(c => 
                c.Nome.toLowerCase() === nome.toLowerCase()
            )
            
            if (clienteExistente) {
                console.log('❌ Erro: Já existe um cliente cadastrado com este nome!')
                console.log('Por favor, use um nome diferente ou verifique se o cliente já está cadastrado.')
                return
            }
            
            let cliente = new Cliente(nome, nomeSocial, dataNascimento)

            this.processo = new CadastroEnderecoTitular(cliente)
            this.processo.processar()

            this.processo = new CadastrarDocumentosCliente(cliente)
            this.processo.processar()

            if (cliente.Documentos.length === 0) {
                console.log('❌ Erro: É obrigatório cadastrar pelo menos um documento!')
                console.log('Cancelando o cadastro do cliente...')
                return
            }

            armazem.Clientes.push(cliente)

            console.log('✅ Cliente cadastrado com sucesso!')
            console.log(`Nome: ${cliente.Nome}`)
            console.log(`Data de nascimento: ${cliente.DataNascimento.toLocaleDateString()}`)
            console.log(`Documentos cadastrados: ${cliente.Documentos.length}`)
            
        } catch (error) {
            console.log('❌ Erro durante o cadastro do cliente:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
            console.log('Cadastro cancelado.')
        }
    }
}