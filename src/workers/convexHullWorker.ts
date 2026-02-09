import QuickHull from 'quickhull3d';

export interface ConvexHullRequest {
  id: number;
  vertices: Float32Array;
}

export interface ConvexHullResponse {
  id: number;
  hullVertices: Float32Array;
}

self.onmessage = (e: MessageEvent<ConvexHullRequest>) => {
  const { id, vertices } = e.data;

  const points: [number, number, number][] = [];
  for (let i = 0; i < vertices.length; i += 3) {
    points.push([vertices[i], vertices[i + 1], vertices[i + 2]]);
  }

  if (points.length < 4) {
    const response: ConvexHullResponse = { id, hullVertices: vertices };
    self.postMessage(response, { transfer: [vertices.buffer] });
    return;
  }

  const faces = QuickHull(points);

  const uniqueIndices = [...new Set(faces.flat())];
  const hullPoints = uniqueIndices.map(i => points[i]);
  const hullVertices = new Float32Array(hullPoints.flat());

  const response: ConvexHullResponse = { id, hullVertices };
  self.postMessage(response, { transfer: [hullVertices.buffer] });
};
