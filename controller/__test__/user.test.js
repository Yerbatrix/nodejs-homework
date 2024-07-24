const supertest = require("supertest");
const db = require("../../db");
const app = require("../../app");
const { User } = require("../../service/schemas/user");
jest.mock("../../email/sendEmail");

describe("Users controller", () => {
  beforeAll(() => db.connect(process.env.DB_HOST));

  test("create user", async () => {
    const email = "test@test.pl";
    const password = "testpassword";

    const res = await supertest(app)
      .post("/api/users/signup")
      .send({ email, password })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", email);
    expect(res.body.user).toHaveProperty("subscription", "starter");
    expect(res.body.user).toHaveProperty("verify", false);
    expect(res.body.user).toHaveProperty("verificationToken");
  });

  test("login user", async () => {
    const email = "test@test.pl";
    const password = "testpassword";

    await supertest(app)
      .post("/api/users/signup")
      .send({ email, password })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    const res = await supertest(app)
      .post("/api/users/login")
      .send({ email, password })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", email);
    expect(res.body.user).toHaveProperty("subscription", "starter");
  });

  afterAll(async () => {
    await User.deleteMany({});
    await db.disconnect();
  });
});
