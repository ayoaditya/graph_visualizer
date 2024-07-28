export function ShortestPath(inputValue, src, dest, isWeighted) {
  let srcdestError = false;

  if (!src || !dest) {
    srcdestError = true;
  }

  const graph = {};
  let inputError = false;
  let SHTDIST;
  const connections = inputValue;
  const edgesList = connections.trim().split("\n");
  const edges = [];

  // Parse the input to build the graph and edges list
  edgesList.forEach((temp) => {
    let edge = temp.trim();
    if (isWeighted === false && edge.split(" ").length === 3) {
      inputError = true;
      return { error: "Invalid Input!" };
    } else if (edge.split(" ").length === 3) {
      const [start, end, weight] = edge.split(" ").map((node) => node.trim());
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
    } else if (edge.split(" ").length === 2) {
      const [start, end] = edge.split(" ").map((node) => node.trim());
      if (!start || !end) {
        inputError = true;
      } else {
        if (!graph[start]) {
          graph[start] = [];
        }
        graph[start].push({ node: end, weight: 1 });
        edges.push([start, end, 1]);
        // Initialize end node in case it has no outgoing edges
        if (!graph[end]) {
          graph[end] = [];
        }
      }
    } else {
      inputError = true;
    }
  });

  if (!srcdestError && src !== dest) {
    let ch1 = false;
    let ch2 = false;

    edges.forEach(([start, end, wt]) => {
      if (start === src || end === src) {
        ch1 = true;
      }
      if (end === dest || start === dest) {
        ch2 = true;
      }
    });

    if (ch1 === false || ch2 === false) {
      srcdestError = true;
    }
  }

  if (srcdestError) {
    return { error: "Invalid Source or Destination!" };
  }

  if (inputError) {
    console.error("Input error: please check your input format.");
    return { error: "Invalid Input!" };
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
      SHTDIST = distances[destination];
      console.log(`Path: ${FINAL_ANS.join(" -> ")}`);
      return FINAL_ANS;
    };

    const source = src;
    const destination = dest;
    const FINAL_ANS = bellmanFord(graph, edges, source, destination);

    if (!FINAL_ANS) {
      return { error: "No path found from source to destination" };
    }
    const ConnectionShortestPath = [];
    for (let i = 0; i < FINAL_ANS.length - 1; i++) {
      ConnectionShortestPath[FINAL_ANS[i]] = FINAL_ANS[i + 1];
    }
    console.log(ConnectionShortestPath);

    const newNodes = [];
    const newEdges = [];

    // Add nodes to nodes array
    const uniqueNodes = new Set(Object.keys(graph));
    Object.values(graph).forEach((neighbors) => {
      neighbors.forEach((temp) => uniqueNodes.add(temp.node));
    });

    const firstNode = FINAL_ANS[0];
    const lastNode = FINAL_ANS[FINAL_ANS.length - 1];

    uniqueNodes.forEach((node) => {
      let label = node;
      let color = "#a6a5a2";
      if (
        FINAL_ANS.length === 1 ||
        (firstNode === lastNode && node === firstNode)
      ) {
        // Normal label for single element or same start and end node
        label = node;
      } else {
        if (node === firstNode) {
          label = `SOURCE: ${node}`;
        }
        if (node === lastNode) {
          label = `DESTINATION: ${node}`;
        }
      }
      if (FINAL_ANS.includes(node)) {
        color = "#ff5b03";
      }
      newNodes.push({
        id: node,
        label: label,
        fill: color,
      });
    });

    // Add edges to edges array
    edges.forEach(([start, end, wt]) => {
      newEdges.push({
        source: start,
        target: end,
        id: `${start}-${end}`,
        label: `${wt}`,
        size: ConnectionShortestPath[start] === end ? 3 : 1,
      });
    });
    return {
      nodes: newNodes,
      edges: newEdges,
      shortestDistance: SHTDIST,
    };
  }
}
