export default class BikeService{
  static showBike(location) {
    return fetch(`https://bikeindex.org:443/api/v3/search?page=1&per_page=250&location=${location}&distance=10&stolenness=proximity`)   
      .then(function(response){
        if(!response.ok){
          throw Error(response.statusText);
        }
        return response.json();
      })
      .catch(function(error){
        return error;
      });
  }
  // static async showCity() {
  //   try{
  //     const response = await fetch(`https://bikeindex.org/api/v3/search?page=1&per_page=100&stolenness=stolen`);
  //     if(!response.ok){
  //       throw Error(response.statusText);
  //     }
  //     return response.json();
  //   }
  //   catch(error){
  //     return error.message;

  //   }
  // }  
  static  showCity() {
    return Promise.all([
      fetch('https://bikeindex.org/api/v3/search?page=1&per_page=100&stolenness=stolen'),
      fetch('https://bikeindex.org/api/v3/search?page=2&per_page=100&stolenness=stolen')
    ]).then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    })
    // .then(function (data) {
    //   // Log the data to the console
    //   // You would do something with both sets of data here
      
    //   console.log("inside then",data);
    //   return data;
    // })
    .catch(function (error) {
      // if there's an error, log it
      return error;
    });
  }
}