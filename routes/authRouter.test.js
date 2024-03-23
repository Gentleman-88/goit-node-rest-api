import mongoose from "mongoose";
import request from "supertest";
import { findUser, deleteUsers } from "../services/authServices.js";
import dotenv from "dotenv";
import app from "../app.js";

describe("test /api/auth/signin route", () => {
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

  test("test /signin with correct data", async () => {
    const signinData = {
      email: "bron@gmail.com",
      password: "123456",
    };
    const { statusCode, body } = request(app)
      .post("api/auth/signin")
      .send(signinData);
    expect(statusCode).toBe(201);

    expect(body.email).toBe(signinData.email);
    expect(body.password).toBe(signinData.password);

    const user = await findUser({ email: signinData.email });
  });
});
