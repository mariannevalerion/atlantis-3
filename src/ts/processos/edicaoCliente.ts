import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Cliente from "../modelos/cliente";
import ImpressaorCliente from "../impressores/impressorCliente";
import Impressor from "../interfaces/impressor";

export default class EdicaoCliente extends Processo {
    private clientes: Cliente[]
    private impressor!: Impressor

    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }

    processar(): void {
        console.log('Iniciando a edição de cliente...')
        
        try {
            if (this.clientes.length === 0) {
                console.log('❌ Erro: Não há clientes cadastrados no sistema!')
                return
            }

            console.log('Clientes disponíveis para edição:')
            this.clientes.forEach((cliente, index) => {
                let tipo = cliente.Titular ? 'Dependente' : 'Titular'
                console.log(`${index + 1} - ${cliente.Nome} (${tipo})`)
            })

            let indiceCliente = this.entrada.receberNumero('Selecione o cliente para editar pelo número:') - 1
            
            if (indiceCliente < 0 || indiceCliente >= this.clientes.length) {
                console.log('❌ Erro: Número de cliente inválido!')
                return
            }
            
            let clienteSelecionado = this.clientes[indiceCliente]
            
            console.log('\n📋 Dados atuais do cliente:')
            this.impressor = new ImpressaorCliente(clienteSelecionado)
            console.log(this.impressor.imprimir())
            
            console.log('\n🔧 O que deseja editar?')
            console.log('1 - Nome')
            console.log('2 - Nome social')
            console.log('3 - Data de nascimento')
            console.log('4 - Endereço')
            console.log('0 - Cancelar edição')
            
            let opcaoEdicao = this.entrada.receberNumero('Selecione a opção:')
            
            switch (opcaoEdicao) {
                case 1:
                    this.editarNome(clienteSelecionado)
                    break
                case 2:
                    this.editarNomeSocial(clienteSelecionado)
                    break
                case 3:
                    this.editarDataNascimento(clienteSelecionado)
                    break
                case 4:
                    this.editarEndereco(clienteSelecionado)
                    break
                case 0:
                    console.log('Edição cancelada.')
                    return
                default:
                    console.log('❌ Opção inválida!')
                    return
            }
            
        } catch (error) {
            console.log('❌ Erro durante a edição do cliente:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
        }
    }

    private editarNome(cliente: Cliente): void {
        try {
            console.log(`\n📝 Nome atual: ${cliente.Nome}`)
            let novoNome = this.entrada.receberNome('Digite o novo nome completo:')
            
            let clienteExistente = this.clientes.find(c => 
                c !== cliente && c.Nome.toLowerCase() === novoNome.toLowerCase()
            )
            
            if (clienteExistente) {
                console.log('❌ Erro: Já existe outro cliente com este nome!')
                return
            }
            
            let nomeAntigo = cliente.Nome
            ;(cliente as any).nome = novoNome
            
            console.log('✅ Nome alterado com sucesso!')
            console.log(`Nome anterior: ${nomeAntigo}`)
            console.log(`Nome atual: ${novoNome}`)
            
        } catch (error) {
            console.log('❌ Erro ao editar nome:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
        }
    }

    private editarNomeSocial(cliente: Cliente): void {
        try {
            console.log(`\n📝 Nome social atual: ${cliente.NomeSocial}`)
            let novoNomeSocial = this.entrada.receberTexto('Digite o novo nome social (deixe em branco para usar o nome completo):', false, 0, 50)
            
            if (novoNomeSocial === '') {
                novoNomeSocial = cliente.Nome
            }
            
            let nomeSocialAntigo = cliente.NomeSocial
            ;(cliente as any).nomeSocial = novoNomeSocial
            
            console.log('✅ Nome social alterado com sucesso!')
            console.log(`Nome social anterior: ${nomeSocialAntigo}`)
            console.log(`Nome social atual: ${novoNomeSocial}`)
            
        } catch (error) {
            console.log('❌ Erro ao editar nome social:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
        }
    }

    private editarDataNascimento(cliente: Cliente): void {
        try {
            console.log(`\n📅 Data de nascimento atual: ${cliente.DataNascimento.toLocaleDateString()}`)
            
            if (cliente.Titular) {
                console.log(`⚠️  Este é um dependente. A nova data deve ser posterior à do titular.`)
                console.log(`Data de nascimento do titular: ${cliente.Titular.DataNascimento.toLocaleDateString()}`)
            }
            
            let novaData = this.entrada.receberData('Digite a nova data de nascimento:', false, true)
            
            if (cliente.Titular && novaData <= cliente.Titular.DataNascimento) {
                console.log('❌ Erro: Dependente deve ser mais novo que o titular!')
                return
            }
            
            if (!cliente.Titular && cliente.Dependentes.length > 0) {
                let dependenteMaisNovo = cliente.Dependentes.reduce((mais_novo, dep) => 
                    dep.DataNascimento < mais_novo.DataNascimento ? dep : mais_novo
                )
                
                if (novaData >= dependenteMaisNovo.DataNascimento) {
                    console.log('❌ Erro: Titular deve ser mais velho que todos os dependentes!')
                    console.log(`Dependente mais novo: ${dependenteMaisNovo.Nome} (${dependenteMaisNovo.DataNascimento.toLocaleDateString()})`)
                    return
                }
            }
            
            let dataAntiga = cliente.DataNascimento
            ;(cliente as any).dataNascimento = novaData
            
            console.log('✅ Data de nascimento alterada com sucesso!')
            console.log(`Data anterior: ${dataAntiga.toLocaleDateString()}`)
            console.log(`Data atual: ${novaData.toLocaleDateString()}`)
            
        } catch (error) {
            console.log('❌ Erro ao editar data de nascimento:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
        }
    }

    private editarEndereco(cliente: Cliente): void {
        try {
            console.log('\n🏠 Endereço atual:')
            console.log(`Rua: ${cliente.Endereco.Rua}`)
            console.log(`Bairro: ${cliente.Endereco.Bairro}`)
            console.log(`Cidade: ${cliente.Endereco.Cidade}`)
            console.log(`Estado: ${cliente.Endereco.Estado}`)
            console.log(`País: ${cliente.Endereco.Pais}`)
            console.log(`CEP: ${cliente.Endereco.CodigoPostal}`)
            
            if (!cliente.Titular && cliente.Dependentes.length > 0) {
                console.log(`⚠️  Este titular possui ${cliente.Dependentes.length} dependente(s).`)
                console.log('A alteração do endereço afetará todos os dependentes.')
                
                let confirmar = this.entrada.receberTexto('Deseja continuar? (s/n):', true, 1, 1)
                if (confirmar.toLowerCase() !== 's') {
                    console.log('Edição de endereço cancelada.')
                    return
                }
            }
            
            console.log('\n📝 Digite os novos dados do endereço:')
            
            let rua = this.entrada.receberTexto('Nova rua:', true, 5, 100)
            let bairro = this.entrada.receberTexto('Novo bairro:', true, 2, 50)
            let cidade = this.entrada.receberTexto('Nova cidade:', true, 2, 50)
            let estado = this.entrada.receberTexto('Novo estado:', true, 2, 30)
            let pais = this.entrada.receberTexto('Novo país:', true, 2, 30)
            let codigoPostal = this.entrada.receberCodigoPostal('Novo código postal:')
            
            ;(cliente.Endereco as any).rua = rua
            ;(cliente.Endereco as any).bairro = bairro
            ;(cliente.Endereco as any).cidade = cidade
            ;(cliente.Endereco as any).estado = estado
            ;(cliente.Endereco as any).pais = pais
            ;(cliente.Endereco as any).codigoPostal = codigoPostal
            
            console.log('✅ Endereço alterado com sucesso!')
            
            if (!cliente.Titular && cliente.Dependentes.length > 0) {
                cliente.Dependentes.forEach(dependente => {
                    dependente.Endereco = cliente.Endereco
                })
                console.log(`📍 Endereço atualizado para ${cliente.Dependentes.length} dependente(s).`)
            }
            
        } catch (error) {
            console.log('❌ Erro ao editar endereço:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
        }
    }
} 