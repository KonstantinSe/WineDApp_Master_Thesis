import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Menu, Dropdown } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined, DownOutlined, QrcodeOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

export default function AdminInterface({ address, mainnetProvider, tx, readContracts, writeContracts }) {
  const [grapeName, setGrapeName] = useState();
  const [nextChargeId, setNextId] = useState();
  const [currentChargeInfo, setCurrentChargeInfo] = useState("");
  const [inputChargeId, setInputChargeId] = useState();
  const [showImage, setShowImage] = useState(false);

  // mit const neue Variable anlegen und Funktion die diese Variable ändert , UseState initiiert
  // Weindictionary aus dem Schloss Proschwitz Online Shop

  const handleMenuClick = e => {
    setGrapeName(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.ItemGroup title="Weißweine">
        <Menu.Item key="Cuvee Clemens">Cuvee Clemens</Menu.Item>
        <Menu.Item key="Cuvèe Pauline">Cuvèe Pauline</Menu.Item>
        <Menu.Item key="Elbling">Elbling</Menu.Item>
        <Menu.Item key="Goldriesling">Goldriesling</Menu.Item>
        <Menu.Item key="Grauburgunder">Grauburgunder</Menu.Item>
        <Menu.Item key="Müller-Thurgau">Müller-Thurgau</Menu.Item>
        <Menu.Item key="Riesling">Riesling</Menu.Item>
        <Menu.Item key="Scheurebe">Scheurebe</Menu.Item>
        <Menu.Item key="Traminer">Traminer</Menu.Item>
        <Menu.Item key="Weissburgunder">Weissburgunder</Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title="Rotweine">
        <Menu.Item key="Cuvee Moritz">Cuvee Moritz</Menu.Item>
        <Menu.Item key="Frühburgunder">Frühburgunder</Menu.Item>
        <Menu.Item key="Spätburgunder">Spätburgunder</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <div>
      {/* +++++++++++++++++++++++++++++++++
    Funtion Weincharge erstellen (Und Wein ernten)
    ++++++++++++++++++++++++++++++++++    */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 500, margin: "auto", marginTop: 64 }}>
        <h2>1. Weinlese 🚜 </h2>
        <h5>
          <i>
            - Erstellt neue Weincharge als NFT mit automatisch erstellter ID
            <br />
            - Fügt den aktuellen Block Timestamp hinzu <br />
            (grapeHarvestTimestamp)
            <br />- Ändert den Status der neu erstellen Charge auf "Harvested"
          </i>
        </h5>

        <Divider />
        <div style={{ margin: 8 }}>
          <Dropdown overlay={menu}>
            <Button>
              Rebsorte auswählen <DownOutlined />
            </Button>
          </Dropdown>
          <p>Ausgewählte Rebsorte: {grapeName || "Keine"}</p>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              try {
                const transaction = await tx(writeContracts.WineSupplyChain.harvestGrapes(grapeName));
                console.log("📡 Transaction Update:", transaction);
                if (transaction && (transaction.status === "confirmed" || transaction.status === 1)) {
                  console.log(" 🍾 Transaction " + transaction.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      transaction.gasUsed +
                      "/" +
                      (transaction.gasLimit || transaction.gas) +
                      " @ " +
                      parseFloat(transaction.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
                await transaction.wait();
                const chargeID = await writeContracts.WineSupplyChain.callStatic.harvestGrapes(grapeName);
                const currentID = chargeID.toNumber() - 1;
                setNextId("ID der nächsten Charge: " + chargeID.toNumber().toString());
                alert(
                  'Charge der Sorte "' +
                    grapeName +
                    '" mit der ID: ' +
                    currentID.toString() +
                    " wurde erstellt, QR Code wird erzeugt",
                );
                setCurrentChargeInfo(
                  "Letzte erstellte Charge: Rebsorte: " + grapeName + ", ID: " + currentID.toString(),
                );
                setShowImage(true);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Trauben lesen & Weincharge erstellen
          </Button>

          {showImage && (
            <img
              src="./QRCOde.jpg"
              alt="QR-Code System funktioniert noch nicht"
              style={{ width: "200px", height: "auto", marginBottom: "20px", marginTop: "20px" }}
            />
          )}

          <h3>{currentChargeInfo}</h3>

          {/* +++++++++++++++++++++++++++++++++
    Funtion Weintrauben verarbeitet  
    ++++++++++++++++++++++++++++++++++    */}
        </div>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 500, margin: "auto", marginTop: 64 }}>
        <h2>2. Weintrauben verarbeiten 🍇 </h2>
        <h5>
          <i>
            - Fügt den aktuellen Block Timestamp zur Charge hinzu <br />
            (grapeProcessedTimestamp)
            <br />- Ändert den Status der Charge auf "Processed"
          </i>
        </h5>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            placeholder="Chargen ID eingeben"
            onChange={e => {
              setInputChargeId(e.target.value);
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
              const result = tx(writeContracts.WineSupplyChain.processGrapes(inputChargeId), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Trauben verarbeitet
          </Button>
          {/* +++++++++++++++++++++++++++++++++
    Funtion Wein produzieren
    ++++++++++++++++++++++++++++++++++    */}
        </div>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 500, margin: "auto", marginTop: 64 }}>
        <h2>3. Wein produzieren 👨‍🍳 </h2>
        <h5>
          <i>
            - Fügt den aktuellen Block Timestamp zur Charge hinzu <br />
            (wineProducedTimestamp)
            <br />- Ändert den Status der Charge auf "Produced"
          </i>
        </h5>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            placeholder="Chargen ID eingeben"
            onChange={e => {
              setInputChargeId(e.target.value);
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
              const result = tx(writeContracts.WineSupplyChain.produceWine(inputChargeId), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Wein produziert
          </Button>
        </div>
      </div>
      {/* +++++++++++++++++++++++++++++++++
    Funtion Wein abfüllen
    ++++++++++++++++++++++++++++++++++    */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 500, margin: "auto", marginTop: 64 }}>
        <h2>4. Wein abfüllen 🍾 </h2>
        <h5>
          <i>
            - Fügt den aktuellen Block Timestamp zur Charge hinzu <br />
            (wineBottledTimestamp)
            <br />- Ändert den Status der Charge auf "Bottled"
          </i>
        </h5>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            placeholder="Chargen ID eingeben"
            onChange={e => {
              setInputChargeId(e.target.value);
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
              const result = tx(writeContracts.WineSupplyChain.bottleWine(inputChargeId), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Wein abgefüllt
          </Button>
        </div>
      </div>
      <Divider />
      Your Address:
      <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
      <Divider />
      <Divider />
    </div>
  );
}
