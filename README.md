# Functional-Programming
## Introduction
In this project I am working together with the Openbare Bibliotheek Amsterdam(OBA). I am using the oba [API](https://github.com/rijkvanzanten/node-oba-api) made by Rijk van Zanten. In the end I will be making an interactive data visualization with the data provided by the API. I am meant to write the code in, as much as possible, functional programming.

## Table of content

* [Visualisation](#visualisation)
* [Exploring the API](#exploring-the-api)
* [Research question](#research-question)
* [Early drawings of the visualisation](#early-drawings-of-the-visualisation)
* [Process](#process)
* [Still to do](#still-to-do)

## Visualisation
[Observable](https://beta.observablehq.com/@jimvandeven/d3-horizontal-bar-chart)

## Exploring the API
First I was looking at the API an what data is provided with several different queries. This was quite alot of data, to be honest. Too much to compress into a data visualisation. So I had to narrow the search. I started looking at the different results that are returned for each book. Here are some examples:  
```
id
detail-page
coverimages
  coverimage
titles 
  title 
  short-title 
  other-title
authors 
  main-author
  author 
formats 
  format
identifiers
  isbn-id
  ppn-id
publication 
  year
  publishers
    publisher
    place
    edition 
languages
  language
subjects
  topical-subject 
  genres 
  genre 
description 
  physical-description
summaries 
  summary
notes 
  note
target-audiences 
  target-audience
```

After seeing all the different results I started thinking what might be interesting for me to research.

## Research question
What seemed interesting to me was place where books were published i.e. the place the books were from. Also because this would make for an interesting visualization, making a map light up in the place where the books are more frequently published. I decided this would be better to plot with a single holding(OBA location) in mind. My question will thus be:
### Where were the books currently in the OBA Oosterdok holding published?
With this question in mind I wrote a couple of sub questions:
- [x] How will I get only the publisher information? 
- [x] How will I handle books without any or with multiple places?
- [x] How will I clean up the values of the places if they are impure?
- [x] How will I calculate and store the times a book has been published in a certain city?
- [x] How will I scale this prototype to work with every book in an OBA holding?
- [x] How will the visualisation actually look?
- [x] What extra knowledge can be obtained from this data?
- [x] What will the interactive part be in this visualisation?

## Early drawings of the visualisation
In the drawing below you can see what my early concept is of my data visualisation. I have to first learn about d3 before I make too many assumptions in the design. Even so, this is roughly my vision in the design. I am still debating about foreign books.
![Early Drawing](/images/early_drawing.jpg)

After playing around with d3 for a while I found that plotting my data on a map was a bit too difficult to achieve in one week of learning d3. So I toned my visualisation down, but added a third variable. Now I will plot the number of publications per city, show the average publication year of that city and show all the different publication years in a list.
![Early Drawing 2](/images/shets2.jpg)

## Process

### How will I get only the publisher information? How will I handle books without any or with multiple places? How will I clean up the values of the places if they are impure?
This piece of code allows me to make contact with the OBA API. Then In the results provided by my query I call a function that gives the books without publisher information a default value. Then I check if the book has multiple different places where it was published. If so `push()` each one into `let places= []` of not so just `push()` the one place. Then I create an `Object` where I put all the places. I do this in a similar way with years.  

The next hurdle was how to clean up the dirty data. This was quiete the job.. I had to make a failsave for each of the different typos and irregularities included in the data. I tried to do this with regular expressions, but it was to hard to wrap my head around at the moment. So I made a lot of if statements that check for faulty data before pushing the places and years in their respective arrays.

```js
function makeBookObject(book) {
  let publishers = (typeof book == undefined || book.publication == undefined || typeof book.publication.publishers == undefined || typeof book.publication[0].publishers.publisher == undefined ) ? "Geen plaats van uitgave" : book.publication[0].publishers[0].publisher
  let publisherYears = (typeof book == undefined || book.publication == undefined || typeof book.publication.publishers == undefined || typeof book.publication[0].publishers.publisher == undefined ) ? "Geen jaar van uitgave" : book.publication[0].publishers[0].publisher
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
    year: Number(years)
  }
  if (bookObject.place != "Geen plaats van uitgave" && bookObject.year != "Geen jaar van uitgave" && bookObject.place.length == 1){
    books.push(bookObject)
  }
}
```

### How will I calculate and store the times a book has been published in a certain city?

After the above piece of code I wanted to make an `object` that is formatted for use in d3. The `object` I produce with the code below will look like this:
``` js
Object = {
  [ 
    {
      city : "City Name",
      bookCount: {
        count: 10,
        years: [
          1990,
          2001
        ]
      }
    },
    {
      city : "City Name",
      bookCount: {
        count: 10,
        years: [
          1990,
          2001
        ]
      }
    }
  ]
}``` 
```js
function frequencyCalculator(books){
  let count = {}
  books.forEach(book=>{
    count[book.place] = {
      count: ((count[book.place] && count[book.place].count)||0) + 1,
      years: ((count[book.place] && count[book.place].years.concat(book.year))||[book.year])
    }
  })
  let cityCounts = []
  Object.entries(count).forEach(([key, value])=>{
     cityCounts.push({place: key, bookCount: value})
   })

  return cityCounts
}
```

## Still to do
