const {
  pullFirstUser,
  pullPaymentsForUsers,
  convertToStr,
  getPaymentWithUser,
  getGroupedUserPmts,
} = require("../correct");
const { user, payment, connection } = require("../models");

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

  beforeEach(async () => {
    await cleanupTestData();
    testData = await setupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await connection.close();
  });

  describe("pullFirstUser", () => {
    test("should return the first existing user", async () => {
      const userIds = testData.users.map((user) => user._id);
      const user = await pullFirstUser(userIds);
      expect(user).toBeDefined();
      expect(user._id.toString()).toBe(testData.users[0]._id.toString());
    });

    test("should return null if no user is found", async () => {
      const nonExistentIds = [
        "60d0fe4f5311236168a109c9",
        "60d0fe4f5311236168a109c8",
      ];
      const user = await pullFirstUser(nonExistentIds);
      expect(user).toBeNull();
    });

    test("should return the first user from mixed valid and invalid ids", async () => {
      const userIds = [
        "60d0fe4f5311236168a109c9",
        testData.users[0]._id.toString(),
        "60d0fe4f5311236168a109c8",
      ];
      const user = await pullFirstUser(userIds);
      expect(user).toBeDefined();
      expect(user._id.toString()).toBe(testData.users[0]._id.toString());
    });
  });

  describe("pullPaymentsForUsers", () => {
    test("should return the correct payments for users", async () => {
      const paymentsForUsers = await pullPaymentsForUsers(testData.users);
      expect(paymentsForUsers).toHaveLength(2);
      expect(paymentsForUsers[0]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ user: testData.users[0]._id }),
        ])
      );
      expect(paymentsForUsers[1]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ user: testData.users[1]._id }),
        ])
      );
    });

    test("should return an empty array for a user with no payments", async () => {
      const newUser = await user.create({
        _id: "60d0fe4f5311236168a109cc",
        active: true,
        signup_date: new Date("2023-03-01"),
      });
      const paymentsForUsers = await pullPaymentsForUsers([newUser]);
      expect(paymentsForUsers[0]).toHaveLength(0);
    });
  });

  describe("convertToStr", () => {
    test("should convert numbers to strings", () => {
      expect(convertToStr(123)).toBe("123");
      expect(convertToStr(-123)).toBe("-123");
    });

    test("should return undefined for non-numeric values", () => {
      expect(convertToStr("not a number")).toBeUndefined();
      expect(convertToStr(null)).toBeUndefined();
      expect(convertToStr(undefined)).toBeUndefined();
    });

    test("should return undefined for NaN values", () => {
      expect(convertToStr(NaN)).toBeUndefined();
    });
  });

  describe("getPaymentWithUser", () => {
    test("should return payment with associated user", async () => {
      const paymentWithUser = await getPaymentWithUser(
        testData.payments[0]._id
      );
      expect(paymentWithUser).toBeDefined();
      expect(paymentWithUser.user._id.toString()).toBe(
        testData.users[0]._id.toString()
      );
    });

    test("should return null if payment is not found", async () => {
      const paymentWithUser = await getPaymentWithUser(
        "60d0fe4f5311236168a109c9"
      );
      expect(paymentWithUser).toBeNull();
    });
  });

  describe("getGroupedUserPmts", () => {
    test("should group payments by userId", async () => {
      const userIds = testData.users.map((user) => user._id.toString());
      const groupedPayments = await getGroupedUserPmts(userIds);
      expect(groupedPayments).toHaveProperty(testData.users[0]._id.toString());
      expect(groupedPayments).toHaveProperty(testData.users[1]._id.toString());
    });

    test("should return an empty array if no active payments are found", async () => {
      const userIds = testData.users.map((user) => user._id.toString());
      await payment.updateMany({}, { $set: { active: false } });
      const groupedPayments = await getGroupedUserPmts(userIds);
      expect(groupedPayments).toEqual({
        [testData.users[0]._id.toString()]: [],
        [testData.users[1]._id.toString()]: [],
      });
    });

    test("should return empty arrays if no payments are found for a user", async () => {
      const newUser = await user.create({
        _id: "60d0fe4f5311236168a109cd",
        active: true,
        signup_date: new Date("2023-03-10"),
      });
      const userIds = [
        ...testData.users.map((user) => user._id.toString()),
        newUser._id.toString(),
      ];
      const groupedPayments = await getGroupedUserPmts(userIds);
      expect(groupedPayments[newUser._id.toString()]).toHaveLength(0);
    });
  });
});
