export default function dijkstraWithTransfers(
  graph: Record<string, Record<string, number>>,
  lines: Record<string, string[]>,
  start: string,
  end: string,
) {
  let distances: Record<string, number> = {};
  let prev: Record<string, string | null> = {};
  let unvisited = new Set(Object.keys(graph));

  for (let node of unvisited) {
    distances[node] = Infinity;
    prev[node] = null;
  }
  distances[start] = 0;

  while (unvisited.size > 0) {
    let minNode = [...unvisited].reduce((a, b) =>
      distances[a] < distances[b] ? a : b,
    );

    if (minNode === end) break;
    unvisited.delete(minNode);

    for (let neighbor in graph[minNode]) {
      let newDist = distances[minNode] + graph[minNode][neighbor];

      let prevStation = prev[minNode];
      let nextStation = neighbor;

      if (prevStation && nextStation) {
        let prevLines = lines[prevStation] || [];
        let currLines = lines[minNode] || [];
        let nextLines = lines[nextStation] || [];

        let sameLine = currLines.some(
          (line) => prevLines.includes(line) && nextLines.includes(line),
        );

        if (!sameLine) {
          newDist += ["Newton", "Tampanies"].includes(minNode) ? 10 : 5;
        }
      }

      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        prev[neighbor] = minNode;
      }
    }
  }

  let path = [];
  let temp: string | null = end;
  while (temp) {
    path.unshift(temp);
    temp = prev[temp];
  }
  return path.length > 1 ? path : null;
}
