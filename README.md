# functional-programming
## Introduction
In this project I am working together with the Openbare Bibliotheek Amsterdam(oba). I am using the oba [API](https://github.com/rijkvanzanten/node-oba-api) made by Rijk van Zanten. In the end I will be making an interactive datavisualization with the data provided by the API. I am meant to write the code in, as much as possible, functional programming.
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
  genre (
description 
  physical-description
summaries 
  summary
notes 
  note
target-audiences 
  target-audience
```
