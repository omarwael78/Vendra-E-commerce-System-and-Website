export default class Cart {
  constructor(userId) {
    this.userId = userId;
    this.items = [];
    this.createdAt = Date.now();
  }
}
