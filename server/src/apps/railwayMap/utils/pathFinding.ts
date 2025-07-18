export default function dijkstraWithTransfers(
  graph: Record<string, Record<string, number>>,
  lines: Record<string, string[]>,
  start: string,
  end: string,
) {
  const distances: Record<string, number> = {};

  const prev: Record<string, string | null> = {};

  const unvisited = new Set(Object.keys(graph));

  for (const node of unvisited) {
    distances[node] = Infinity;
    prev[node] = null;
  }
  distances[start] = 0;

  while (unvisited.size > 0) {
    const minNode = [...unvisited].reduce((a, b) =>
      distances[a] < distances[b] ? a : b,
    );

    if (minNode === end) break;
    unvisited.delete(minNode);

    for (const neighbor in graph[minNode]) {
      let newDist = distances[minNode] + graph[minNode][neighbor];

      const prevStation = prev[minNode];

      const nextStation = neighbor;

      if (prevStation && nextStation) {
        const prevLines = lines[prevStation] || [];

        const currLines = lines[minNode] || [];

        const nextLines = lines[nextStation] || [];

        const sameLine = currLines.some(
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

  const path = [];

  let temp: string | null = end;
  while (temp) {
    path.unshift(temp);
    temp = prev[temp];
  }
  return path.length > 1 ? path : null;
}
