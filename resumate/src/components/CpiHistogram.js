import React, { useEffect, useRef } from 'react';
import { select, scaleLinear, max, histogram, axisBottom, axisLeft } from 'd3';

function CpiHistogram({ data, dept }) {
  const svgRef = useRef();
  
  const cpiValues = data.filter((d) => {
    if(dept === '')
      return d
    else if(d.branch.toLocaleLowerCase() === dept.toLocaleLowerCase())
      return d
  }).map((d) => parseFloat(d.cpi.toString().slice(0, -3)));

  useEffect(() => {
    const svg = select(svgRef.current);

    // Define the chart dimensions and margins
    const width = 400;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Calculate the inner dimensions of the chart (excluding margins)
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Extract the "cpi" values from the data
    // const cpiValues = data.filter((d)=> {
    //   if(dept === '')
    //     return d
    //   else if(d.branch.toLocaleLowerCase() === dept.toLocaleLowerCase())
    //     return d
    // }).map((d) => d.cpi);
    // console.log(cpiValues)

    // Create a linear scale for the x-axis
    const xScale = scaleLinear()
      .domain([0, max(cpiValues)])
      .nice()
      .range([0, innerWidth]);

    // Create a histogram function
    const histogramGenerator = histogram()
      .domain(xScale.domain())
      .thresholds(xScale.ticks(20)) // Adjust the number of bins as needed
      .value((d) => d);

    const bins = histogramGenerator(cpiValues);

    // Create a linear scale for the y-axis based on the number of data points in each bin
    const yScale = scaleLinear()
      .domain([0, max(bins, (d) => d.length)])
      .nice()
      .range([innerHeight, 0]);

    // Create the x-axis
    const xAxis = axisBottom(xScale).ticks(10);

    // Create the y-axis
    const yAxis = axisLeft(yScale).ticks(10);

    // Append a group element to the SVG to contain the chart
    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create and style the bars
    chart.selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.x0))
      .attr('y', (d) => yScale(d.length))
      .attr('width', (d) => xScale(d.x1) - xScale(d.x0) - 1)
      .attr('height', (d) => innerHeight - yScale(d.length))
      .style('fill', 'steelblue');

    // Append x-axis
    chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

    // Append y-axis
    chart.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    return () => svg.selectAll('*').remove()

  }, [data, cpiValues]);

  return (
    <svg ref={svgRef} width={600} height={400}></svg>
  );
}

export default CpiHistogram;
