import React, { useEffect, useRef } from 'react';
import { select, pie, arc } from 'd3';

function BranchPieChart({ data, minCPI, maxCPI }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = select(svgRef.current);

    // if(minCPI === maxCPI)
    //   svg.selectAll('*').remove()

    // Calculate the count of students in each branch
    const branchCounts = {};
    data.forEach((d) => {
      if (parseFloat(d.cpi.toString().slice(0, -3)) <= maxCPI && parseFloat(d.cpi.toString().slice(0, -3)) >= minCPI) {
        if (branchCounts[d.branch]) {
          branchCounts[d.branch]++;
        } else {
          branchCounts[d.branch] = 1;
        }
      }
    });

    if(branchCounts)
      svg.selectAll('*').remove()

    // Convert the branch count object to an array of objects
    const branchData = Object.keys(branchCounts).map((branch) => ({
      branch,
      count: branchCounts[branch],
    }));

    // Define the chart dimensions and center
    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create a pie layout function based on the branch count
    const pieLayout = pie()
      .sort(null) // Disable sorting
      .value((d) => d.count); // Use the "count" property for the pie chart

    // Define the arc generator
    const arcGenerator = arc()
      .innerRadius(0)
      .outerRadius(Math.min(centerX, centerY) - 10);

    // Create the data for the pie chart
    const pieData = pieLayout(branchData);

    // Append a group element to the SVG to contain the chart
    const chart = svg.append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    // Create and style the pie slices
    chart.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d, i) => {
        // Set different colors for each branch
        const colors = ['#f55d5d', '#ffae42', '#4caf50', '#2196f3', '#9c27b0', '#ffc107', '#03a9f4', '#ff5722', '#607d8b', '#00bcd4'];
        return colors[i % colors.length];
      })
      .append('title') // Add a title element for the tooltip
      .text((d) => `${d.data.branch} (${d.data.count} students)`); // Tooltip text

  }, [data, minCPI, maxCPI]);

  return (
    <svg ref={svgRef} width={400} height={400}></svg>
  );
}

export default BranchPieChart;
