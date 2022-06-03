const moment = require('moment');
const schedule = require('node-schedule');
const db = require("../db/connection");
const uuidv1 = require('uuid').v1();

const Querybuilder = require('../querybuilder/qb');
const qb = new Querybuilder('mysql');

async function checkWaitingBiddings() {
  console.log("checkWaitingBiddings")
  let sql = qb
    .fields("biddings.*, products.store, products.product_id, products.name")
    .from("biddings")
    .where({'biddings.status': 'waiting'})
    .leftJoin(['products','products.uuid','biddings.product'])
    .limit(0)
    .call();

  let biddings = [];

  db.query(sql, (err, result) => {
    if(err){
        console.log(err);
        res.sendStatus(500);
    }
    else{
      biddings = result;

      let current_time = new Date();

      for(let item of biddings) {
        let start_time = moment(item.start_time).toDate();

        if (current_time >= start_time) {

          let updateSql = qb.update().from('biddings').set({status: "on_going"}).where({uuid: item.uuid}).call();

          //UPDATE
          db.query(updateSql, (err, result) => {
            if(err){
              console.log(err);
              res.sendStatus(500);
            }
            else {
              //TODO: CHECK IF NOTIFICATION IS WORKING / BIDDING START
              // followers = Follower::where('store',item.store).get;
              // customers = array();

              // foreach (followers as follower) {
              //     array_push(customers, follower.customer);
              // }

              // type = 'bidding_start';
              // details = [
              //     "bidding" => item.uuid,
              //     "product" => item.product,
              //     "product_id" =>  item.product_id,
              // ];

              // notifyCustomer(customers, type, details);


              //NOTIFY STORE WHEN BIDDING STARTS
              let type = "bidding_start";
              let details = {
                  bidding : item.uuid,
                  product : item.product,
                  product_id :  item.product_id,
                  product_name : item.name
              };

              notifyStore(item.store, type, details);
            }
          })
        }
      }
    }
  });
}

async function checkActiveBiddings(){
  console.log("checkActiveBiddings");

  let sql = qb
    .fields("biddings.*, products.store, products.product_id, products.name")
    .from("biddings")
    .where({'biddings.status': 'on_going'})
    .leftJoin(['products','products.uuid','biddings.product'])
    .limit(0)
    .call();

  db.query(sql, (err, result) => {
    if(err){
        console.log(err);
        res.sendStatus(500);
    }
    else{
      biddings = result;

      let current_time = new Date();

      for(let item of biddings) {
        let end_time = moment(item.start_time).toDate();

        if (current_time >= end_time) {

          let updateSql = qb.update().from('biddings').set({status: "ended"}).where({uuid: item.uuid}).call();

          //UPDATE
          db.query(updateSql, async (err, result) => {
            if(err){
              console.log(err);
              res.sendStatus(500);
            }
            else {
              //TODO: send notification to all bidders (BIDDING ENDED) / CHECK IF WORKING
              let type = 'bidding_ended';
              let details = {
                  bidding : item.uuid,
                  product : item.product,
                  product_id :  item.product_id,
                  product_name : item.name
              };

              //NOTIFY CUSTOMER
              let customers = await getBidders(item.uuid);
              notifyCustomer(customers, type, details);

              //NOTIFY STORE
              notifyStore(item.store, type, details);
            }
          })
        }
      }
    }
  })
}

