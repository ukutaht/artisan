function hasEstimate(estimates) {
  return estimates.optimistic || estimates.realistic || estimates.pessimistic
}

function weightedMean(estimates) {
  return ((estimates.optimistic + (4 * estimates.realistic) + estimates.pessimistic) / 6);
}

function standardDeviation(estimates) {
  return ((estimates.pessimistic - estimates.optimistic) / 6);
}

export default function estimate(estimates) {
  if (hasEstimate(estimates)) {
    let mean = weightedMean(estimates);
    mean += (standardDeviation(estimates) * 2);
    return (mean*4).toFixed(0)/4.0;
  } else {
    return null;
  }
}
