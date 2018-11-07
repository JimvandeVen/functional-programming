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
    // let cleanObject = objectCleaner(books)
    // console.log(cleanObject)
    let places = totalPlaces(books)
    let placeFrequency = frequencyCalculator(places)
    console.log(books)
    // let years = totalYears(books)
    // let cleanYears = yearCleaner(years)
    // let sortedCityCounts = citySorter(placeFrequency)
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
  // console.log(book)
  let publishers = (typeof book == undefined || book.publication == undefined || typeof book.publication.publishers == undefined || typeof book.publication[0].publishers.publisher == undefined ) ? "Geen plaats van uitgave" : book.publication[0].publishers[0].publisher
  let publisherYears = (typeof book == undefined || book.publication == undefined || typeof book.publication.publishers == undefined || typeof book.publication[0].publishers.publisher == undefined ) ? "Geen jaar van uitgave" : book.publication[0].publishers[0].publisher
  // console.log(publisherYears)
  let years = []
  let places = []
  if (publishers !== "Geen plaats van uitgave" && publisherYears != "Geen jaar van uitgave"){
    publishers.map(items =>{
      if (items.$.place != undefined && items.$.place.endsWith(" [etc.]") && items.$.place != 'Geen plaats van uitgave'){
        places.push(items.$.place.slice(0,-7))

      } else if (items.$.place != undefined && items.$.place.endsWith(" [etc.].") && items.$.place != 'Geen plaats van uitgave'){
        places.push(items.$.place.slice(1, -8))

      } else if (items.$.place != undefined && items.$.place.startsWith("[") && items.$.place.endsWith("]") &&  items.$.place != 'Geen plaats van uitgave'){
        places.push(items.$.place.slice(1, -1))

      } else if(items.$.place != undefined && items.$.place.startsWith("[") &&  items.$.place != 'Geen plaats van uitgave'){
        places.push(items.$.place.slice(1))
      } else if(items.$.place != undefined && items.$.place != 'Geen plaats van uitgave'){
        places.push(items.$.place)
      }
      if (items.$.year != undefined && items.$.year.startsWith("[") && items.$.year.endsWith("]") &&  items.$.year != 'Geen jaar van uitgave'){
        years.push(items.$.year.slice(1, -1))
      }else if (items.$.year != undefined && items.$.year.includes("cm")) {
        years.push(items.$.year.slice(0,4))
      }else if (items.$.year != undefined && items.$.year.includes("-")) {
        years.push(items.$.year.slice(-4))
      }else if (items.$.year != undefined) {
        years.push(items.$.year.slice(0,4))
      }

    })
  } else {
      places.push(publishers)
      years.push(publisherYears)

  }
  bookObject = {
    place: places,
    year: years
  }

  if (bookObject.place != "Geen plaats van uitgave" && bookObject.year != "Geen jaar van uitgave" && bookObject.place.length == 1){
    books.push(bookObject)
  }
}

// function objectCleaner(books){
//   books.forEach((book, index)=>{
//     console.log(book.place)
//     // book.place = book.place.replace(/^\((.+)\)$/,"[$1]")
//   })
//
//
// }


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

  // console.log(cityCounts)
  return cityCounts

  // console.log("cleenPlaces", cleanPlaces)
  // console.log("uniquePlaces", uniquePlaces)
}


// function citySorter(placeFrequency){
//
//   keysSorted = Object.keys(placeFrequency).sort(function(a,b){return placeFrequency[a]-placeFrequency[b]})
//   console.log(keysSorted);
// }
