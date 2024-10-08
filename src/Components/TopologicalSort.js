import { toast, Bounce } from "react-toastify";

export function TopologicalSort(connections, isWeighted) {
  let inputError = false;
  console.log(connections[0]);
  const graph = {};
  const edges = connections.trim().split("\n");
  edges.forEach((temp) => {
    let edge = temp.trim();
    if (isWeighted === false && edge.split(" ").length === 3) {
      inputError = true;
    } else if (edge.split(" ").length === 2) {
      const [start, end] = edge.split(" ").map((node) => node.trim());
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
    } else if (edge.split(" ").length === 3) {
      const [start, end, wt] = edge.split(" ").map((node) => node.trim());
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
      className: "toast-message",
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
    const visited = new Set();
    const onPath = new Set();
    const topologicalOrder = [];
    let cycleDetected = false;

    function dfs(node) {
      // If a cycle is detected, no need to continue
      if (cycleDetected) return; 
      if (onPath.has(node)) {
        cycleDetected = true; // Cycle detected
        return;
      }
      if (visited.has(node)) return;

      onPath.add(node);
      if (graph[node]) {
        graph[node].forEach((neighbor) => {
          dfs(neighbor);
        });
      }
      onPath.delete(node);
      visited.add(node);
      topologicalOrder.push(node);
    }

    // Iterate over all nodes to handle disconnected graphs and perform DFS
    Object.keys(graph).forEach((node) => {
      if (!visited.has(node)) {
        dfs(node);
      }
    });
    topologicalOrder.reverse();

    const newNodes = topologicalOrder.map((node) => ({
      id: node,
      label: node,
      fill: "#a6a5a2",
    }));

    const newEdges = topologicalOrder.slice(1).map((node, index) => ({
      source: topologicalOrder[index],
      target: node,
      id: `${topologicalOrder[index]}-${node}`,
    }));

    if (cycleDetected) {
      toast.error("Cycle Detected!", {
        className: "toast-message",
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
}
