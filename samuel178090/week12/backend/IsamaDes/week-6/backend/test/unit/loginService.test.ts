

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import loginUser from "../../src/services/auth/loginService";
import sendAuthCookies from "../../src/utils/cookiesStore";
import { UserRepository } from "../../src/repositories/user.repository";
import type { Response } from "express";


jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../src/utils/cookiesStore");


jest.mock("../../src/repositories/user.repository", () => ({
  UserRepository: {
    findByEmail: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  },
}));

describe("loginUser Service", () => {
  const mockRes = {
    cookie: jest.fn(),
  } as unknown as Response;

  const baseUser = {
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
    password: "hashedpass",
    role: "CLIENT",
    loginAttempts: 0,
    lockUntil: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
    process.env.JWT_REFRESH_SECRET = "refreshsecret";
  });

  // TEST 1 — Missing fields
  test("should fail if email or password is missing", async () => {
   const result = await loginUser("", "123456", mockRes)
   expect(result.is).toBe("failure");
   if (result.is === "failure") {
    expect(result.error.message).toBe("Email and password required");
  }
    const result2 = await loginUser("john@example.com", "", mockRes);
    expect(result2.is).toBe("failure");
      if (result.is === "failure") {
    expect(result.error.message).toBe("Email and password required");
  }
  });

  // TEST 2 — User not found
  test("should fail if user not found", async () => {
    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    const result = await loginUser("notfound@example.com", "123456", mockRes)
    expect(result.is).toBe("failure");
    if(result.is == "failure"){
      expect(result.error.message).toBe("User not found");
      expect(result.error.status).toBe(404);
    }
  });

  // TEST 3 — Account locked
  test("should fail if account is locked", async () => {
    const lockedUser = {
      ...baseUser,
      lockUntil: new Date(Date.now() + 10 * 60000), // 10 min from now
    };

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(lockedUser);
      const result = await loginUser(lockedUser.email, "123456", mockRes);
      expect(result.is).toBe("failure");
      if(result.is === "failure"){
        expect(result.error.message).toBe("Account locked. Try again in 10 minutes");
      }
  });

  // TEST 4 — Wrong password increments attempts
  test("should increment loginAttempts on invalid password", async () => {
    const userClone = { ...baseUser, loginAttempts: 1 };

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(userClone);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    (UserRepository.save as jest.Mock).mockResolvedValue(userClone);

    const result = await loginUser(userClone.email, "wrongpass", mockRes);

  expect(result.is).toBe("failure");
  if (result.is === "failure") {
    expect(result.error.message).toBe("Invalid credentials");
    expect(result.error.status).toBe(401);
  }

  expect(UserRepository.save).toHaveBeenCalledTimes(1);
  expect(userClone.loginAttempts).toBe(2);
  });

  // TEST 5 — Successful login resets attempts & sets cookies
  test("should login successfully and return user data", async () => {
    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(baseUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (UserRepository.update as jest.Mock).mockResolvedValue(baseUser);

    (jwt.sign as jest.Mock).mockReturnValue("FAKE_TOKEN");

    const result = await loginUser(
      baseUser.email,
      "correctpass",
      mockRes
    );

    expect(UserRepository.update).toHaveBeenCalledWith(baseUser.id, {
      loginAttempts: 0,
      lockUntil: null,
    });

    expect(sendAuthCookies).toHaveBeenCalledWith(
      mockRes,
      "FAKE_TOKEN",
      "FAKE_TOKEN"
    );

  
if (result.is === "success") {
  expect(result.value.email).toBe(baseUser.email);
}  });
});
