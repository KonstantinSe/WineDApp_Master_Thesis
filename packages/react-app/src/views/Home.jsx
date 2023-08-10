import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "WineSupplyChain", "purpose");

  return (
    <div style={{ paddingTop: "10rem", margin: "auto" }}>
      <img
        src="https://www.schloss-proschwitz.de/wp-content/uploads/2021/09/Dachmarke_Schloss_Proschwitz_2zeilig_CMYK.jpg"
        alt="Schloss Proschwitz Logo"
        style={{ width: "150px", height: "100px" }}
      />
      <h1>Willkommen beim Weingut Schloss Proschwitz</h1>
      <h3>Blockchain-basierter Produktpass für Wein</h3>
      <h5>Made by Konstantin Seufert</h5>
    </div>
  );
}

export default Home;
