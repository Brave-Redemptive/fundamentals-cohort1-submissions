import registerUser from "../../src/services/auth/registerService.js";
import bcrypt from "bcryptjs";
import validateRegistrationInput from "../../src/utils/validation.js";
import { UserRepository } from "../../src/repositories/user.repository.js";
import { UserSchema } from "../../src/validators/user.validator.js";

jest.mock("bcryptjs");
jest.mock("../../src/utils/validation.js");
jest.mock("../../src/repositories/user.repository.js");
jest.mock("../../src/validators/user.validator.js");

describe("registerUser - unit tests", () => {
  const mockRes: any = {
    cookie: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1 — Validation fails
  test("should fail if registration input is invalid", async () => {
    (validateRegistrationInput as jest.Mock).mockReturnValue({
      valid: false,
      errors: ["Invalid email"],
      sanitized: {},
    });

    const result = await registerUser("John", "bademail", "1234", "CLIENT", mockRes);

    expect(result.is).toBe("failure");
    if (result.is === "failure") {
      expect(result.error.message).toBe("Invalid email");
      expect(result.error.status).toBe(400);
    }
  });

  // 2 — User already exists
  test("should fail if user with email already exists", async () => {
    (validateRegistrationInput as jest.Mock).mockReturnValue({
      valid: true,
      sanitized: { name: "John", email: "test@example.com", password: "pass123" },
      errors: [],
    });

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue({ id: "111" });

    const result = await registerUser("John", "test@example.com", "pass123", "CLIENT", mockRes);

    expect(result.is).toBe("failure");
    if (result.is === "failure") {
      expect(result.error.message).toBe("User already exists");
      expect(result.error.status).toBe(409);
    }
  });

  // 3 — Should hash password and parse data
  test("should hash password before saving", async () => {
    (validateRegistrationInput as jest.Mock).mockReturnValue({
      valid: true,
      sanitized: { name: "John", email: "john@mail.com", password: "raw123" },
      errors: [],
    });

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pw");
    (UserSchema.parse as jest.Mock).mockReturnValue({
      name: "John",
      email: "john@mail.com",
      password: "hashed_pw",
    });

    (UserRepository.create as jest.Mock).mockResolvedValue({
      id: "1",
      name: "John",
      email: "john@mail.com",
      role: "CLIENT",
    });

    const result = await registerUser("John", "john@mail.com", "raw123", "CLIENT", mockRes);

    expect(bcrypt.hash).toHaveBeenCalledWith("raw123", 10);

    expect(result.is).toBe("success");
    if (result.is === "success") {
      expect(result.value).toEqual({
        id: "1",
        name: "John",
        email: "john@mail.com",
        role: "CLIENT",
      });
    }
  });

  // 4 — Should call UserRepository.create with parsed data
  test("should call UserRepository.create with parsed user data", async () => {
    const sanitized = { name: "Jane", email: "jane@mail.com", password: "123456" };

    (validateRegistrationInput as jest.Mock).mockReturnValue({
      valid: true,
      sanitized,
      errors: [],
    });

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pw");
    (UserSchema.parse as jest.Mock).mockReturnValue({ ...sanitized, password: "hashed_pw" });
    (UserRepository.create as jest.Mock).mockResolvedValue({
      id: "22",
      name: sanitized.name,
      email: sanitized.email,
      role: "CLIENT",
    });

    await registerUser("Jane", "jane@mail.com", "123456", "CLIENT", mockRes);

    expect(UserRepository.create).toHaveBeenCalledWith({
      name: "Jane",
      email: "jane@mail.com",
      password: "hashed_pw",
    });
  });

  // 5 — Should return correct public user data
  test("should return user id, name, email, role", async () => {
    (validateRegistrationInput as jest.Mock).mockReturnValue({
      valid: true,
      sanitized: { name: "Sam", email: "sam@mail.com", password: "xyzz" },
      errors: [],
    });

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pw");
    (UserSchema.parse as jest.Mock).mockReturnValue({
      name: "Sam",
      email: "sam@mail.com",
      password: "hashed_pw",
    });
    (UserRepository.create as jest.Mock).mockResolvedValue({
      id: "abc123",
      name: "Sam",
      email: "sam@mail.com",
      role: "CLIENT",
    });

    const result = await registerUser("Sam", "sam@mail.com", "xyzz", "CLIENT", mockRes);

    expect(result.is).toBe("success");
    if (result.is === "success") {
      expect(result.value).toEqual({
        id: "abc123",
        name: "Sam",
        email: "sam@mail.com",
        role: "CLIENT",
      });
    }
  });
});
