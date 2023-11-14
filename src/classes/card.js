class Card {
    constructor(cardNumber, accountNumber, expireDate, coin) {
      this.cardNumber = cardNumber;
      this.accountNumber = accountNumber;
      this.expireDate = expireDate;
      this.coin = coin;
    }
    
  }
class Debit extends Card {
    constructor(cardNumber, accountNumber, expireDate, coin, cash) {
      super(cardNumber, accountNumber, expireDate, coin);
      this.cash = cash;
    }
  }
class Credit extends Card {
    constructor(cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment, creditCash, insurance) {
      super(cardNumber, accountNumber, expireDate, coin);
      this.billingDate = billingDate;
      this.interestRate = interestRate;
      this.creditLine = creditLine;
      this.lastDayPayment = lastDayPayment;
      this.creditCash = creditCash;
      this.insurance = insurance;
    }
  }
export { Card, Credit, Debit };