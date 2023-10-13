class Person {
    constructor(fname, lname, dni, age, email, phone) {
      this.fname = fname;
      this.lname = lname;
      this.dni = dni;
      this.age = age;
      this.email = email;
      this.phone = phone;
    }
    
  }
class User extends Person {
    constructor(fname, lname, dni, age, email, phone, username, password) {
      super(fname, lname, dni, age, email, phone);
      this.username = username;
      this.password = password;
    }
  }

export { Person, User };