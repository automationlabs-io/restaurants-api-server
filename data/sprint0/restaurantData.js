let restaurants = [];

let restaurantIds = restaurants.map(r => r.id);
let nextNewRestaurantId = restaurantIds.length ? Math.max(...restaurantIds)+1 : 1;
    
module.exports = {
    nextNewRestaurantId: nextNewRestaurantId,
    restaurants: restaurants
}