//  Sigma.simpleCounter module

//  Simple counter
module.exports = {
  i: 0,
  get value() {
    ++this.i;
    return this.i;
  }
};