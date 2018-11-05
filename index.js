const OBA = require('oba-api')
const fs = require('fs')
const d3 = require("d3")
require('dotenv').config()

const client = new OBA({
  public: process.env.PUBLIC,
  secret: process.env.SECRET
})

let books = []
client.getAll('search', {
    q: 'h',
    sort: 'title',
    refine: true,
    branch: 'OBA Oosterdok'

  })
  .then(results =>
    results.forEach(function(book) {
      makeBookObject(book)
    })
  )
  .then(function(){
    let places = totalPlaces(books)
    let cleanPlaces = placeCleaner(places)
    // console.log(cleanPlaces)

    let placeFrequency = frequencyCalculator(cleanPlaces)
    // fs.writeFile('myjsonfile.json', JSON.stringify(placeFrequency), 'utf8', function(){})
    // console.log(placeFrequency)

  })
  .catch(err => {
    if (err.response) {
      console.log(err.response.status, err.response.statusText)
    } else {
      console.log(err)
    }
  })

function makeBookObject(book) {
  let publishers = (typeof book == undefined || book.publication == undefined || typeof book.publication.publishers == undefined || typeof book.publication[0].publishers.publisher == undefined ) ? "UNKNOWN" : book.publication[0].publishers[0].publisher
  // console.log(publishers)
  let places= []
  if (publishers !== "UNKNOWN"){
    let multiplePlaces = []
    publishers.map(items =>{
      multiplePlaces.push(items.$.place)
      // console.log(items.$.place)
      multiplePlaces.forEach(multiplePlace =>{
        places.push(multiplePlace)
      })
      // console.log(multiplePlaces)
    })
    // console.log('wel array',publishers)
  } else {
      places.push(publishers)
  }
  bookObject = {
    place: places
  }
  // console.log("places", places)
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
  // console.log(places)
  return places
}

function placeCleaner(places){
  let cleanPlaces = []
  places.forEach(place =>{
    if (place.endsWith(" [etc.]") && place != undefined){
      cleanPlaces.push(place.slice(0,-7))

    } else if (place.startsWith("[") && place.endsWith("]") && place != undefined){
      cleanPlaces.push(place.slice(1, -1))

    } else if(place.startsWith("[") && place != undefined){
      cleanPlaces.push(place.slice(1))
    } else if(place != undefined){
      cleanPlaces.push(place)
    }
  })
  // console.log(cleanPlaces)

  return cleanPlaces
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function frequencyCalculator(cleanPlaces){
    // console.log(cleanPlaces)
    let count = {}
    cleanPlaces.forEach(cleanPlace=>{
      // console.log(cleanPlace)
      count[cleanPlace] = (count[cleanPlace]||0) + 1

  })
  let cityCounts = []
  Object.entries(count).forEach(([key, value])=>{
    cityCounts.push({name: key, value: value})
  })

  console.log(cityCounts)
  // return counts

  // console.log("cleenPlaces", cleanPlaces)
  // console.log("uniquePlaces", uniquePlaces)
}
