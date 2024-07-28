import { toast, Bounce } from "react-toastify";
// import { Icon } from "reagraph";

export const ProcessGraphInput = (inputValue, isWeighted) => {
  const graph = {};
  const edges = [];
  let inputError = false;
  const connections = inputValue;

  const edgesList = connections.trim().split("\n");
  edgesList.forEach((edge) => {
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

  console.log(graph);

  const newNodes = [];
  const newEdges = [];
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
    edges.forEach(([start, end, wt]) => {
      newNodes.push({
        id: start,
        label: start,
      });
      newNodes.push({
        id: end,
        label: end,
        fill: "#a6a5a2",
      });
      newEdges.push({
        source: start,
        target: end,
        id: `${start}-${end}`,
        label: isWeighted ? `${wt}` : "",
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }
};
