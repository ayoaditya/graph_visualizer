import { toast, Bounce } from "react-toastify";
export function dfsTraversal(connections) {
  console.log("connections");
  console.log(connections);
  let inputError = false;
  const st = connections[0];
  const graph = {};
  const edges = connections.trim().split("\n");
  edges.forEach((edge) => {
    if (edge.split("->").length === 2) {
      const [start, end] = edge.split("->").map((node) => node.trim());
      if (!start || !end) {
        inputError = true;
      } else {
        if (!graph[start]) {
          graph[start] = [];
        }
        graph[start].push(end);
        // Initialize end node in case it has no outgoing edges
        if (!graph[end]) {
          graph[end] = [];
        }
      }
    } else {
      console.log("invalid");
      inputError = true;
    }
  });

  console.log(graph);

  const visited_dfs = new Set();
  const dfsOrder = [];

  // Assume DistinctNodes is a Set containing all distinct nodes
  const DistinctNodes = new Set(Object.keys(graph)); // Initialize with all keys in the graph

  function dfs(node) {
    if (visited_dfs.has(node)) return;
    visited_dfs.add(node);
    dfsOrder.push(node);
    if (graph[node]) {
      graph[node].forEach((neighbor) => {
        dfs(neighbor);
      });
    }
  }

  // Iterate over all distinct nodes and perform DFS for unvisited nodes
  DistinctNodes.forEach((node) => {
    if (!visited_dfs.has(node)) {
      if (dfsOrder.length > 0) {
        dfsOrder.push("SePaRaTiOn"); // Separate different connected components
      }
      dfs(node);
    }
  });

  console.log(dfsOrder);

  const newNodes = [];
  DistinctNodes.forEach((node) => {
    newNodes.push({
      id: node,
      label: node,
    });
  });

  const newEdges = [];
  for (let index = 1; index < dfsOrder.length; index++) {
    const source = dfsOrder[index - 1];
    const target = dfsOrder[index];

    if (source !== "SePaRaTiOn" && target !== "SePaRaTiOn") {
      newEdges.push({
        source,
        target,
        id: `${source}-${target}`,
      });
    }
  }

  if (inputError) {
    toast.error("Invalid input format!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    return { nodes: [], edges: [] };
  } else {
    return { nodes: newNodes, edges: newEdges };
  }
}
