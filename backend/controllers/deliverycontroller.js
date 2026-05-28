const pool = require("../db");


// CREATE DELIVERY AGENT
const createDeliveryAgent = async (req, res) => {

  try {

    const partner_id = req.user.id;

    const {
      name,
      phone,
      vehicle_type,
      vehicle_number
    } = req.body;

    const result = await pool.query(

      `
      INSERT INTO delivery_agents
      (
        name,
        phone,
        vehicle_type,
        vehicle_number,
        partner_id
      )

      VALUES ($1,$2,$3,$4,$5)

      RETURNING *
      `,

      [
        name,
        phone,
        vehicle_type,
        vehicle_number,
        partner_id
      ]
    );

    res.status(201).json({

      message: "Delivery agent created",

      agent: result.rows[0]

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


// ASSIGN DELIVERY AGENT
const assignDeliveryAgent = async (req, res) => {

  try {

    const order_id = req.params.id;

    const { delivery_agent_id } = req.body;

    // CHECK AGENT
    const agentResult = await pool.query(

      `
      SELECT *
      FROM delivery_agents
      WHERE id = $1
      `,

      [delivery_agent_id]
    );

    const agent = agentResult.rows[0];

    if (!agent) {

      return res.status(404).json({
        error: "Delivery agent not found"
      });

    }

    // CHECK AVAILABILITY
    if (!agent.availability) {

      return res.status(400).json({
        error: "Delivery agent unavailable"
      });

    }

    // ASSIGN TO ORDER
    const orderResult = await pool.query(

      `
      UPDATE orders

      SET
        delivery_agent_id = $1,
        status = 'OUT_FOR_DELIVERY'

      WHERE id = $2

      RETURNING *
      `,

      [
        delivery_agent_id,
        order_id
      ]
    );

    // UPDATE AGENT AVAILABILITY
    await pool.query(

      `
      UPDATE delivery_agents

      SET availability = false

      WHERE id = $1
      `,

      [delivery_agent_id]
    );

    // TRACKING EVENT
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
        "OUT_FOR_DELIVERY",
        `Assigned to delivery agent ${agent.name}`,
        req.user.id
      ]
    );

    res.status(200).json({

      message: "Delivery agent assigned",

      order: orderResult.rows[0]

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

};


module.exports = {

  createDeliveryAgent,

  assignDeliveryAgent

};