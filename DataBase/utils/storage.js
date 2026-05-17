export const storage = {
  //get saved data in local storage
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  // Save full array
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Add single record
  add(key, item) {
    const data = this.get(key);
    data.push(item);
    this.set(key, data);
    return item;
  },

  // Update record by id
  update(key, id, newData) {
    const data = this.get(key);

    const index = data.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Item not found");

    data[index] = { ...data[index], ...newData };
    this.set(key, data);

    return data[index];
  },

  // Delete record
  delete(key, id) {
    const data = this.get(key).filter((i) => i.id !== id);
    this.set(key, data);
  },
  // Find by id
  find(key, id) {
    return this.get(key).find((i) => i.id === id);
  },
};
