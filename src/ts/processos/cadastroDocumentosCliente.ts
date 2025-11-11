import Processo from "../abstracoes/processo";
import MenuTipoDocumento from "../menus/menuTipoDocumento";
import Cliente from "../modelos/cliente";
import CadastroCpf from "./cadastroCpf";
import CadastroPassaporte from "./cadastroPassaporte";
import CadastroRg from "./cadastroRg";

export default class CadastroDocumentosCliente extends Processo {
    private cliente: Cliente
    constructor(cliente: Cliente) {
        super()
        this.cliente = cliente
        this.menu = new MenuTipoDocumento()
        this.execucao = true
    }

    processar(): void {
        console.log('Iniciando o cadastro de documentos...')
        console.log('⚠️  É obrigatório cadastrar pelo menos um documento!')
        
        while (this.execucao) {
            try {
                this.menu.mostrar()
                
                if (this.cliente.Documentos.length > 0) {
                    console.log('\n📋 Documentos já cadastrados:')
                    this.cliente.Documentos.forEach((doc, index) => {
                        console.log(`${index + 1}. ${doc.Tipo} - ${doc.Numero}`)
                    })
                    console.log('')
                }
                
                this.opcao = this.entrada.receberNumero('Qual opção desejada?')
                
                switch (this.opcao) {
                    case 1:
                        this.processo = new CadastroCpf(this.cliente)
                        this.processo.processar()
                        break
                    case 2:
                        this.processo = new CadastroRg(this.cliente)
                        this.processo.processar()
                        break
                    case 3:
                        this.processo = new CadastroPassaporte(this.cliente)
                        this.processo.processar()
                        break
                    case 0:
                        if (this.cliente.Documentos.length === 0) {
                            console.log('❌ Erro: É obrigatório cadastrar pelo menos um documento!')
                            console.log('Por favor, cadastre um documento antes de finalizar.')
                            break
                        }
                        this.execucao = false
                        console.log('✅ Cadastro de documentos finalizado!')
                        console.log(`Total de documentos cadastrados: ${this.cliente.Documentos.length}`)
                        break
                    default:
                        console.log('❌ Opção não entendida! Por favor, selecione uma opção válida.')
                }
                
            } catch (error) {
                console.log('❌ Erro durante o cadastro de documentos:')
                console.log(error instanceof Error ? error.message : 'Erro desconhecido')
                console.log('Tente novamente ou digite 0 para sair.')
            }
        }
    }
}