import Menu from "../interfaces/menu";

export default class MenuTipoDocumento implements Menu {
    mostrar(): void {
        console.clear()
        console.log(`****************************`)
        console.log(`| 📄 CADASTRO DE DOCUMENTOS`)
        console.log(`****************************`)
        console.log(`| Qual tipo de documento deseja cadastrar?`)
        console.log(`----------------------`)
        console.log(`| 1 - CPF (Cadastro de Pessoas Física)`)
        console.log(`| 2 - RG (Registro Geral)`)
        console.log(`| 3 - Passaporte`)
        console.log(`----------------------`)
        console.log(`| 0 - Finalizar cadastro de documentos`)
        console.log(`****************************`)
        console.log(`| ⚠️  Obrigatório: pelo menos 1 documento`)
        console.log(`----------------------`)
    }
}