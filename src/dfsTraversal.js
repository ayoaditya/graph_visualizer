import { toast, Bounce } from "react-toastify";
export function dfsTraversal(connections, isWeighted) {
  console.log(connections);
  let inputError = false;
  const graph = {};
  const edges = connections.trim().split("\n");
  edges.forEach((edge) => {
    if (isWeighted === false && edge.split("->").length === 3) {
      inputError = true;
    } else if (edge.split("->").length === 2) {
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
    } else if (edge.split("->").length === 3) {
      const [start, end, wt] = edge.split("->").map((node) => node.trim());
      if (!start || !end || isNaN(wt)) {
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
      inputError = true;
    }
  });

  console.log(graph);
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
    const visited_dfs = new Set();
    const dfsOrder = [];

    // set of DistinctNodes
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
        fill: "#cfd1cd",
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
      } else if (source === "SePaRaTiOn" && target !== "SePaRaTiOn") {
        const previousNode = dfsOrder[index - 2];
        newEdges.push({
          source: previousNode,
          target: target,
          id: `${previousNode}-${target}`,
          size: 0,
        });
      }
    }

    return { nodes: newNodes, edges: newEdges };
  }
}
