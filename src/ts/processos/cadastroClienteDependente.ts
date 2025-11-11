import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Cliente from "../modelos/cliente";
import CadastrarDocumentosCliente from "./cadastroDocumentosCliente";

export default class CadastroClienteDependente extends Processo {
    processar(): void {
        console.log('Iniciando o cadastro de um novo dependente...')
        
        try {
            let armazem = Armazem.InstanciaUnica
            
            let titulares = armazem.Clientes.filter(cliente => !cliente.Titular)
            if (titulares.length === 0) {
                console.log('❌ Erro: Não há clientes titulares cadastrados no sistema!')
                console.log('É necessário cadastrar pelo menos um titular antes de cadastrar dependentes.')
                return
            }
            
            console.log('Titulares disponíveis:')
            titulares.forEach((titular, index) => {
                let dependentesCount = titular.Dependentes.length
                console.log(`${index + 1} - ${titular.Nome} (${dependentesCount} dependente(s))`)
            })
            
            let indiceTitular = this.entrada.receberNumero('Selecione o titular pelo número:') - 1
            
            if (indiceTitular < 0 || indiceTitular >= titulares.length) {
                console.log('❌ Erro: Número de titular inválido!')
                return
            }
            
            let titularSelecionado = titulares[indiceTitular]
            
            let nome = this.entrada.receberNome('Qual o nome completo do dependente?')
            
            let nomeSocial = this.entrada.receberTexto('Qual o nome social do dependente? (deixe em branco se não houver)', false, 0, 50)
            if (nomeSocial === '') nomeSocial = nome;
            
            let dataNascimento = this.entrada.receberData('Qual a data de nascimento do dependente?', false, true)
            
            let dependenteExistente = titularSelecionado.Dependentes.find(dep => 
                dep.Nome.toLowerCase() === nome.toLowerCase()
            )
            
            if (dependenteExistente) {
                console.log('❌ Erro: Este titular já possui um dependente com este nome!')
                console.log('Por favor, use um nome diferente.')
                return
            }
            
            if (dataNascimento <= titularSelecionado.DataNascimento) {
                console.log('❌ Erro: Dependente deve ser mais novo que o titular!')
                console.log(`Data de nascimento do titular: ${titularSelecionado.DataNascimento.toLocaleDateString()}`)
                return
            }
            
            let dependente = new Cliente(nome, nomeSocial, dataNascimento)
            
            dependente.Endereco = titularSelecionado.Endereco
            console.log('📍 Endereço herdado do titular automaticamente.')
            
            this.processo = new CadastrarDocumentosCliente(dependente)
            this.processo.processar()
            
            if (dependente.Documentos.length === 0) {
                console.log('❌ Erro: É obrigatório cadastrar pelo menos um documento!')
                console.log('Cancelando o cadastro do dependente...')
                return
            }
            
            dependente.Titular = titularSelecionado
            titularSelecionado.Dependentes.push(dependente)
            armazem.Clientes.push(dependente)
            
            console.log('✅ Dependente cadastrado com sucesso!')
            console.log(`Nome: ${dependente.Nome}`)
            console.log(`Titular: ${titularSelecionado.Nome}`)
            console.log(`Data de nascimento: ${dependente.DataNascimento.toLocaleDateString()}`)
            console.log(`Documentos cadastrados: ${dependente.Documentos.length}`)
            console.log(`Total de dependentes do titular: ${titularSelecionado.Dependentes.length}`)
            
        } catch (error) {
            console.log('❌ Erro durante o cadastro do dependente:')
            console.log(error instanceof Error ? error.message : 'Erro desconhecido')
            console.log('Cadastro cancelado.')
        }
    }
} 