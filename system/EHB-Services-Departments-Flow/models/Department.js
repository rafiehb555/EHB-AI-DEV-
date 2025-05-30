/**
 * Department Model
 */

class Department {
  constructor(id, name, services = []) {
    this.id = id;
    this.name = name;
    this.services = services;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  
  addService(service) {
    if (!this.services.includes(service)) {
      this.services.push(service);
      this.updatedAt = new Date();
    }
    return this;
  }
  
  removeService(service) {
    this.services = (this.services || []).filter(s => s !== service);
    this.updatedAt = new Date();
    return this;
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      services: this.services,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = { Department };
