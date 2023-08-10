import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Table, Image } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined, QrcodeOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

const addressDictionary = {
  "0x4832980a9368422444C1fe1d2e62870BE911741F": "Schloss Proschwitz",
};

export default function UserInterface({ tx, readContracts }) {
  const [badgeID, setBadgeID] = useState();
  const [badgeData, setBadgeData] = useState();
  const [datum, setDatum] = useState();
  const [datum_verarbeitet, setDatum_verarbeitet] = useState();
  const [weinProduziert, setWeinProduziert] = useState();
  const [weinAbgefuellt, setWeinAbgefuellt] = useState();
  const [loading, setLoading] = useState(false);
  const [wineYear, setWineYear] = useState(); // <---- This is the correct place to declare useState

  const getWineYear = timestamp => {
    const dateObject = new Date(timestamp * 1000);
    return dateObject.getFullYear();
  };

  const formatDate = timestamp => {
    const dateObject = new Date(timestamp * 1000);

    const year = dateObject.getFullYear();
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    const date = ("0" + dateObject.getDate()).slice(-2);
    const hours = ("0" + dateObject.getHours()).slice(-2);
    const minutes = ("0" + dateObject.getMinutes()).slice(-2);

    return `${date}.${month}.${year},  ${hours}:${minutes} Uhr`;
  };

  const formatAddress = address => {
    if (!address) return "";

    const shortenedAddress = `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;

    return address && addressDictionary[address] ? (
      <span title={address}>{`${addressDictionary[address]} (${shortenedAddress})`}</span>
    ) : (
      shortenedAddress
    );
  };

  const columns = [
    {
      title: "Herstellungsschritt:",
      dataIndex: "step",
      key: "step",
    },
    {
      title: "Datum (Block Timestamp):",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Von Ethereum Adresse: ",
      dataIndex: "from",
      key: "from",
      render: text => formatAddress(text),
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <Card
        title="Wein authentifizieren 🍷"
        bordered={false}
        style={{ width: 800, marginTop: 64, padding: 16, border: "1px solid #cccccc" }}
      >
        <p>Bitte geben Sie die Chargen ID auf Ihrer Weinflasche ein.</p>
        <Divider />
        <Input
          placeholder="Chargen ID"
          onChange={e => {
            setBadgeID(e.target.value);
          }}
        />
        <Button
          type="default"
          icon={<QrcodeOutlined />}
          onClick={() => alert("QR-Code System funktioniert leider noch nicht. Chargen ID manuell eingeben.")}
          style={{ marginLeft: 8 }}
        >
          QR-Code Scannen
        </Button>
        <Button
          style={{ marginTop: 8 }}
          onClick={async () => {
            setLoading(true);
            try {
              const badgeData = await tx(readContracts.WineSupplyChain.callStatic.getBadgeData(badgeID));
              setBadgeData(badgeData);

              const year = getWineYear(badgeData[7]); // Get the year from the bottling date
              setWineYear(year); // Set the wine year state

              setDatum(formatDate(badgeData[1]));
              setDatum_verarbeitet(formatDate(badgeData[3]));
              setWeinProduziert(formatDate(badgeData[5]));
              setWeinAbgefuellt(formatDate(badgeData[7]));
            } catch (error) {
              console.log(error);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? <Spin /> : "Authentifizieren"}
        </Button>
        {badgeData && (
          <div style={{ marginTop: 16 }}>
            <h1>
              <b>{`${badgeData[0]} - Jahrgang ${wineYear}`}</b>
            </h1>
            <Table
              columns={columns}
              dataSource={[
                {
                  key: "1",
                  step: "1. Weintrauben gelesen  🚜",
                  date: datum,
                  from: badgeData[2],
                },
                {
                  key: "2",
                  step: "2. Weintrauben verarbeitet 🍇",
                  date: datum_verarbeitet,
                  from: badgeData[4],
                },
                {
                  key: "3",
                  step: "3. Wein produziert 👨‍🍳",
                  date: weinProduziert,
                  from: badgeData[6],
                },
                {
                  key: "4",
                  step: "4. Wein abgefüllt 🍾",
                  date: weinAbgefuellt,
                  from: badgeData[8],
                },
              ]}
              pagination={false}
            />
            <Image
              width={200}
              src="/verified.jpg"
              style={{ display: "block", marginLeft: "auto", marginRight: "auto", marginTop: "20px" }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
