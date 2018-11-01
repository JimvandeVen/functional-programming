# functional-programming
## Introduction
In this project I am working together with the Openbare Bibliotheek Amsterdam(OBA). I am using the oba [API](https://github.com/rijkvanzanten/node-oba-api) made by Rijk van Zanten. In the end I will be making an interactive datavisualization with the data provided by the API. I am meant to write the code in, as much as possible, functional programming.
## Exploring the API
First I was looking at the API an what data is provided with several different querys. This was quite alot of data, to be honest. Too much to compress into a datavisualisation. So I had to narrow the search. I started looking at the different results that are returned for each book. Here are some examples:  
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

After seeing all the different results I started thinking what might be interesting to me research.

## Research question
What seemed interesting to me was place where books were published i.e. the place the books were from. Also because this would make for an interesting visualization, making a map light up in the place where the books are more frequently published. I decided this would be better to plot with a single holding(OBA location) in mind. My question will thus be:
### Where were the books currently in the OBA Oosterdok holding published?
With this question in mind I wrote a couple of subquestions:
- [x] How will I get only the publisher information? 
```js
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
  .then(function(){
    let places = countPlaces(books)
    })
  .catch(err => console.log(err))
   function makeBookObject(book) {
  let publishers = (typeof book.publication === "undefined" || typeof book.publication.publishers == undefined ) ? "UNKNOWN" : book.publication.publishers.publisher
  console.log(publishers)
  }
```
- [x] How will I handle books without any or with multiple places?
- [ ] How will I clean up the values of the places if they are impure?
- [ ] How will I calculate and store the times a book has been published in a certain city?
- [ ] How will the visualisation actually look?
- [ ] What extra knowledge can be obtained from this data?
- [ ] What will the interactive part be in this visualisation?

