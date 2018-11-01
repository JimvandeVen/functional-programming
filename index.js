const OBA = require('oba-api')
const fs = require('fs')
require('dotenv').config()

const client = new OBA({
  public: process.env.PUBLIC,
  secret: process.env.SECRET
})

let books = []
client.get('search', {
    q: 'H',
    sort: 'title',
    refine: true,
    branch: 'OBA Oosterdok'

  })
  .then(results =>
    JSON.parse(results).aquabrowser.results.result.forEach(function(book) {
      makeBookObject(book)
    })
  )
  // .then(function(){
  //   let places = []
  //   bookObject.map(function(books){
  //     places.push(books.place)
  //   })
  //   console.log('places', places)
  // })
  .then(function(){
    let places = totalPlaces(books)
    let cleanPlaces = placeCleaner(places)
    let uniquePlaces = places.filter(onlyUnique)
    // console.log('unique', uniquePlaces)

  })
  .catch(err => console.log(err))


function makeBookObject(book) {
  let publishers = (typeof book.publication === "undefined" || typeof book.publication.publishers == undefined ) ? "UNKNOWN" : book.publication.publishers.publisher
  let places= []
  if (publishers.length && publishers !== "UNKNOWN"){
    publishers.map(items =>{
      // console.log(items.place)
      let multiplePlaces = []
      multiplePlaces.push(items.place)
      multiplePlaces.forEach(place =>{
        places.push(place)
        // console.log('place', place)
      })
      // places.push(multiplePlaces)
      // console.log(multiplePlaces)

    })
    // console.log('wel array',publishers)
  } else {
      places.push(publishers.place)
  }
  bookObject = {
    place: places
  }
  books.push(bookObject)
}


function totalPlaces(books){
  let places = []
  books.forEach(function(book){
    if (book.place.length === 1 && book.place[0] != undefined){
    places.push(book.place[0])
    } else{
    book.place.forEach(item=>{
      if (item != undefined){
        places.push(item)
      }
    })
    }
  })
  console.log(places)
  return places
}

function placeCleaner(places){
  let cleanPlaces = []

  // cleanPlaces.push(places.forEach(function(place){
  //   console.log("place", place)
  // }))
  // console.log(cleanPlaces)
  // console.log(places)
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
