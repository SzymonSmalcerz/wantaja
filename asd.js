function Person(name, surname) {
  this.name = name;
  this.surname = surname;
}
// class Person {
//   constructor(name, surname) {
//     this.name = name;
//     this.surname = surname;
//   }
// }

class Szymon extends Person {
  constructor() {
    super('Szymon', 'Smalcerz')
  }
}
