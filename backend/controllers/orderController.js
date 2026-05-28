const pool = require("../db");


// PLACE ORDER
const placeOrder = async (req, res) => {

  try {

    const buyer_id = req.user.id;

    const {
      items,
      delivery_address,
      payment_method
    } = req.body;

    let total_amount = 0;

    // VALIDATE PRODUCTS + STOCK
    for (const item of items) {

      const productResult = await pool.query(

        `
        SELECT *
        FROM products
        WHERE id = $1
        `,

        [item.product_id]
      );

      const product = productResult.rows[0];

      // CHECK PRODUCT EXISTS
      if (!product) {

        return res.status(404).json({
          error: "Product not found"
        });

      }

      // CHECK STOCK
      if (
        Number(item.quantity) >
        Number(product.quantity)
      ) {

        return res.status(400).json({

          error:
            `Only ${product.quantity} ${product.unit} available for ${product.product_name}`

        });

      }

      total_amount +=
        Number(product.price_per_unit) *
        Number(item.quantity);
    }

    // CREATE ORDER
    const orderResult = await pool.query(

      `
      INSERT INTO orders
      (
        buyer_id,
        total_amount,
        delivery_address,
        payment_method
      )

      VALUES ($1,$2,$3,$4)

      RETURNING *
      `,

      [
        buyer_id,
        total_amount,
        delivery_address,
        payment_method
      ]
    );

    const order = orderResult.rows[0];


    // GET FIRST PRODUCT
    const firstProductResult = await pool.query(

      `
      SELECT *
      FROM products
      WHERE id = $1
      `,

      [items[0].product_id]
    );

    const firstProduct = firstProductResult.rows[0];


    // COMMISSION SETTINGS
    const commission_percentage = 3;


    // CALCULATE COMMISSION
    const commission_amount =

      (Number(total_amount) * commission_percentage) / 100;


    // CREATE COMMISSION RECORD
    await pool.query(

      `
      INSERT INTO commissions
      (
        partner_id,
        order_id,
        farmer_id,
        total_order_amount,
        commission_percentage,
        commission_amount
      )

      VALUES ($1,$2,$3,$4,$5,$6)
      `,

      [
        firstProduct.partner_id,
        order.id,
        firstProduct.farmer_id,
        total_amount,
        commission_percentage,
        commission_amount
      ]
    );


    // INITIAL TRACKING EVENT
    await pool.query(

      `
      INSERT INTO order_tracking
      (
        order_id,
        status,
        note,
        updated_by
      )

      VALUES ($1,$2,$3,$4)
      `,

      [
        order.id,
        "PLACED",
        "Order placed successfully",
        buyer_id
      ]
    );


    // CREATE ORDER ITEMS + REDUCE STOCK
    for (const item of items) {

      const productResult = await pool.query(

        `
        SELECT *
        FROM products
        WHERE id = $1
        `,

        [item.product_id]
      );

      const product = productResult.rows[0];

      // INSERT ORDER ITEM
      await pool.query(

        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          quantity,
          price
        )

        VALUES ($1,$2,$3,$4)
        `,

        [
          order.id,
          item.product_id,
          item.quantity,
          product.price_per_unit
        ]
      );

      // REDUCE STOCK
      await pool.query(

        `
        UPDATE products

        SET quantity = quantity - $1

        WHERE id = $2
        `,

        [
          item.quantity,
          item.product_id
        ]
      );
    }

    res.status(201).json({

      message: "Order placed successfully",

      order

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


// GET MY ORDERS
const getMyOrders = async (req, res) => {

  try {

    const buyer_id = req.user.id;

    const result = await pool.query(

      `
      SELECT *
      FROM orders
      WHERE buyer_id = $1
      ORDER BY id DESC
      `,

      [buyer_id]
    );

    res.status(200).json({
      orders: result.rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {

  try {

    const order_id = req.params.id;

    const { status } = req.body;

    // UPDATE ORDER
    const result = await pool.query(

      `
      UPDATE orders

      SET status = $1

      WHERE id = $2

      RETURNING *
      `,

      [status, order_id]
    );

    // INSERT TRACKING HISTORY
    await pool.query(

      `
      INSERT INTO order_tracking
      (
        order_id,
        status,
        note,
        updated_by
      )

      VALUES ($1,$2,$3,$4)
      `,

      [
        order_id,
        status,
        `Order marked as ${status}`,
        req.user.id
      ]
    );

    res.status(200).json({

      message: "Order status updated",

      order: result.rows[0]

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


// TRACK ORDER
const trackOrder = async (req, res) => {

  try {

    const order_id = req.params.id;

    const result = await pool.query(

      `
      SELECT *
      FROM order_tracking

      WHERE order_id = $1

      ORDER BY created_at ASC
      `,

      [order_id]
    );

    res.status(200).json({

      tracking: result.rows

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


module.exports = {

  placeOrder,

  getMyOrders,

  updateOrderStatus,

  trackOrder

};