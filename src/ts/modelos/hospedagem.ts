import Acomodacao from "./acomodacao";
import Cliente from "./cliente";

export default class Hospedagem {
    private cliente: Cliente
    private acomodacao: Acomodacao
    private dataInicio: Date
    private dataFim?: Date
    private ativa: boolean

    constructor(cliente: Cliente, acomodacao: Acomodacao, dataInicio: Date) {
        this.cliente = cliente
        this.acomodacao = acomodacao
        this.dataInicio = dataInicio
        this.ativa = true
    }

    public get Cliente() { return this.cliente }
    public get Acomodacao() { return this.acomodacao }
    public get DataInicio() { return this.dataInicio }
    public get DataFim() { return this.dataFim }
    public get Ativa() { return this.ativa }

    public encerrarHospedagem(dataFim: Date): void {
        this.dataFim = dataFim
        this.ativa = false
    }
}