// TravelForm.js
import React, { useEffect, useState } from "react";
import "./TravelForm.css";
import axios from "axios";

export default function TravelForm() {
  const [dob, setDob] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [coverageArea, setCoverageArea] = useState([]);
  const [coveragePeriod, setCoveragePeriod] = useState([]);

  const [daysDifference, setDaysDifference] = useState(null);
  const [age, setAge] = useState(null);

  useEffect(() => {
    const fetchAPiData = async () => {
      try {
        // Fetch data from the first API
        const response = await axios.get(
          "https://localhost:7110/api/TravelRegions"
        );
        setCoverageArea(response.data);
        // Set the global variable
        // coverAreadata = response.data;

        // Fetch data from the second API
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAPiData();
  }, []);

  // console.log(coverAreadata);

  useEffect(() => {
    // Calculate the difference in days when either startingDate or endingDate changes
    const calculateDaysDifference = () => {
      if (startingDate && endingDate) {
        const startDate = new Date(startingDate);
        const endDate = new Date(endingDate);
        const differenceInTime = endDate.getTime() - startDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        setDaysDifference(differenceInDays);
      }
    };

    calculateDaysDifference();
  }, [startingDate, endingDate]);

  // calculate age

  useEffect(() => {
    const calculateAge = () => {
      if (dob) {
        const birthDate = new Date(dob);
        const currentDate = new Date();
        const ageDifference =
          currentDate.getFullYear() - birthDate.getFullYear();
        setAge(ageDifference);
      }
    };

    calculateAge();
  }, [dob]);

  return (
    <div className="container">
      <h1>Travel Insurance Form</h1>

      <form className="form">
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            className="form-control"
            id="dob"
            value={dob}
            onChange={(event) => setDob(event.target.value)}
            placeholder="Enter Date of Birth"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startingDate">Starting Date:</label>
          <input
            type="date"
            className="form-control"
            id="startingDate"
            value={startingDate}
            onChange={(event) => setStartingDate(event.target.value)}
            placeholder="Enter Starting Date"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endingDate">Ending Date:</label>
          <input
            type="date"
            className="form-control"
            id="endingDate"
            value={endingDate}
            onChange={(event) => setEndingDate(event.target.value)}
            placeholder="Enter Ending Date"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="coverageArea">Coverage Area:</label>
          <select className="form-control" id="coverageArea" required>
            {/* <option value="option1">Africa</option> */}
            {coverageArea.map((areas) => (
              <option key={areas.rid} value={areas.region}>
                {areas.region}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="Coverage_Period">Coverage Period:</label>
          <select className="form-control" id="Coverage_Period" required>
            <option value="optionA">Up to 7 days</option>
            <option value="optionB">Option B</option>
            <option value="optionC">Option C</option>
          </select>
        </div>

        <h1>dob:{dob}</h1>
        <h1>Number of days : {daysDifference}</h1>
        <h1>Age: {age}</h1>

        {/* <div className="form-group">
          <label htmlFor="select3">Select Option 3:</label>
          <select className="form-control" id="select3" required>
            <option value="valueX">Value X</option>
            <option value="valueY">Value Y</option>
            <option value="valueZ">Value Z</option>
          </select>
        </div> */}

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
