class Expense{
    constructor (cardid, userid, mount, category, business, date, type, installments){
        this.cardid = cardid;
        this.userid = userid;
        this.mount = mount;
        this.category = category;
        this.business = business;
        this.date = date;
        this.type = type;
        this.installments = installments;
    }
}

export {Expense};