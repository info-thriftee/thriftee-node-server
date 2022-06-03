const updateBiddingJob = require('./update_bidding');

module.exports = startJobs = () => {
  updateBiddingJob();
}