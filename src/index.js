const svg = d3.select(DOM.svg(width, height)); 

d3.json('myjsonfile.json').then(function (data) {


  let tooltipText;
  let tooltip;

  svg.append("g")
    .selectAll("rect")
    .data(data)
    .enter().append("rect")
      .attr("x", x(0))
      .attr("rx", 4)
      .attr("y", d => y(d.place))
      .attr("width", d => x(d.bookCount.count) - x(0))
      .attr("height", y.bandwidth())
      .attr("fill", d => getColor(getAverage(d.bookCount.years)))
      .on('mouseover', function(data){
        d3.select(this).attr("opacity", .5)
        console.log(this)
        tooltipText
          .style("visibility", "visible")
          .text(`Years wherein books were published in ${data.place}: ${data.bookCount.years.sort(function(x, y){
              return d3.ascending(x, y);
          })}`)
          // .attr("transform", `translate("x", ${d3.select(this.x)})`)
          // .attr("transform", `translate("y", ${d3.select(this.y)})`)
          .attr("left", d3.select(this).attr("cx") + "px")
          .attr("top", d3.select(this).attr("cy") + "px")
      })
      .on('mouseout', function(d){
        tooltipText.style("visibility", "hidden")
        d3.select(this).attr("opacity", 1.0)
      });

  tooltipText = svg.append("text")
    .attr("transform", "translate(480,50)")
    .attr("transform", `translate(0,${margin.left})`)
    .style("max-width", "20px")
    .style("font", "10px sans-serif")
    .style("visibility", "hidden");

  svg.append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .style("font", "12px sans-serif")
    .selectAll("text")
    .data(data)
    .enter().append("text")
      .attr("x", d => x(d.bookCount.count) - 4)
      .attr("y", d => y(d.place) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d.bookCount.count);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);



getAverage = function(data) {
let total = data.reduce((a, c) => a + c);
return total /data.length
}

getColor = d3.scaleLinear()
  .domain([d3.min(data, d => d.bookCount.years), d3.mean(data, d => d.bookCount.years), d3.max(data, d => d.bookCount.years)])
  .range(["Green", "Gold", "Red"])

  format = d3.format(".3f")

  x = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.bookCount.count)])
    .range([margin.left, width - margin.right])

    y = d3.scaleBand()
    .domain(sortedData.map(d => d.place))
    .range([margin.top, height - margin.bottom])
    .padding(0.1)

    xAxis = g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())

    yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))

    height = data.length * 25 + margin.top + margin.bottom

     width = 900

     margin = ({top: 30, right: 0, bottom: 10, left: 120})
)}
