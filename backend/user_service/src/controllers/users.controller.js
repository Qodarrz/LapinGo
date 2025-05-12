import pool from "../services/db.js";
import { hashPass } from "../helpers/hashpassword.js";

export class UsersController {
  async getUsers(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query("SELECT * FROM users");

      const sanitizedData = result.map(({ password, ...user }) => user);
      res.json({
        status: 200,
        message: "success get data",
        data: sanitizedData,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async getUserById(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        "SELECT * FROM users WHERE user_id = ?",
        [req.params.id ?? 1]
      );

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const sanitizedData = result.map(({ password, ...user }) => user);
      res.json({
        status: 200,
        message: "success get data",
        data: sanitizedData,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async createUsers(req, res) {
    let connection;
    try {
      const { username, first_name, last_name, email, phone, password, role } =
        req.body;

      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Insert user
      const hashedPass = await hashPass(password);
      const [userResult] = await connection.query(
        "INSERT INTO users (username, first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [username, first_name, last_name, email, phone, hashedPass, role]
      );

      // Insert koin
      await connection.query(
        "INSERT INTO koin (user_id, amount) VALUES (?, ?)",
        [userResult.insertId, 0]
      );

      await connection.commit();

      res.json({
        status: 200,
        message: "Berhasil membuat user dan koin!",
        data: {
          user_id: userResult.insertId,
          username,
          email,
          role,
          koin: 0,
        },
      });
    } catch (error) {
      if (connection) await connection.rollback();
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async updateUsersPublic(req, res) {
    let connection;
    try {
      const { username, firstName, lastName, avatar, phone } = req.body;
      connection = await pool.getConnection();

      const [result] = await connection.query(
        "UPDATE users SET username = ?, first_name = ?, last_name = ?, avatar = ?, phone = ? WHERE user_id = ?",
        [username, firstName, lastName, avatar, phone, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ status: 200, message: "success update data", data: result });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

  async deleteUsers(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        "DELETE FROM users WHERE user_id = ?",
        [req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ status: 200, message: "success remove user", data: result });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    } finally {
      if (connection) connection.release();
    }
  }

}
