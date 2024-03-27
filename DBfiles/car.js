class Car {
  constructor(
    CarID,
    City,
    Type,
    Capacity,
    Brand,
    Model,
    Options,
    Rented,
    dateRented
  ) {
    this.CarID = CarID;
    this.City = City;
    this.Type = Type;
    this.Capacity = Capacity;
    this.Brand = Brand;
    this.Model = Model;
    this.Options = Options;
    this.Rented = Rented;
    this.dateRented = dateRented;
  }
}
module.exports = Car;
