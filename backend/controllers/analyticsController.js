const pool = require("../db");
const { get } = require("../routes/farmRoutes");


// ADMIN ANALYTICS
const getAdminAnalytics = async (req, res) => {

  try {

    // TOTAL REVENUE
    const revenueResult = await pool.query(

      `
      SELECT COALESCE(SUM(total_amount), 0) AS total_revenue
      FROM orders
      WHERE payment_status = 'PAID'
      `
    );

    // TOTAL ORDERS
    const ordersResult = await pool.query(

      `
      SELECT COUNT(*) AS total_orders
      FROM orders
      `
    );

    // TOTAL FARMERS
    const farmersResult = await pool.query(

      `
      SELECT COUNT(*) AS total_farmers
      FROM users
      WHERE role = 'farmer'
      `
    );

    // TOTAL PARTNERS
    const partnersResult = await pool.query(

      `
      SELECT COUNT(*) AS total_partners
      FROM users
      WHERE role = 'partner'
      `
    );

    // TOTAL PRODUCTS
    const productsResult = await pool.query(

      `
      SELECT COUNT(*) AS total_products
      FROM products
      `
    );

    // TOTAL COMMISSIONS
    const commissionsResult = await pool.query(

      `
      SELECT COALESCE(SUM(commission_amount), 0)
      AS total_commissions

      FROM commissions
      `
    );

    res.status(200).json({

      analytics: {

        total_revenue:
          revenueResult.rows[0].total_revenue,

        total_orders:
          ordersResult.rows[0].total_orders,

        total_farmers:
          farmersResult.rows[0].total_farmers,

        total_partners:
          partnersResult.rows[0].total_partners,

        total_products:
          productsResult.rows[0].total_products,

        total_commissions:
          commissionsResult.rows[0].total_commissions

      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};

// PARTNER ANALYTICS
const getPartnerAnalytics = async (req, res) => {

  try {

    const partner_id = req.user.id;

    // TOTAL FARMERS
    const farmersResult = await pool.query(

      `
      SELECT COUNT(*) AS total_farmers

      FROM users

      WHERE role = 'farmer'
      AND partner_id = $1
      `,

      [partner_id]
    );

    // TOTAL PRODUCTS
    const productsResult = await pool.query(

      `
      SELECT COUNT(*) AS total_products

      FROM products

      WHERE partner_id = $1
      `,

      [partner_id]
    );

    // TOTAL COMMISSIONS
    const commissionsResult = await pool.query(

      `
      SELECT COALESCE(SUM(commission_amount), 0)
      AS total_commissions

      FROM commissions

      WHERE partner_id = $1
      `,

      [partner_id]
    );

    // TOTAL SALES
    const salesResult = await pool.query(

      `
      SELECT COALESCE(SUM(total_order_amount), 0)
      AS total_sales

      FROM commissions

      WHERE partner_id = $1
      `,

      [partner_id]
    );

    res.status(200).json({

      analytics: {

        total_farmers:
          farmersResult.rows[0].total_farmers,

        total_products:
          productsResult.rows[0].total_products,

        total_commissions:
          commissionsResult.rows[0].total_commissions,

        total_sales:
          salesResult.rows[0].total_sales

      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};

// FARMER ANALYTICS
const getFarmerAnalytics = async (req, res) => {

  try {

    const farmer_id = req.user.id;

    // TOTAL FARMS
    const farmsResult = await pool.query(

      `
      SELECT COUNT(*) AS total_farms

      FROM farms

      WHERE farmer_id = $1
      `,

      [farmer_id]
    );

    // TOTAL PRODUCTS
    const productsResult = await pool.query(

      `
      SELECT COUNT(*) AS total_products

      FROM products

      WHERE farmer_id = $1
      `,

      [farmer_id]
    );

    // TOTAL INVENTORY
    const inventoryResult = await pool.query(

      `
      SELECT COALESCE(SUM(quantity), 0)
      AS total_inventory

      FROM products

      WHERE farmer_id = $1
      `,

      [farmer_id]
    );

    // TOTAL SALES
    const salesResult = await pool.query(

      `
      SELECT COALESCE(SUM(total_order_amount), 0)
      AS total_sales

      FROM commissions

      WHERE farmer_id = $1
      `,

      [farmer_id]
    );

    res.status(200).json({

      analytics: {

        total_farms:
          farmsResult.rows[0].total_farms,

        total_products:
          productsResult.rows[0].total_products,

        total_inventory:
          inventoryResult.rows[0].total_inventory,

        total_sales:
          salesResult.rows[0].total_sales

      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};

// BUYER ANALYTICS
const getBuyerAnalytics = async (req, res) => {

  try {

    const buyer_id = req.user.id;

    // TOTAL ORDERS
    const ordersResult = await pool.query(

      `
      SELECT COUNT(*) AS total_orders

      FROM orders

      WHERE buyer_id = $1
      `,

      [buyer_id]
    );

    // TOTAL SPENDING
    const spendingResult = await pool.query(

      `
      SELECT COALESCE(SUM(total_amount), 0)
      AS total_spending

      FROM orders

      WHERE buyer_id = $1
      AND payment_status = 'PAID'
      `,

      [buyer_id]
    );

    // SUCCESSFUL PAYMENTS
    const paymentsResult = await pool.query(

      `
      SELECT COUNT(*) AS successful_payments

      FROM payments

      WHERE buyer_id = $1
      AND status = 'PAID'
      `,

      [buyer_id]
    );

    res.status(200).json({

      analytics: {

        total_orders:
          ordersResult.rows[0].total_orders,

        total_spending:
          spendingResult.rows[0].total_spending,

        successful_payments:
          paymentsResult.rows[0].successful_payments

      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


module.exports = {

  getAdminAnalytics,

  getPartnerAnalytics,

  getFarmerAnalytics,

  getBuyerAnalytics

};