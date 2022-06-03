const moment = require('moment');
const schedule = require('node-schedule');
const db = require("../db/connection");
const uuid = require('uuid');

const Querybuilder = require('../querybuilder/qb');


async function checkWaitingBiddings() {
  console.log("checkWaitingBiddings")

  let qb = new Querybuilder('mysql');
  let sql = qb
    .fields("biddings.*, products.store, products.product_id, products.name")
    .table("biddings")
    .where({'biddings.status': 'waiting'})
    .leftJoin(['products','products.uuid','biddings.product'])
    .limit(0)
    .call();

  let biddings = await db(sql);

  let current_time = new Date();

  for(let item of biddings) {
    let start_time = moment(item.start_time).toDate();

    if (current_time >= start_time) {

      //UPDATE
      let updateSql = qb.update().table('biddings').set({status: "on_going"}).where({uuid: item.uuid}).call();
      await db(updateSql);

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
  }
}

async function checkActiveBiddings() {

  let qb = new Querybuilder('mysql');

  console.log("checkActiveBiddings");

  let sql = qb
    .fields("biddings.*, products.store, products.product_id, products.name")
    .table("biddings")
    .where({'biddings.status': 'on_going'})
    .leftJoin(['products','products.uuid','biddings.product'])
    .limit(0)
    .call();


  let biddings = await db(sql);

  let current_time = new Date();

  for(let item of biddings) {
    let end_time = moment(item.start_time).toDate();
    
    console.log("UPDATE ACTIVE BIDDING");
    console.log("Current time", current_time);
    console.log("End Time", end_time);

    if (current_time >= end_time) {

      //UPDATE
      await db(qb.update().table('biddings').set({status: "ended"}).where({uuid: item.uuid}).call());

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
  }
}

async function checkEndedBiddings(){
  
  let qb = new Querybuilder('mysql');

  console.log("checkEndedBiddings");

  let sql = "SELECT biddings.*, Count(bids.uuid) as bid_count, products.store, products.name as product_name, products.product_id FROM biddings LEFT JOIN bids ON biddings.uuid = bids.bidding LEFT JOIN products ON biddings.product = products.uuid WHERE biddings.status = 'ended' GROUP BY biddings.uuid"

  let biddings = await db(sql);
  
  let current_time = new Date();

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
        await db(
          qb.update()
          .table('biddings')
          .set({
            status: 'claim_failed',
            claimer: null,
          })
          .where({
            uuid: item.uuid
          })
          .call()
        );

        //Product
        await db(qb.update().table('products').set({status: 'archived'}).where({uuid: item.product}).call());


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
        let new_claimer = bidders[winnerIndex];

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
          await db(qb.update().table('biddings').set({claimer: new_claimer,}).where({uuid: item.uuid}).call());
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
      await db(
        qb.update()
        .table('biddings')
        .set({status: 'no_bid'})
        .where({uuid: item.uuid})
        .call()
      )
      // await db.table('biddings')
      // .update('status', 'no_bid')
      // .where('uuid', item.uuid);
      
      //UPDATE PRODUCT
      await db(
        qb.update()
        .table('products')
        .set({status: 'archived'})
        .where({uuid: item.product})
        .call()
      )
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
            reason : "no_bid"
      };

      notifyStore(item.store, type, details);
    }
  }
}

async function getBidders(bidding) {

  let qb = new Querybuilder('mysql');

  let sql = qb.select().table('bids').where({bidding: bidding}).order({date: 0}).call();

  let bids = await db(sql);

  let bidder = [];

  for(let bid of bids) {
    if (!bidder.includes(bid.customer)) {
      bidder.push(bid.customer)
    }
  }

  // let bids = await db.table('bids')
  //       .where('bidding', bidding)
  //       .orderBy('date', 'desc')
  //       .get();

  return bidder;
}

async function notifyCustomer (customers, type, details) {

  let qb = new Querybuilder('mysql');

  let current_date = new Date();

  for(let item of customers) {
    let notif = {
      uuid: uuid.v1(),
      customer: item,
      type: type,
      date: moment(current_date).format("yyyy-MM-DD HH:mm:ss"),
      details: JSON.stringify(details)
    }

    await db(qb.insert().table('customer_notifications').set(notif).call());
    //await db.table('customernotifications').insert()
  }
}

async function notifyStore (store, type, details) {

  let qb = new Querybuilder('mysql');

  // notif = new StoreNotification();
  // notif.uuid = Str::uuid();
  // notif.store = store;
  // notif.type = type;
  // notif.date = date("Y-m-d H:i:s");
  // notif.details = json_encode([details]);
  // result = notif.save();
  let current_date = new Date();

  let notif = {
    uuid: uuid.v1(),
    store: store,
    type: type,
    date: moment(current_date).format("yyyy-MM-DD HH:mm:ss"),
    details: JSON.stringify(details)
  }

  await db(qb.insert().table('store_notifications').set(notif).call());
}

module.exports = updateBiddingJob = () => {
  // checkWaitingBiddings();
  // checkActiveBiddings();
  // checkEndedBiddings();
  schedule.scheduleJob('* * * * *', function() {

    //console.log("Checking bidding status...");
    
    checkWaitingBiddings();
    checkActiveBiddings();
    checkEndedBiddings();
  });
}