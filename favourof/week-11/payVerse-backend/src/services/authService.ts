import pool from "../config/database";
import { CreateUserDTO, LoginDTO } from "../models/userModel";
import { hashPassword, comparePassword } from "../utils/passwordUtil";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtil";

class AuthService {
  async register(userData: CreateUserDTO) {
    const { email, password, full_name } = userData;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("User with this email already exists");
    }

    const password_hash = await hashPassword(password);

    const account_number =
      "ACC" + Date.now() + Math.floor(Math.random() * 1000);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, full_name) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [email, password_hash, full_name]
      );

      const user = userResult.rows[0];

      await client.query(
        `INSERT INTO accounts (user_id, account_number, balance) 
         VALUES ($1, $2, $3)`,
        [user.id, account_number, 1000.0]
      );

      await client.query("COMMIT");

      return {
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          account_number: account_number,
        },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async login(loginData: LoginDTO) {
    const { email, password } = loginData;

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = userResult.rows[0];

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [
      user.id,
    ]);

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    const accountResult = await pool.query(
      "SELECT * FROM accounts WHERE user_id = $1",
      [user.id]
    );

    const account = accountResult.rows[0];

    return {
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        account_number: account.account_number,
        balance: account.balance,
      },
    };
  }
}

export default new AuthService();
export { AuthService };
