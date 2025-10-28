/**
 * Dehaze Utilities
 * Professional atmospheric haze removal algorithms
 */

// Export from darkChannel
export {
  calculateDarkChannel,
  calculateFastDarkChannel,
  estimateAtmosphericLight,
  calculateTransmissionMap,
  refineTransmission,
} from './darkChannel';

// Export from dehazeAlgorithm
export { applyDehaze, dehazeValueToParams } from './dehazeAlgorithm';
export type { DehazeParams } from './dehazeAlgorithm';
