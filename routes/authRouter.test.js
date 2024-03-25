import mongoose from "mongoose";
import request from "supertest";
import { findUser, deleteUsers, signup } from "../services/authServices.js";
import app from "../app.js";
import bcrypt from "bcrypt";

describe("test /register route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_HOST);
    server = app.listen(3000);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await deleteUsers({});
  });

  test("test /register with correct data", async () => {
    const signupData = {
      email: "bron@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/user/register")
      .send(signupData);
    expect(statusCode).toBe(201);

    expect(body.password).toBe(signupData.password);
    expect(body.email).toBe(signupData.email);

    const user = await findUser({ email: signupData.email });
    expect(user.password).toBe(signupData.password);
  });
});

describe("test /signin route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_HOST);
    server = app.listen(3000);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await deleteUsers({});
  });

  test("test /signin with correct credentials", async () => {
    const user = await signup({
      email: "bron@gmail.com",
      password: await bcrypt.hash("123456", 10),
    });

    const signinData = {
      email: "bron@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/user/signin")
      .send(signinData);
    expect(statusCode).toBe(200);

    expect(body.password).toBe(user.password);
    expect(body.email).toBe(user.email);
  });

  test("test /signin with incorrect password", async () => {
    await signup({
      email: "bron@gmail.com",
      password: await bcrypt.hash("123456", 10),
    });

    const signinData = {
      email: "bron@gmail.com",
      password: "incorrectpassword",
    };

    const { statusCode } = await request(app)
      .post("/api/user/signin")
      .send(signinData);
    expect(statusCode).toBe(401);
  });

  test("test /signin with incorrect email", async () => {
    await signup({
      email: "bron@gmail.com",
      password: await bcrypt.hash("123456", 10),
    });

    const signinData = {
      email: "incorrect@gmail.com",
      password: "123456",
    };

    const { statusCode } = await request(app)
      .post("/api/user/signin")
      .send(signinData);
    expect(statusCode).toBe(401);
  });
});
