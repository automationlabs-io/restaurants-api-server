const sprint = require('../../setup/sprintInfo').sprint;
const data = require(`../../data/${sprint}/restaurantData`);

class RestaurantController {

  constructor(app) {
    this.nextNewRestaurantId = data.nextNewRestaurantId;
    this.sfRestaurants = data.restaurants;
    console.log(`Number of Restaurants = ${this.sfRestaurants.length}`);
    console.log(`The next (new) restaurant Id will be ${this.nextNewRestaurantId}`);
    this._bindRoutes(app);
  }

  _bindRoutes(app) {
    this.createRestaurant(app);
    this.updateRestaurant(app);
    this.deleteRestaurant(app);
    this.searchRestaurants(app);
    this.getRestaurant(app);
    this.getAllRestaurants(app);
  }

  createRestaurant(app) {
    app.post("/restaurants", (req, res, next) => {
      let newRestaurant = req.body;
      console.log("req has new restaurant info: " + JSON.stringify(newRestaurant))
      if (!this.doesRestaurantExist(newRestaurant.id)) {
        newRestaurant.id = this.nextNewRestaurantId;
        this.nextNewRestaurantId++;

        this.sfRestaurants.push(newRestaurant);

        res.status(200)
        res.json(newRestaurant);
        console.log("Added new restaurant with id: " + newRestaurant.id);

      } else {
        res.status(400)
        res.json({ errorMessage: "Restaurant with id: " + newRestaurant.id + " already exists" });
      }

      console.log("Total # of restaurants:  ", this.sfRestaurants.length)
    });
  }

  updateRestaurant(app) {
    app.put("/restaurants/:id", (req, res, next) => {
      let restaurantId = req.params.id;
      restaurantId = parseInt(restaurantId);
      let restaurantToUpdate = req.body;
      if (this.doesRestaurantExist(restaurantId)) {

        let index = this.findIndex(restaurantId);
        this.sfRestaurants[index].name = restaurantToUpdate.name;
        this.sfRestaurants[index].rating = restaurantToUpdate.rating;
        let updatedRestaurant = this.sfRestaurants[index];
        res.json(updatedRestaurant);
        res.status(200)
      } else {
        res.status(404)
        res.json({ errorMessage: "Restaurant not found" });
      }

      console.log("Total # of restaurants:  ", this.sfRestaurants.length)
    });
  }

  deleteRestaurant(app) {
    app.delete("/restaurants/:id", (req, res, next) => {
      let restaurantId = req.params.id;
      restaurantId = parseInt(restaurantId);

      if (this.doesRestaurantExist(restaurantId)) {
        let index = this.findIndex(restaurantId);
        let restaurantToDelete = this.sfRestaurants[index];
        this.removeRestaurant(restaurantId);
        res.json(restaurantToDelete);
        res.status(200);
      } else {
        res.status(404);
        res.json({ errorMessage: "Restaurant not found" });

      }

      console.log("Total # of restaurants:  ", this.sfRestaurants.length)
    });
  }

  searchRestaurants(app) {
    app.get("/restaurants/search/:searchTerm", (req, res, next) => {
      let searchTerm = req.params.searchTerm;

      let filteredResults = [];
      filteredResults = this.restaurantSearch(searchTerm)
      res.json(filteredResults);
    });
  }

  getRestaurant(app) {
    app.get("/restaurants/:id", (req, res, next) => {
      let restaurantId = req.params.id;
      restaurantId = parseInt(restaurantId);
      //console.log(restaurantId);

      if (!this.doesRestaurantExist(restaurantId)) {
        res.status(404);
        res.json({ errorMessage: "Restaurant not found" });
        return;
      }

      let index = this.findIndex(restaurantId);
      console.log("returned restaurant :", this.sfRestaurants[index])
      res.status(200)
      res.json(this.sfRestaurants[index]);

      console.log("Total # of restaurants:  ", this.sfRestaurants.length)

    });
  }


  getAllRestaurants(app) {
    app.get("/restaurants", (req, res, next) => {
      
      res.status(200);
      res.json(this.sfRestaurants);

      console.log("Total # of restaurants:  ", this.sfRestaurants.length);
    });
  }
  //checks restaurant id in this.sfRestaurants.
  //if not found returns -1 as index
  findIndex(restaurantId) {
    let index = this.sfRestaurants.findIndex(r => {
      return r.id === restaurantId
    });
    return index;
  }

  //checks for restaurant name  in this.sfRestaurants.
  //if not found returns -1 as index
  findIndexByName(restaurantName) {
    let index = this.sfRestaurants.findIndex(r => {
      return r.name === restaurantName
    });
    return index;
  }

  //does restaurant exist in this.sfRestaurants?
  //returns true, if yes
  //otherwise, returns no
  doesRestaurantExist(restaurantId) {
    if (!restaurantId) {
      return false;
    }

    let index = this.findIndex(restaurantId);
    return index !== -1;
  }

  //removes from this.sfRestaurants array
  removeRestaurant(restaurantId) {

    //you can only remove it if it exists!
    if (this.doesRestaurantExist) {
      let index = this.findIndex(restaurantId);
      this.sfRestaurants.splice(index, 1);
    }

  }

  restaurantSearch(searchTerm) {
    //returns list of restaurants that match the searchTerm
    let regex = new RegExp(searchTerm, "i");
    let results = this.sfRestaurants.filter(function (restaurant) {
      return regex.test(restaurant.name);
    });

    return results;
  }
}

module.exports = RestaurantController
