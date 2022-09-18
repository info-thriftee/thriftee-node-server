
const Querybuilder = require('../querybuilder/qb');
const qb = new Querybuilder('mysql');
const baseUri = "/api/bidding";
const uuidV4 = require('uuid').v4;

const BidController = require('../controller/bid.controller');
const BiddingController = require('../controller/bidding.controller');

module.exports = initBid = (app) => {


  //Adding 
  app.post(baseUri + '/add', async (request, res) => {

    let req = request.body;
    try {
      let bid = {
        uuid: uuidV4(),
        bidding: req.bidding,
        customer: req.customer,
        amount: req.amount,
        date: req.date,
      };

      let bidding = await BiddingController.getBidding(bid.bidding);

      if(bidding.status) {
        let highest = await BidController.getHighestBid(bid.bidding);

        if(highest) {
          if(parseFloat(bid.amount) >= parseFloat(highest.amount) + parseFloat(bidding.increment)) {
            await BidController.save(bid);
            await BiddingController.update(req.bidding, {claimer: req.customer});
            res.json({success: 1})
          }
          else {
            res.json({success: 0, warning: "Not enough bid amount"})
          }
        }
        else {
          if(parseFloat(bid.amount >= parseFloat(bidding.minimum))) {
            await BidController.save(bid);
            await BiddingController.update(req.bidding, {claimer: req.customer});
            res.json({success: 1})
          }
          else {
            res.json({success: 0, warning: "Not enough bid amount"})
          }
        }
      }
      else {
        res.json({success: 0, warning: "This bidding has already ended"})
      }
    }
    catch(error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

  //Get Bid by UUID
  app.post(baseUri + '/get', async (request, res) => {
    let req = request.body;

    try {
      let result = null;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  })
}