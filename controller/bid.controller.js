const Controller = require("./Controller");


module.exports = class BidController extends Controller {

  constructor() {
    super('bids');
  }

  getBid = async (req) => {
    let res = await this.qb.select().where({uuid: req.uuid}).call();
    return res ? res[0] : null;
  }

  save = async (req) => {
    let res = await this.qb.insert().set({
      uuid: this.uuidV4(),
      bidding: req.bidding,
      customer: req.customer,
      amount: req.amount,
      date: req.date,
    }).call();
    return res;
  }
  
  update = async (req) => {
    let res = await this.qb.update().set({
      uuid: req.uuid,
      bidding: req.bidding,
      customer: req.customer,
      amount: req.amount,
      date: req.date,
    }).call();
    return res;
  }
  
  remove = async (req) => {
    let res = await this.qb.delete().where({uuid: req.uuid}).call();
    return res;
  }
  
  getHighestBid = async (req) => {
    let res = await this.qb.select()
      .where({bidding: req.bidding})
      .order({amount: "DESC"})
      .call();
    
    return res ? res[0] : null;
  }
  
  getTotalBids = async (req) => {
    let res = await this.qb.count()
      .where({bidding: req.bidding})
      .call();
  
    return res ? res[0].count : null;
  }
  
  getAllBidsOfCustomer = async (req) => {
    let res = await this.qb.select()
      .fields(['bids.*'])
      .leftJoin(['biddings', 'bids.bidding', 'biddings.uuid'])
      .where({customer: req.customer})
      .order({date: "DESC"})
      .group(["bidding"])
      .call();
  
    let bids = [];
    
    for(let item of res) {
  
      let bidding = await BaseController.getItem('biddings', {uuid: item.bidding});
      let product = await BaseController.getItem('products', {uuid: bidding.product});
  
      let image = await BaseController.getItem('productimages', {product: product.uuid});
      product.image = image.path;
      
      let store = await BaseController.getItem('stores', {uuid: product.store});
  
      let highestBid = await getHighestBid();
  
      let arr_item = {
        bidding: bidding,
        product: product,
        store: store,
        bids: item,
        highest: highestBid
      }
  
      bids = [...bids, arr_item];
      
    }
  
    return bids;
  }
  
  getBidsOfProduct = async (req) => {
    let res = await this.qb.select()
      .join(['biddings', 'bids.bidding', 'biddings.uuid'])
      .where({product: req.product})
      .call();
  
    return res;
  }
  
  getHighestBidOfProduct = async (req) => {
    let res = await this.qb.select()
      .join(['biddings', 'bids.bidding', 'biddings.uuid'])
      .where({product: req.product})
      .order({amount: "DESC"})
      .call();
  
    return res ? res[0] : null;
  }
  
  getBidByProductAndCustomer = async (req) => {
    let res = await this.qb.select()
      .join(['biddings', 'bids.bidding', 'biddings.uuid'])
      .where({product: req.product, customer: req.customer})
      .order({amount: "DESC"})
      .call();
  
    return res ? res[0] : null;
  }
  
  getBidByBiddingAndCustomer = async (req) => {
    let res = await this.qb.select()
      .join(['biddings', 'bids.bidding', 'biddings.uuid'])
      .where({bidding: req.bidding, customer: req.customer})
      .order({amount: "DESC"})
      .call();
  
    return res ? res[0] : null;
  }
  
  getCustomerBidStatus = async (req) => {

    let bidding = await this.qb.select().table('biddings')
      .where({bidding: req.bidding}).first();
    let bidders = await this.getBidders(bidding.uuid);

    if(bidding.claimer === req.customer) {
      return {
        status: "claimer"
      }
    }
    else {
      let claimerIndex = bidders.indexOf(bidding.claimer);
      let customerIndex = bidders.indexOf(req.customer);

      if(claimerIndex != -1) {
        if(claimerIndex < customerIndex) {
          return {
            status: "lose"
          }
        }
        else {
          return {
            status: "claim_failed"
          }
        }
      }
      else {
        return {
          status: "no_bid"
        }
      }
    }
  }
  
  //if bidder has 2 bids it counts as 1
  getBidders = async (bidding) => {
    let bids = await this.qb.select()
      .where({bidding: bidding})
      .order({date: "DESC"})
      .call();
  
    let bidders = [];
    
    for(let bid of bids) {
      if(!bidders.includes(bid.customer)) {
        bidders = [...bidders, bidders];
      }
    }
  
    return bidders;
  }
}