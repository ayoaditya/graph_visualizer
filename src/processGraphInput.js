import { toast, Bounce } from "react-toastify";
import { Icon } from "reagraph";

export const processGraphInput = (inputValue) => {
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

  const newNodes = [];
  const newEdges = [];

  // Add nodes to nodes array
  const uniqueNodes = new Set(Object.keys(graph));
  Object.values(graph).forEach((neighbors) => {
    neighbors.forEach((node) => uniqueNodes.add(node));
  });

  uniqueNodes.forEach((node) => {
    newNodes.push({
      id: node,
      label: node,
      //   icon: "visualizergraph_visualizersrc\ronaldopngfilenode.PNG",
    });
  });

  // Add edges to edges array
  Object.keys(graph).forEach((start) => {
    graph[start].forEach((end) => {
      newEdges.push({
        source: start,
        target: end,
        id: `${start}-${end}`,
        //   label: `${start}-${end}`,
      });
    });
  });

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
};