async function checkEndedBiddings(){
  
  console.log("checkEndedBiddings");

  let sql = "SELECT biddings.*, Count(bids.uuid) as bid_count, products.store, products.name as product_name, products.product_id FROM biddings LEFT JOIN bids ON biddings.uuid = bids.bidding LEFT JOIN products ON biddings.product = products.uuid WHERE biddings.status = 'ended' GROUP BY biddings.uuid"

  db.query(sql, async (err, result) => {
    if(err){
        console.log(err);
        res.sendStatus(500);
    }
    else{
      let current_time = new Date();

      let biddings = result;

      for(let item of biddings) {
    
        if(item.bid_count > 0) {
    
          let end_time = moment(item.end_time).toDate();
    
          let bidders = await getBidders(item.uuid);
          let hoursdiff = (current_time - end_time) / 3600;
    
          //48 hrs = 2 days
          let winnerIndex = hoursdiff / 48;
    
          //Failed to claim the product
          if(winnerIndex >= bidders.length) {


            //Bidding
            let updateBidding = qb.update().from('biddings').set({
              status: 'claim_failed',
              claimer: null,
            }).where({uuid: item.uuid}).call();
            db.query(updateBidding);
            // await db.table('biddings')
            // .update('status', 'claim_failed')
            // .update('claimer', null)
            // .where('uuid', item.uuid);
    
            //Product
            let updateProduct = qb.update().from('products').set({status: 'archived'}).where({uuid: item.product}).call();
            db.query(updateProduct);
            // await db.table('products')
            // .update('status', 'archived')
            // .where('uuid', item.product);
    
            //TODO: CHECK IF WORKING
            let type = 'bidding_failed';
            let details = {
                bidding : item.uuid,
                product : item.product,
                product_id :  item.product_id,
                product_name : item.name,
                reason : "claim_failed"
            };
    
            notifyStore(item.store, type, details);
          }
          else {
            let new_claimer = bidders[winnerIndex].customer;
    
            //Update if current claimer is not equal to new claimer
            if(new_claimer !== item.claimer) {
            
              //TODO: send notification to current claimer (CLAIM FAILED) AND new claimer // CHECK IF WORKING
    
              if(item.claimer) {
                let type = 'claim_failed';
                let details = {
                  bidding : item.uuid,
                  product : item.product,
                  product_id :  item.product_id,
                  product_name : item.name
                }
    
                notifyCustomer([item.claimer], type, details);
              }
    
              //Update Bidding
              let updateBidding = qb.update().from('biddings').set({claimer: new_claimer,}).where({uuid: item.uuid}).call();
              db.query(updateBidding);
              // await db.table('biddings')
              // .update('claimer', new_claimer)
              // .where('uuid', item.uuid);
    
              if(new_claimer) {
                let type = 'selected_claimer';
                let details = {
                    bidding : item.bidding,
                    product : item.product
                };
    
                notifyCustomer([new_claimer], type, details);
              }
            }
          }
        }
        else {
          //Update Bidding
          await db.table('biddings')
          .update('status', 'no_bid')
          .where('uuid', item.uuid);
          
          //UPDATE PRODUCT
          await db.table('products')
          .update('status', 'archived')
          .where('uuid', item.product);
    
          //TODO: CHECK IF WORKING
          let type = 'bidding_failed';
          let details = {
                bidding : item.uuid,
                product : item.product,
                product_id :  item.product_id,
                product_name : item.name,
                reason : "no_bid"
          };
    
          notifyStore(item.store, type, details);
        }
      }
    }

  })
}

async function getBidders(bidding) {

  let sql = qb.select().from('bids').where({bidding: bidding}).order({date: 0}).call();

  let bidder = [];

  await db.query(sql, (err, res) => {
    let bids = res;

    console.log("BIDS",res)

    // for(let bid of bids) {
    //   if (!bidder.includes(bid.customer)) {
    //     bidder.push(bid.customer)
    //   }
    // }
  })
  // let bids = await db.table('bids')
  //       .where('bidding', bidding)
  //       .orderBy('date', 'desc')
  //       .get();

  return bidder;
}

async function notifyCustomer (customers, type, details) {
  let current_date = new Date();

  for(let item of customers) {
    let notif = {
      uuid: uuidv1(),
      customer: item,
      type: type,
      date: current_date,
      details: details
    }

    //await db.table('customernotifications').insert()
  }
}

async function notifyStore (store, type, details) {
    // notif = new StoreNotification();
    // notif.uuid = Str::uuid();
    // notif.store = store;
    // notif.type = type;
    // notif.date = date("Y-m-d H:i:s");
    // notif.details = json_encode([details]);
    // result = notif.save();
}

module.exports = updateBiddingJob = () => {
  // checkWaitingBiddings();
  // checkActiveBiddings();
  // checkEndedBiddings();
  schedule.scheduleJob('* * * * *', function() {

    console.log("Checking bidding status...");
    
    // checkWaitingBiddings();
    // checkActiveBiddings();
    // checkEndedBiddings();
  });
}