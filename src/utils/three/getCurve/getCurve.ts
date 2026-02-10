import * as THREE from 'three';

export interface GetCurveParams {   
    startPoint: THREE.Vector3;
    startTangent: THREE.Vector3;
    turnStrength: number;
    turnDirection: THREE.Vector3;
    length: number;
}

/**
 * Generates curve from cubic bezier based on properties
 *
 * @param props - Configuration object
 * @param props.startPoint - Starting position of the curve
 * @param props.startTangent - Direction the curve initially moves toward (should be normalized) 
 * @param props.turnStrength - How strongly the curve bends toward turnDirection (0 = straight line)
 * @param props.turnDirection - Direction the curve bends toward
 * @param props.length - Total length of the curve 
 *
 * @returns A THREE.CubicBezierCurve3 
 */
const getCurve = (params: GetCurveParams) => {
  const p0 = params.startPoint.clone();
  const p1 = params.startPoint.clone().addScaledVector(params.startTangent, params.length / 3);

  const endTangent = params.startTangent.clone()
    .addScaledVector(params.turnDirection, params.turnStrength)
    .normalize();

  const p3 = params.startPoint.clone()
    .addScaledVector(params.startTangent, params.length * 0.7)
    .addScaledVector(params.turnDirection, params.length * params.turnStrength * 0.5)
    .addScaledVector(endTangent, params.length * 0.3);

  const p2 = p3.clone().addScaledVector(endTangent, -params.length / 3);

  return new THREE.CubicBezierCurve3(p0, p1, p2, p3);
};

export default getCurve;