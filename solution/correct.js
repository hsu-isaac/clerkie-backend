/* This file contains a number of issues. Your task is to fix the issues
 * while retaining the intended functionality.
 *
 * You should feel free to import libraries if they will help you make
 * the code simpler (no point in reinventing the wheel!)
 *
 * Also, don't hesitate to ask if you have any questions about the intended
 * functionality of any of the functions below.
 */

const models = require("./models");
const mongoose = require("mongoose");

/*
 * Loops through the userIds and pulls the first user that can be found in the database.
 * If a particular user can't be found, ignore the id and look for the next user
 * until one can be found.
 */
async function pullFirstUser(userIds) {
  const users = await models.user.find({ _id: { $in: userIds } });

  const userMap = {};
  for (const user of users) {
    userMap[user._id.toString()] = user;
  }

  for (let userId of userIds) {
    if (userMap[userId]) {
      return userMap[userId];
    }
  }
  return;
}
module.exports.pullFirstUser = pullFirstUser;

/*
 * Processes the array and returns the results in
 * the same order as the input documents. (e.g., the
 * result of the first element in the argument array should
 * be stored in the first element of the result array, and so on...).
 *
 * Each element in the return array should be an array of all payments
 * for that particular user.
 *
 * The users argument is an array of user objects (with _id fields)
 */
async function pullPaymentsForUsers(users) {
  let result = [];

  const payments = await models.payment.find({
    user: {
      $in: users.map((user) => mongoose.Types.ObjectId(user._id)),
    },
  });

  const paymentMap = {};
  for (const payment of payments) {
    const userId = payment.user.toString();
    if (!paymentMap[userId]) {
      paymentMap[userId] = [];
    }
    paymentMap[userId].push(payment);
  }

  for (const user of users) {
    const userId = user._id.toString();
    result.push(paymentMap[userId] || []);
  }

  return result; // array of array with payments (the first array should contain payments for the first user)
}
module.exports.pullPaymentsForUsers = pullPaymentsForUsers;

/*
 * Converts the number to a string (return nothing if
 * something other than a number is passed to the function)
 */
function convertToStr(num) {
  if (typeof num !== "number" || isNaN(num)) {
    return;
  }
  return num.toString();
}
module.exports.convertToStr = convertToStr;

/*
 * Given the _id of the payment, return the payment
 * with the associated user. The user should be stored
 * as "user" on the payment object.
 *
 * Sometimes the payment id might not match any payments.
 */
async function getPaymentWithUser(paymentId) {
  let payment = await models.payment.findById(paymentId).populate("user");

  if (!payment) {
    return null;
  }

  return payment;
}
module.exports.getPaymentWithUser = getPaymentWithUser;

/*
 * Pulls all active payments for the users and retuns an object
 * mapping the user id to the user's payments (string to array).
 * Note: userIds is passed in as an array of strings
 */
async function getGroupedUserPmts(userIds) {
  const payments = await models.payment.find({
    user: { $in: userIds },
    active: true,
  });

  const result = {};

  for (const userId of userIds) {
    result[userId] = payments.filter(
      (payment) => payment.user.toString() === userId
    );
  }

  return result;
}
module.exports.getGroupedUserPmts = getGroupedUserPmts;
