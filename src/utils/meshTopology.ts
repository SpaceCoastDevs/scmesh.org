export const NODES = [
  { id: 0, x: 55, y: 5, device: "rak_wismesh_tag.svg", label: "Client" },
  {
    id: 1,
    x: 25,
    y: 25,
    device: "tracker-t1000-e.svg",
    label: "Client",
  },
  { id: 2, x: 85, y: 25, device: "thinknode_m1.svg", label: "Client" },
  { id: 3, x: 18, y: 60, device: "t-deck.svg", label: "Client" },
  { id: 4, x: 55, y: 50, device: "station-g2.svg", label: "Router" },
  { id: 5, x: 92, y: 60, device: "rak4631.svg", label: "Client" },
  { id: 6, x: 35, y: 85, device: "heltec_mesh_pocket.svg", label: "Client" },
  { id: 7, x: 75, y: 85, device: "muzi_r1_neo.svg", label: "Client" },
];

// Mesh connections (from, to) - sparser for visible multi-hop flooding
export const CONNECTIONS: [number, number][] = [
  // Top node connects to upper layer only
  [0, 1],
  [0, 2],
  // Upper left/right to their nearby nodes
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 5],
  // Side nodes to center and bottom
  [3, 6],
  [4, 6],
  [4, 7],
  [5, 7],
  // Bottom cross connection
  [6, 7],
  // One cross-link for redundancy
  [1, 6],
  [2, 7],
];


export function getFloodWaves(sender: number) {
  const heard = new Set([sender]);
  let frontier = [sender];
  const waves: { edges: { index: number; from: number; to: number }[]; receivers: number[] }[] = [];
  while (frontier.length) {
    const edges: { index: number; from: number; to: number }[] = [];
    const receivers: number[] = [];
    for (const from of frontier) {
      CONNECTIONS.forEach(([a, b], index) => {
        const to = a === from ? b : b === from ? a : undefined;
        if (to === undefined || heard.has(to)) return;
        heard.add(to);
        receivers.push(to);
        edges.push({ index, from, to });
      });
    }
    if (receivers.length) waves.push({ edges, receivers });
    frontier = receivers;
  }
  return waves;
}
