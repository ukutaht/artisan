const Pert = {
  weightedMean: function(estimate) {
    return ((estimate.optimistic + (4 * estimate.realistic) + estimate.pessimistic) / 6);
  },

  standardDeviation: function(estimate) {
    return ((estimate.pessimistic - estimate.optimistic) / 6);
  },

  estimate: function(estimate) {
    let mean = this.weightedMean(estimate);
    mean += (this.standardDeviation(estimate) * 2);
    return (mean*4).toFixed(0)/4.0;
  }
}

export default Pert;
