// src/systems/velocityTrackerSystem.js
import { getControlTarget } from "../state/controlState.js";
import { updateMotion } from "../state/motionState.js";

export function velocityTrackerSystem(dt){
  const { target } = getControlTarget();
  if (target) updateMotion(target, dt);
}
