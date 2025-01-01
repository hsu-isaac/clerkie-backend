const {
  pullFirstUser,
  pullPaymentsForUsers,
  convertToStr,
  getPaymentWithUser,
  getGroupedUserPmts,
} = require("../correct");
const { user, payment } = require("../models");

describe("Testing Functions", () => {
  let testData;

  async function setupTestData() {
    const users = await user.create([
      {
        _id: "60d0fe4f5311236168a109ca",
        active: true,
        signup_date: new Date("2023-01-01"),
      },
      {
        _id: "60d0fe4f5311236168a109cb",
        active: true,
        signup_date: new Date("2023-02-15"),
      },
    ]);

    const payments = await payment.create([
      {
        _id: "70d0fe4f5311236168b209ca",
        name: "Payment 1",
        amount: 100,
        date: new Date("2023-01-01"),
        user: users[0]._id,
      },
      {
        _id: "70d0fe4f5311236168b209cb",
        name: "Payment 2",
        amount: 200,
        date: new Date("2023-02-10"),
        user: users[1]._id,
      },
    ]);

    return { users, payments };
  }

  async function cleanupTestData() {
    await payment.deleteMany({});
    await user.deleteMany({});
  }

  beforeAll(async () => {
    testData = await setupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  test("pullFirstUser - should return the first existing user", async () => {
    const userIds = testData.users.map((user) => user._id);
    const user = await pullFirstUser(userIds);
    expect(user).toBeDefined();
    expect(user._id.toString()).toBe(testData.users[0]._id.toString());
  });

  //   test("pullPaymentsForUsers - should return the correct payments for users", async () => {
  //     const paymentsForUsers = await pullPaymentsForUsers(testData.users);
  //     expect(paymentsForUsers).toHaveLength(2);
  //     expect(paymentsForUsers[0]).toEqual(
  //       expect.arrayContaining([
  //         expect.objectContaining({ user: testData.users[0]._id }),
  //       ])
  //     );
  //     expect(paymentsForUsers[1]).toEqual(
  //       expect.arrayContaining([
  //         expect.objectContaining({ user: testData.users[1]._id }),
  //       ])
  //     );
  //   });

  //   test("convertToStr - should convert numbers to strings and return undefined for invalid values", () => {
  //     expect(convertToStr(123)).toBe("123");
  //     expect(convertToStr("not a number")).toBeUndefined();
  //   });

  //   test("getPaymentWithUser - should return payment with associated user", async () => {
  //     const paymentWithUser = await getPaymentWithUser(testData.payments[0]._id);
  //     expect(paymentWithUser).toBeDefined();
  //     expect(paymentWithUser.user._id.toString()).toBe(
  //       testData.users[0]._id.toString()
  //     );
  //   });

  //   test("getGroupedUserPmts - should group payments by userId", async () => {
  //     const userIds = testData.users.map((user) => user._id.toString());
  //     const groupedPayments = await getGroupedUserPmts(userIds);
  //     expect(groupedPayments).toHaveProperty(testData.users[0]._id.toString());
  //     expect(groupedPayments).toHaveProperty(testData.users[1]._id.toString());
  //   });
});
