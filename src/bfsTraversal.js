import { toast, Bounce } from "react-toastify";

export function bfsTraversal(connections) {
  let inputError = false;
  const st = connections[0];
  console.log(st);
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
      inputError = true;
    }
  });
  console.log(graph);
  // Perform BFS traversal
  const visited = new Set();
  const bfsOrder = [];

  // Assume DistinctNodes is a Set containing all distinct nodes
  const DistinctNodes = new Set(Object.keys(graph)); // Initialize with all keys in the graph

  const bfs = (startNode) => {
    const queue = [startNode];
    while (queue.length > 0) {
      const node = queue.shift();
      if (!visited.has(node)) {
        visited.add(node);
        bfsOrder.push(node);
        // Check if node has neighbors
        if (graph[node]) {
          graph[node].forEach((neighbor) => {
            if (!visited.has(neighbor)) {
              queue.push(neighbor);
            }
          });
        }
      }
    }
  };

  // Iterate over all distinct nodes and perform BFS for unvisited nodes
  DistinctNodes.forEach((node) => {
    if (!visited.has(node)) {
      if (bfsOrder.length > 0) {
        bfsOrder.push("SePaRaTiOn"); // Separate different connected components
      }
      bfs(node);
    }
  });

  console.log(bfsOrder);

  const newNodes = [];
  DistinctNodes.forEach((node) => {
    newNodes.push({
      id: node,
      label: node,
    });
  });

  const newEdges = [];

  for (let index = 1; index < bfsOrder.length; index++) {
    const source = bfsOrder[index - 1];
    const target = bfsOrder[index];

    if (source !== "SePaRaTiOn" && target !== "SePaRaTiOn") {
      newEdges.push({
        source,
        target,
        id: `${source}-${target}`,
      });
    } else if (source === "SePaRaTiOn" && target !== "SePaRaTiOn") {
      const previousNode = bfsOrder[index - 2];
      newEdges.push({
        source: previousNode,
        target: target,
        id: `${previousNode}-${target}`,
        size: 0,
      });
    }
  }

  console.log(newEdges);

  // const newEdges = [
  //   {
  //     fill: "#FF0000",
  //     source: "1",
  //     target: "2",
  //     id: "1-2",
  //     //   label: "1-2",
  //     //   size: 0,
  //     Arrow: 0,
  //     //   size: 0,
  //   },
  //   {
  //     source: "2",
  //     target: "3",
  //     id: "2-3",
  //     label: "2-3",
  //     size: 5,
  //   },
  // ];

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

// {
//     canvas: { background: '#fff' },
//     node:
//     {
//       fill: '#7CA0AB',
//       activeFill: '#1DE9AC',
//       opacity: 1,
//       selectedOpacity: 1,
//       inactiveOpacity: 0.2,
//       label: {
//         color: '#2A6475',
//         stroke: '#fff',
//         activeColor: '#1DE9AC'
//       },
//       subLabel: {
//         color: '#ddd',
//         stroke: 'transparent',
//         activeColor: '#1DE9AC'
//       }
//     },

//     lasso: {
//       border: '1px solid #55aaff',
//       background: 'rgba(75, 160, 255, 0.1)'
//     },
//     ring: {
//       fill: '#D8E6EA',
//       activeFill: '#1DE9AC'
//     },
//     edge:
//     {
//       fill: '#D8E6EA',
//       activeFill: '#1DE9AC',
//       opacity: 1,
//       selectedOpacity: 1,
//       inactiveOpacity: 0.1,
//       label: {
//         stroke: '#fff',
//         color: '#2A6475',
//         activeColor: '#1DE9AC',
//         fontSize: 6
//       }
//     },
//     arrow: {
//       fill: '#D8E6EA',
//       activeFill: '#1DE9AC'
//     },
//     cluster: {
//       stroke: '#D8E6EA',
//       opacity: 1,
//       selectedOpacity: 1,
//       inactiveOpacity: 0.1,
//       label: {
//         stroke: '#fff',
//         color: '#2A6475'
//       }
//     }
//   }
