class Card {
    constructor(cardNumber, accountNumber, expireDate, coin) {
      this.cardNumber = cardNumber;
      this.accountNumber = accountNumber;
      this.expireDate = expireDate;
      this.coin = coin;
    }
    
  }
class Debit extends Card {
    constructor(cardNumber, accountNumber, expireDate, coin, minimum) {
      super(cardNumber, accountNumber, expireDate, coin);
      this.minimum = minimum;
    }
  }
class Credit extends Card {
    constructor(cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment) {
      super(cardNumber, accountNumber, expireDate, coin);
      this.billingDate = billingDate;
      this.interestRate = interestRate;
      this.creditLine = creditLine;
      this.lastDayPayment = lastDayPayment;
    }
  }
export { Card, Credit, Debit };