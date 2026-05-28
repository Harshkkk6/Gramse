"use client";

import { useState } from "react";
import axios from "axios";

export default function AddFarmerPage() {

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    aadhaar_number: "",
    pan_number: "",
    bank_account: "",
    ifsc: "",
    address: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const response = await axios.post(

        "http://localhost:5000/api/farmer/create",

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      alert("Farmer created successfully");

      console.log(response.data);

    } catch (error) {

      console.log(error);

      alert("Error creating farmer");

    }

  };

  return (

    <div style={{ padding: "20px" }}>

      <h1>Add Farmer</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="aadhaar_number"
          placeholder="Aadhaar"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="pan_number"
          placeholder="PAN"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="bank_account"
          placeholder="Bank Account"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="ifsc"
          placeholder="IFSC"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Create Farmer
        </button>

      </form>

    </div>

  );

}