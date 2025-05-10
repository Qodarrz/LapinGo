import connection from "../services/db.js";
import { hashPass } from "../helpers/hashpassword.js";
import midtransClient from "midtrans-client"

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export class UsersController {
  async getUsers (req, res) {
    try {
      const sqlDataGet = 'SELECT * FROM users';
      connection.query(sqlDataGet, (err, result) => {
        if (err) res.json({"error": err})
        if (result) {
          const sanitizedData = result.map(({ password, ...user }) => user);
    
          res.json({ status: 200, message: 'success get data', data: sanitizedData })
        }
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async getUserById (req, res) {
    try {
      const sqlDataGet = 'SELECT * FROM users WHERE user_id = ?';
      connection.query(sqlDataGet, [req.params.id ?? 1], (err, result) => {
        if (err) res.json({"error": err})
        if (result) {
          const sanitizedData = result.map(({ password, ...user }) => user);
    
          res.json({ status: 200, message: 'success get data', data: sanitizedData })
        }
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createUsers (req, res) {
    try {
      const { 
        username,
        first_name,
        last_name,
        email,
        phone,
        password,
        role
      } = req.body
      const sqlCreateData = 'INSERT INTO users (username, first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const sqlCreateKoin = 'INSERT INTO koin (user_id, amount) VALUES (?, ?)';
      const hashedPass = await hashPass(password)
      console.log(req.body)
      connection.query(sqlCreateData, [username, first_name, last_name, email, phone, hashedPass, role], (err, result) => {
        if (err) res.status(500).json({"error": err})
        if (!result) {
          return res.status(400).json({ message: "User not found" });
        }
        const userId = result.insertId; // ambil user_id yang baru dibuat

        connection.query(sqlCreateKoin, [userId, 0], (errKoin, resultKoin) => {
          if (errKoin) return res.json({ error: errKoin });

          res.json({
            status: 200,
            message: 'Berhasil membuat user dan koin!',
            data: {
              user_id: userId,
              username,
              email,
              role,
              koin: 0
            }
          });
        });
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updateUsersPublic (req, res) {
    try {
      const { username, firstName, lastName, avatar, phone } = req.body

      const sqlUpdateData = 'UPDATE users set username = ?, first_name = ?, last_name = ?, avatar = ?, phone = ? WHERE user_id = ?';
      connection.query(sqlUpdateData, [username, firstName, lastName, avatar, phone, req.params.id], (err, result) => {
        if (err) res.json({"error": err})
        if (!result) {
          return res.status(400).json({ message: "Cannot update users" });
        }
        res.json({ status: 200, message: 'success update data', data: result })
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteUsers (req, res) {
    try {
      const sqlDeleteData = 'DELETE FROM users WHERE user_id = ?';
      connection.query(sqlDeleteData, [req.params.id], (err, result) => {
        res.json({ status: 200, message: 'success remove user', data: result })
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async getKoins (req, res) {
    try {
      const sqlDataGet = 'SELECT * FROM koin';
      connection.query(sqlDataGet, (err, result) => {
        if (err) res.json({"error": err})
        if (result) {
          const sanitizedData = result.map(({ password, ...user }) => user);
    
          res.json({ status: 200, message: 'success get data', data: sanitizedData })
        }
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async getKoinById (req, res) {
    try {
      const sqlDataGet = 'SELECT * FROM koin WHERE id = ?';
      connection.query(sqlDataGet, [req.params.id ?? 1], (err, result) => {
        if (err) res.json({"error": err})
        if (result) {
          const sanitizedData = result.map(({ password, ...user }) => user);
    
          res.json({ status: 200, message: 'success get data', data: sanitizedData })
        }
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createKoin (req, res) {
    try {
      const { 
        user_id,
        amount,
      } = req.body
      const sqlCreateData = 'INSERT INTO koin (user_id, amount) VALUES (?, ?)';

      connection.query(sqlCreateData, [user_id, amount], (err, result) => {
        if (!result) {
          return res.status(400).json({ message: "User not found" });
        }
        res.json({
          status: 200,
          message: 'Berhasil membuat koin!',
          data: {
            user_id,
            amount,
          }
        });
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async bayarPenukaranKoin (req, res) {
    try {
      const { idOrder, productId, productName, price, userId, userName, email, nomor_tujuan } = req.body;
  
      // Hitung total harga item
      const parsedPrice = parseInt(price);
      const parsedQty = 1;
      const itemTotal = parsedPrice * 1;
  
      // Hitung pajak dan biaya layanan
      const taxAmount = itemTotal * (10 / 100); // 10% pajak
      const serviceCharge = itemTotal * (2 / 100); // 2% biaya layanan
      
      // Hitung gross amount
      var grossAmount = itemTotal + taxAmount + serviceCharge;
  
      const parameter = {
        transaction_details: {
          order_id: idOrder,
          gross_amount: grossAmount, // Harus sama dengan total item_details
        },
        item_details: [
          {
            id: productId,
            price: parsedPrice,
            quantity: parsedQty,
            name: productName,
          },
          {
            id: 'tax',
            price: Math.round(taxAmount), // Pajak
            quantity: 1,
            name: 'Tax (10%)',
          },
          {
            id: 'service_charge',
            price: Math.round(serviceCharge), // Biaya layanan
            quantity: 1,
            name: 'Service Charge (2%)',
          },
        ],
        customer_details: {
          first_name: userName,
          nomor_tujuan,
          email: `${email}`, // Ganti dengan email aktual
        },
      };
  
      const transaction = await snap.createTransaction(parameter);
      res.status(200).json({ token: transaction.token, redirect_url: transaction.redirect_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create transaction', details: error.message });
    }
  }

  async updateKoin (req, res) {
    try {
      const { amount } = req.body

      const sqlGetData = 'SELECT * FROM koin WHERE user_id = ?';
      const sqlUpdateData = 'UPDATE koin set amount = ? WHERE user_id = ?';

      connection.query(sqlGetData, [req.params.id], (err, result) => {
        if (err) {
          return res.status(400).json({ message: "koin not found" });
        }

        const newAmount = result[0].amount + amount
        
        connection.query(sqlUpdateData, [newAmount, req.params.id], (err, result) => {
          if (!result) {
            return res.status(400).json({ message: "Cannot update koin" });
          }
          return res.status(200).json({ message: 'success update data', data: result })
        })
      })

    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteKoin (req, res) {
    try {
      const sqlDeleteData = 'DELETE FROM koin WHERE user_id = ?';
      connection.query(sqlDeleteData, [req.params.id], (err, result) => {
        return res.status(200).json({ message: 'success remove koin', data: result })
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}
