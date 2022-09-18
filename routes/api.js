const StoreController = require("../controller/store.controller");
const ProductController = require("../controller/product.controller");
const ConditionController = require("../controller/condition.controller");
const MediaController = require("../controller/media.controller");
const BiddingController = require("../controller/bidding.controller");
const CustomerController = require("../controller/customer.controller");
const BidController = require("../controller/bid.controller");
const RatingController = require("../controller/rating.controller");
const FeaturedProductController = require("../controller/featured_product.controller");
const SliderProductController = require("../controller/slider_product.controller");
const StoreBillingController = require("../controller/store_billing.controller");
const TransactionController = require("../controller/transaction.controller");
const MessageController = require("../controller/message.controller");
const NotificationController = require("../controller/notification.controller");
const FollowerController = require("../controller/follower.controller");
const SalesController = require("../controller/sales.controller");
const ContentController = require("../controller/content.controller");
const UserController = require("../controller/user.controller");

const Router = require("../routes/Router");

/**
 * Controllers
 */
const store = new StoreController();
const product = new ProductController();
const condition = new ConditionController();
const media = new MediaController();
const bidding = new BiddingController();
const customer = new CustomerController();
const bid = new BidController();
const rating = new RatingController();
const featuredProduct = new FeaturedProductController();
const sliderProduct = new SliderProductController();
const storeBilling = new StoreBillingController();
const transaction = new TransactionController();
const message = new MessageController();
const notification = new NotificationController();
const follower = new FollowerController();
const sales = new SalesController();
const content = new ContentController();
const user = new UserController();

