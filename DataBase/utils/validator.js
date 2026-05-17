export function requireFields(obj, fields) {
  fields.forEach((field) => {
    if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
      throw new Error(`${field} is required`);
    }
  });
}
