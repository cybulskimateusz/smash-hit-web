import * as THREE from 'three';

interface TubeSegmentPath {
  curve: THREE.Curve<THREE.Vector3>;
  startDistance: number;
  length: number;
}

class TubePathManager {
  static instance = new TubePathManager();

  private segments: TubeSegmentPath[] = [];
  private totalLength = 0;

  addSegment(curve: THREE.Curve<THREE.Vector3>): number {
    const startDistance = this.totalLength;
    const length = curve.getLength();
    this.segments.push({
      curve,
      startDistance,
      length,
    });
    this.totalLength += length;
    return startDistance;
  }

  getPositionAt(distance: number): THREE.Vector3 {
    if (this.segments.length === 0) {
      return new THREE.Vector3(0, 0, -distance);
    }

    // Find the segment containing this distance
    for (const segment of this.segments) {
      const endDistance = segment.startDistance + segment.length;
      if (distance <= endDistance) {
        // u is arc-length parameter (0 to 1)
        const u = (distance - segment.startDistance) / segment.length;
        // getPointAt uses arc-length parameterization for smooth movement
        return segment.curve.getPointAt(Math.min(1, Math.max(0, u)));
      }
    }

    // Past all segments - extrapolate from last segment
    const lastSegment = this.segments[this.segments.length - 1];
    const overshoot = distance - (lastSegment.startDistance + lastSegment.length);
    const endPoint = lastSegment.curve.getPointAt(1);
    const endTangent = lastSegment.curve.getTangentAt(1);
    return endPoint.clone().addScaledVector(endTangent, overshoot);
  }

  getTangentAt(distance: number): THREE.Vector3 {
    if (this.segments.length === 0) {
      return new THREE.Vector3(0, 0, -1);
    }

    // Find the segment containing this distance
    for (const segment of this.segments) {
      const endDistance = segment.startDistance + segment.length;
      if (distance <= endDistance) {
        const u = (distance - segment.startDistance) / segment.length;
        // getTangentAt uses arc-length parameterization
        return segment.curve.getTangentAt(Math.min(1, Math.max(0, u))).normalize();
      }
    }

    // Past all segments - use last segment's end tangent
    const lastSegment = this.segments[this.segments.length - 1];
    return lastSegment.curve.getTangentAt(1).normalize();
  }

  getTotalLength(): number {
    return this.totalLength;
  }

  clear(): void {
    this.segments = [];
    this.totalLength = 0;
  }
}

export default TubePathManager;
