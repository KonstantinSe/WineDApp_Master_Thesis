Prototyp eines digitalen Produktpasses auf Blockchainbasis

Dieses Projekt ist ein Prototyp eines digitalen Produktpasses, der auf der Ethereum-Blockchain implementiert ist. Es wurde in Zusammenarbeit mit Schloss Proschwitz entwickelt und dient als Grundlage für eine Masterarbeit. Der Fokus liegt auf der Verfolgung und Authentifizierung von Weinprodukten, um Transparenz und Vertrauen in die Lieferkette zu schaffen.

Voraussetzungen

Node (v18 LTS)
Yarn (v1.x)
Git
Installation und Setup

Befolge diese Schritte, um das Projekt auf deinem lokalen System einzurichten:

1. In gewünschtes Verzeichnis wechseln
2. Klonen von GitHub im Terminal
bash
Copy code
git clone https://github.com/KonstantinSe/WineApp_Master_Thesis
3. Ins Verzeichnis wechseln
bash
Copy code
cd WineApp_Master_Thesis
4. Yarn installieren, um Abhängigkeiten zu installieren
bash
Copy code
yarn install
5. Neues Terminalfenster öffnen und lokale Blockchain starten
bash
Copy code
yarn chain
6. Frontend starten
bash
Copy code
cd scaffold-eth (hier Wine App…)
yarn install
yarn chain
🚨 Wenn deine Verträge nicht auf localhost bereitgestellt sind, musst du das Standardnetzwerk in App.jsx aktualisieren, damit es mit deinem Standardnetzwerk in hardhat-config.js übereinstimmt.

Fehlerbehebung

Fehlermeldung: Caller is not the owner
Da die Funktionen zum Schreiben auf die Blockchain (z.B. Wein geerntet) eine Sicherheitsfunktion durch den Ownable-Vertrag aufweisen, muss bei dieser Fehlermeldung die Ethereum-Adresse, die im Frontend oben links angezeigt wird, überprüft werden. Der Grund ist, dass Hardhat beim Deployen manchmal eine andere Adresse verwendet.

Lösung:

Unter packages/hardhat/deploy/00_deploy_your_contract.js in Zeile 37 diese Adresse hineinkopieren:
bash
Copy code
await WineSupplyChain.transferOwnership(
      "0x4832980a9368422444C1fe1d2e62870BE911741F"
);
Außerdem muss einmalig die selbe Adresse unter packages/react-app/src/views/UserInterface.jsx in das Adress-Dictionary in Zeile 9 kopiert werden. So wird auch der Name Schloss Proschwitz neben der Ethereum-Adresse im User Interface (wenn die Daten des Weins abgerufen werden) im Frontend angezeigt.
