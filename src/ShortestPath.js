import React from "react";

export function ShortestPath(inputValue, src, dest) {
  const graph = {};
  let inputError = false;
  const connections = inputValue;

  const edgesList = connections.trim().split("\n");
  edgesList.forEach((edge) => {
    if (edge.split("->").length === 2) {
      const [start, end] = edge.split("->").map((node) => node.trim());
      if (!start || !end) {
        inputError = true;
      } else {
        if (!graph[start]) {
          graph[start] = [];
        }
        graph[start].push([end, 1]);
        // Initialize end node in case it has no outgoing edges
        if (!graph[end]) {
          graph[end] = [];
        }
      }
    } else {
      inputError = true;
    }
  });
  let shtdst = "";
  console.log(graph);
  return { nodes: [], edges: [], shortestDistance: shtdst };
}
