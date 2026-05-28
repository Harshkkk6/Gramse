const pool = require("../db");

const crypto = require("crypto");


// CREATE PAYMENT
const createPayment = async (req, res) => {

  try {

    const buyer_id = req.user.id;

    const { order_id } = req.body;

    // GET ORDER
    const orderResult = await pool.query(

      `
      SELECT *
      FROM orders
      WHERE id = $1
      `,

      [order_id]
    );

    const order = orderResult.rows[0];

    if (!order) {

      return res.status(404).json({
        error: "Order not found"
      });

    }

    // GENERATE MOCK TRANSACTION ID
    const transaction_id = crypto.randomBytes(10).toString("hex");

    // CREATE PAYMENT RECORD
    const paymentResult = await pool.query(

      `
      INSERT INTO payments
      (
        order_id,
        buyer_id,
        transaction_id,
        amount,
        payment_method
      )

      VALUES ($1,$2,$3,$4,$5)

      RETURNING *
      `,

      [
        order_id,
        buyer_id,
        transaction_id,
        order.total_amount,
        order.payment_method
      ]
    );

    res.status(201).json({

      message: "Payment session created",

      payment: paymentResult.rows[0]

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


// VERIFY PAYMENT
const verifyPayment = async (req, res) => {

  try {

    const { payment_id } = req.body;

    // UPDATE PAYMENT
    const paymentResult = await pool.query(

      `
      UPDATE payments

      SET status = 'PAID'

      WHERE id = $1

      RETURNING *
      `,

      [payment_id]
    );

    const payment = paymentResult.rows[0];

    // UPDATE ORDER
    await pool.query(

      `
      UPDATE orders

      SET payment_status = 'PAID'

      WHERE id = $1
      `,

      [payment.order_id]
    );

    res.status(200).json({

      message: "Payment verified",

      payment

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


module.exports = {

  createPayment,

  verifyPayment

};