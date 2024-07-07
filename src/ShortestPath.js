import React from "react";

export function ShortestPath(inputValue, src, dest) {
  const graph = {};
  let inputError = false;
  const connections = inputValue;
  const edgesList = connections.trim().split("\n");
  const edges = [];

  // Parse the input to build the graph and edges list
  edgesList.forEach((edge) => {
    if (edge.split("->").length === 3) {
      const [start, end, weight] = edge.split("->").map((node) => node.trim());
      const weightNum = parseFloat(weight);
      if (!start || !end || isNaN(weightNum)) {
        inputError = true;
      } else {
        if (!graph[start]) {
          graph[start] = [];
        }
        graph[start].push({ node: end, weight: weightNum });
        edges.push([start, end, weightNum]);
        // Initialize end node in case it has no outgoing edges
        if (!graph[end]) {
          graph[end] = [];
        }
      }
    } else {
      inputError = true;
    }
  });
  console.log(graph);

  if (inputError) {
    console.error("Input error: please check your input format.");
  } else {
    const bellmanFord = (graph, edges, source, destination) => {
      const distances = {};
      const predecessors = {};

      // Initialize distances and predecessors
      for (const node in graph) {
        distances[node] = Infinity;
        predecessors[node] = null;
      }
      distances[source] = 0;

      // Relax edges repeatedly
      const nodes = Object.keys(graph);
      for (let i = 0; i < nodes.length - 1; i++) {
        edges.forEach(([start, end, weight]) => {
          if (distances[start] + weight < distances[end]) {
            distances[end] = distances[start] + weight;
            predecessors[end] = start;
          }
        });
      }

      // Check for negative-weight cycles
      edges.forEach(([start, end, weight]) => {
        if (distances[start] + weight < distances[end]) {
          console.error("Graph contains a negative-weight cycle");
          return null;
        }
      });

      // Build the shortest path
      const FINAL_ANS = [];
      let currentNode = destination;
      while (currentNode !== null) {
        FINAL_ANS.unshift(currentNode);
        currentNode = predecessors[currentNode];
      }

      // Check if a path was found
      if (distances[destination] === Infinity) {
        console.error("No path found from source to destination");
        return null;
      }

      console.log(`Shortest distance: ${distances[destination]}`);
      console.log(`Path: ${FINAL_ANS.join(" -> ")}`);
      return FINAL_ANS;
    };

    // Example usage:
    const source = src;
    const destination = dest;
    const FINAL_ANS = bellmanFord(graph, edges, source, destination);
    console.log(source);
    console.log(destination);
    console.log(FINAL_ANS);
    let shtdst = "";
    return { nodes: [], edges: [], shortestDistance: shtdst };
  }
}
