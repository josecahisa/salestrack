
export class BudgetRecord {
    constructor() {
        this.date = "";
        this.client = "";
        this.delivery_address = "";
        this.paymentTerm = "";
        this.shipping = "";
        this.status = "";
        this.discount = 0;
        this.numero = "";
        this.delivery_city = "";
    }
}

export const budgetStatusList = [
    { name: 'Borrador', id: 'B' },
    { name: 'Enviado', id: 'E' },
    { name: 'Aprobado', id: 'A' },
    { name: 'Finalizado', id: 'F' }
]