module.exports = initApi = (app) => {
  const router = new Router(app);

  //Store Routes
  router.get("/store/list", store.getCollection);
  router.post("/store/get", store.getItem);
  router.get("/store/all", store.getAllStoreName);
  router.post("/store/products", store.getProductsByStore);
  router.post("/store/update", store.updateStore);
  router.post("/store/add", store.addStore);
  router.post("/store/delete", store.deleteItem);
  router.post("/store/resend_completion_link", store.resendCompletionLink);
  router.post("/store/login", store.login);
  router.post("/store/update_password", store.updatePassword);
  router.post("/store/check_password", store.checkPassword);
  router.post("/store/get_status", store.getStatus);
  router.post("/store/store_id", store.getStoreByID);
  router.post("/store/update_profile", store.updateProfile);
  //Product Routes
  router.get("/product/all", product.getCollection);
  router.post("/product/get", product.getItem);
  router.post("/product/id", product.getProductByID);
  router.post("/product/add", product.addProduct);
  router.post("/product/rebid", product.rebidProduct);
  router.post("/product/delete", product.deleteItem);
  router.post("/product/category", product.getCategoryByProduct);
  router.post("/product/condition", product.getConditionByProduct);
  router.post("/product/active/store", product.getStoreActiveProducts);
  router.post("/product/completed/store", product.getStoreCompletedByProduct);
  router.post("/product/archived/store", product.getStoreArchiveProducts);
  router.post("/product/search", follower.search);
  //Condition Routes
  router.get("/condition/all", condition.getCollection);
  router.post("/condition/get", condition.getItem);
  router.post("/condition/add", condition.addCondition);
  router.post("/condition/delete", condition.deleteCondition);
  //Media Routes
  router.post("/media/upload_product_images", media.uploadProduct);
  router.post("/media/get_product_images", media.getProductImages);
  router.post("/media/make_dir", media.makeDirectory);
  //Bidding Routes
  router.get("/bidding/all", bidding.getCollection);
  router.post("/bidding/get", bidding.getItem);
  router.post("/bidding/add", bidding.addBidding);
  router.post("/bidding/update", bidding.updateBidding);
  router.post("/bidding/by_product", bidding.getBiddingByProduct);
  router.post("/bidding/latest_by_product", bidding.getLatestBiddingByProduct);
  router.post("/bidding/by_store", bidding.getBiddingByStore);
  router.post("/bidding/winner", bidding.getBiddingWinner);
  router.get("/bidding/specific_data", bidding.getSpecificBiddingData);
  router.get("/bidding/upcoming", bidding.getUpcommingBiddings);
  router.get("/bidding/on_going", bidding.getOnGoingBiddings);
  router.get("/bidding/popular", bidding.getPopularBiddings);
  router.get("/bidding/ending", bidding.getEndingBiddings);
  router.post("/bidding/store/active", bidding.getActiveBiddingByStore);
  router.get("/bidding/specific_data", bidding.getSpecificBiddingData);
  router.post(
    "/bidding/store/upcoming",
    bidding.getUpcomingBiddingBiddingsByStore
  );
  router.post("/bidding/store/on_going", bidding.getOnGoingBiddingsByStore);
  router.post("/bidding/store/products/sold", bidding.getStoreSoldProducts);
  //Customer Routes
  router.post("/customer/get", customer.getItem);
  router.post("/customer/update", customer.updateCustomer);
  router.post("/customer/update_password", customer.updatePassword);
  router.post("/customer/by_email", customer.getCustomerByEmail);
  router.post("/customer/status", customer.getStatus);
  router.psot("/customer/login", customer.login);
  router.post("/customer/update_profile", customer.updateProfile);
  //Bid Routes
  router.post("/bid/get", bid.getBid);
  router.post("/bid/add", bid.addBid);
  router.post("/bid/highest", bid.getHighestByProduct);
  router.post("/bid/highest_by_bidding", bid.getHighestBidByBidding);
  router.post("/bid/by_customer", bid.getAllBidByCustomer);
  router.post("/bid/by_product", bid.getBidByProduct);
  router.post("/bid/by_customer_product", bid.getBidByProductAndCustomer);
  router.post("/bid/status", bid.getCustomerBidStatus);
  //Rating Routes
  router.post("/rating/add", rating.addRating);
  router.post("/rating/by_store", rating.getRatingByStore);
  router.post("/rating/by_customer_store", rating.getRatingByCustomerAndStore);
  //Featured Product Routes
  router.post("/product/featured/add", featuredProduct.addFeaturedProduct);
  router.post("/product/featured/all", featuredProduct.getCollection);
  router.post(
    "/product/featured/update",
    featuredProduct.updateFeaturedProduct
  );
  router.post("/product/featured/delete", featuredProduct.deleteItem);
  //Slider Product Routes
  router.get("/product/slider/all", sliderProduct.getCollection);
  router.post("/product/slider/add", sliderProduct.addSliderProduct);
  router.post("/product/slider/update", sliderProduct.updateSliderProduct);
  router.post("/product/slider/delete", sliderProduct.deleteItem);
  //Store Billing Routes
  router.get("/store/billing/all", storeBilling.getCollection);
  router.post("/store/billing/add", storeBilling.addStoreBilling);
  router.post("/store/billing/get", storeBilling.getItem);
  //Transaction Routes
  router.post("/transaction/get", transaction.getItem);
  router.post("/transaction/add", transaction.addTransaction);
  router.post("/transaction/update_payment", transaction.updatePaymentMethod);
  router.post("/transaction/cancel", transaction.cancelTransaction);
  router.post("/transaction/store/no_payment", transaction.getStoreNoPayment);
  router.post(
    "/transaction/store/for_validation",
    transaction.getStoreForValidation
  );
  router.post(
    "/transaction/store/complete",
    transaction.getStoreCompletedTransactions
  );
  router.post("/transaction/payment/send", transaction.sendReference);
  router.post("/transaction/payment/cancel", transaction.cancelReference);
  router.post("/transaction/payment/received", transaction.validatePayment);
  router.post("/transaction/payment/revoked", transaction.revokePayment);
  router.post("/transaction/payment/cancel", transaction.cancelReference);
  //Message Routes
  router.post("/message/get", message.getItem);
  router.post("/message/send_message", message.sendMessage);
  router.post("/message/latest", message.getLatestMessage);
  router.post("/message/chatList", message.getChatList);
  router.post("/message/seen", message.seenMessages);
  router.post("/message/chatbox/add", message.createChatBox);
  //Notification Routes
  router.post("/notification/add", notification.addNotification);
  router.post("/notification/get", notification.getItem);
  router.post("/notification/delete", notification.deleteItem);
  router.post(
    "/notification/update_status",
    notification.updateNotificationStatus
  );
  router.post("/notification/count", notification.getUnreadNotificationCount);
  //Follower Routes
  router.post("/follower/store", follower.getAllFollowers);
  router.post("/follower/follow", follower.followStore);
  router.post("/follower/unfollow", follower.unfollowStore);
  router.post("/follower/customer", follower.getFollowedStore);
  router.post("/follower/customer/count", follower.getFollowedStoreCount);
  router.post("/follower/store/count", follower.getAllFollowersCount);
  router.post("/follower/status", follower.checkFollowStatus);
  //Sales Routes
  router.post("/sales/admin/sold_items", sales.getSoldItemsAdminSales);
  router.post("/sales/admin/unclaim_items", sales.getUnclaimedItemsAdminSale);
  router.post("/sales/admin/user_unclaim_items", sales.getUserWithUnclaimItems);
  //Content Routes
  router.get("/content/all", content.getAllContents);
  router.post("/content/add", content.addContent);
  router.post("/content/update", content.updateContent);
  router.post("/content/delete", content.deleteItem);
  //User Routes
  router.post("/user/add", user.addUser);
  router.post("/user/login", user.loginUser);
  router.post("/user/delete", user.deleteItem);
};
