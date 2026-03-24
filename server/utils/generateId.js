const { v4: uuidv4 } = require('uuid');

const generateId = (prefix) => {
  return `${prefix}_${uuidv4()}`;
};

module.exports = generateId;
