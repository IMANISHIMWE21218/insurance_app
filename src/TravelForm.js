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

  const [selectedCoverageArea, setSelectedCoverageArea] = useState("");
  const [selectedCoveragePeriod, setSelectedCoveragePeriod] = useState("");

  const [coverRatesData, setCoverRatesData] = useState([]);

  const [reinPrimeum, setreinPrimeum] = useState(0);

  const [netPremium, setNetPremium] = useState(0);
  const [grossPremium, setGrossPremium] = useState(0);

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
        const response2 = await axios.get(
          "https://localhost:7110/api/TravelCoverPeriods"
        );
        setCoveragePeriod(response2.data);

        //
        // console.table(response2.data);

        //end
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

  // Getting amount for * with exchange rate

  let amount = 0;
  let adminfees = 4500;
  let NETPREMIUM = 0;

  useEffect(() => {
    console.log("start from here.");
    const fetchCoverRatesData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7110/api/TravelRates"
        );

        console.log("Response data:", response.data);

        // Filter the data based on selected CPID and RID
        const filteredData = response.data.filter(
          (item) =>
            item.cpid === selectedCoveragePeriod &&
            item.rid === selectedCoverageArea
        );

        if (filteredData.length > 0) {
          amount = filteredData[0].amount;
          console.log("amamaaa" + amount);
          setCoverRatesData(filteredData);
          let exchangeRate = 1201;
          let reinPrimeumSUM = amount * exchangeRate;
          reinPrimeumSUM = reinPrimeumSUM.toFixed(2);
          console.log("summm:" + reinPrimeumSUM);
          setreinPrimeum(reinPrimeumSUM);

          NETPREMIUM = parseFloat(reinPrimeumSUM) + adminfees;
          console.log("netttt" + NETPREMIUM);
          setNetPremium(NETPREMIUM);

          // Calculate GROSSPREMIUM
          let GrossPremium = NETPREMIUM * 1.18;
          console.log("GROSSPREMIUM: " + GrossPremium);
          console.log("Age:", age);

          // Reduce GROSSPREMIUM by 50% if age is between 3 months and 18 years
          if (age > 0.25 && age <= 18) {
            GrossPremium *= 0.5;
          }
          // Increase GROSSPREMIUM by 50% if age is between 66 and 75 years
          else if (age >= 66 && age <= 75) {
            GrossPremium *= 1.5;
          }
          // Increase GROSSPREMIUM by 100% if age is between 76 and 80 years
          else if (age >= 76 && age <= 80) {
            GrossPremium *= 2;
          }
          // Increase GROSSPREMIUM by 300% if age is 81 years or older
          else if (age >= 81) {
            GrossPremium *= 4;
          }

          console.log("GROSSPREMIUM over 0%: " + GrossPremium);

          setGrossPremium(GrossPremium);
        } else {
          console.log("No data found for the selected criteria.");
          setCoverRatesData([]); // Set an empty array or handle as needed
        }
      } catch (error) {
        console.error("Error fetching cover rates data:", error);
      }
    };

    fetchCoverRatesData();
  }, [selectedCoverageArea, selectedCoveragePeriod, age]);

  console.log("selectedCoverageArea:", selectedCoverageArea);
  console.log("selectedCoveragePeriod:", selectedCoveragePeriod);

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
          <select
            className="form-control"
            id="coverageArea"
            value={selectedCoverageArea}
            onChange={(event) => setSelectedCoverageArea(event.target.value)}
            required
          >
            {coverageArea.map((regio) => (
              <option key={regio.rid} value={regio.rid}>
                {regio.region}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="CoveragePeriod">Coverage Period:</label>
          <select
            className="form-control"
            id="CoveragePeriod"
            value={selectedCoveragePeriod}
            onChange={(event) => setSelectedCoveragePeriod(event.target.value)}
            required
          >
            <option value="optionA">Up to 7 days</option>
            {coveragePeriod.map((period) => (
              <option key={period.cpid} value={period.cpid}>
                {period.description}
              </option>
            ))}
          </select>
        </div>
        <h1>dob:{dob}</h1>
        <h1>Number of days : {daysDifference}</h1>
        <h1>Age: {age}</h1>
        <h1>REINS. PREM: {reinPrimeum}</h1>
        <h1>NETPREMIUM: {netPremium}</h1>
        <h1>Gross premium: {grossPremium}</h1>
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
