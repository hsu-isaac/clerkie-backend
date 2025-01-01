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

/*
 * Loops through the userIds and pulls the first user that can be found in the database.
 * If a particular user can't be found, ignore the id and look for the next user
 * until one can be found.
 */
async function pullFirstUser(userIds) {
  const users = await models.user.find({ _id: { $in: userIds } });

  const sortedUsers = users.sort(
    (a, b) =>
      userIds.indexOf(a._id.toString()) - userIds.indexOf(b._id.toString())
  );

  console.log(sortedUsers);

  if (sortedUsers.length === 0) {
    return null;
  }
  return sortedUsers[0];
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
function pullPaymentsForUsers(users) {
  let result = [];
  for (let user of users) {
    models.payment.findOne({ user_id: user._id }).then((payments) => {
      result.push(payments);
    });
  }
  return result; // array of array with payments (the first array should contain payments for the first user)
}
module.exports.pullPaymentsForUsers = pullPaymentsForUsers;

/*
 * Converts the number to a string (return nothing if
 * something other than a number is passed to the function)
 */
function convertToStr(num) {
  if (!num) return num.toString();
}
module.exports.convertToStr = convertToStr;

/*
 * Given the _id of the payment, return the payment
 * with the associated user. The user should be stored
 * as "user" on the payment object.
 *
 * Sometimes the payment id might not match any payments.
 */
function getPaymentWithUser(paymentId) {
  let payment = models.payment.find({ _id: paymentId });
  payment.user = models.user.find({ _id: payment.user });
  return payment;
}
module.exports.getPaymentWithUser = getPaymentWithUser;

/*
 * Pulls all active payments for the users and retuns an object
 * mapping the user id to the user's payments (string to array).
 * Note: userIds is passed in as an array of strings
 */
function getGroupedUserPmts(userIds) {
  let result = {};
  let payments = models.payment.find({ user_id: userIds });
  userIds.forEach((userId) => {
    payments = payments.filter((payment) => userIds.includes(payment.user_id));
    result[userId] = payments;
  });
  return result;
}
module.exports.getGroupedUserPmts = getGroupedUserPmts;
