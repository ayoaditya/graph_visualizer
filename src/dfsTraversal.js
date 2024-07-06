import { toast, Bounce } from "react-toastify";
export function dfsTraversal(connections, startNode) {
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

  // Perform DFS traversal
  const visited_dfs = new Set();
  const dfsOrder = [];

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

  // Start DFS from a specified node (startNode)
  dfs(st);
  console.log(dfsOrder);

  const newNodes = dfsOrder.map((node) => ({
    id: node,
    label: node,
  }));

  const newEdges = dfsOrder.slice(1).map((node, index) => ({
    source: dfsOrder[index],
    target: node,
    id: `${dfsOrder[index]}-${node}`,
  }));

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
