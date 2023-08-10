
# Prototyp eines digitalen Produktpasses für Wein auf Basis von Blockchain-Technologie

Dieses Projekt ist ein Prototyp eines digitalen Produktpasses, der auf der Ethereum-Blockchain implementiert wurde. Er wurde in Zusammenarbeit mit dem Weingut Schloss Proschwitz entwickelt und dient als Grundlage für eine Masterarbeit. Der Fokus liegt auf der Rückverfolgung und Authentifizierung von Weinen, um Transparenz und Vertrauen in der Lieferkette zu schaffen.

## Voraussetzungen

- Node (v18 LTS)
- Yarn (v1.x)
- Git

## Installation und Setup

Befolgen Sie folgende Schritte, um das Projekt auf dem lokalen System einzurichten:

### 1. Mit dem Terminal in das gewünschtes Verzeichnis wechseln

### 2. Klonen des Repository 

```bash
git clone https://github.com/KonstantinSe/WineDApp_Master_Thesis
```

### 3. Ins Verzeichnis wechseln

```bash
cd WineDApp_Master_Thesis
```

### 4. Abhängigkeiten installieren

```bash
yarn install
```
(Dieser Schritt muss nur einmal ausgeführt werden)

### 5. Neues Terminalfenster öffnen und lokale Blockchain starten

```bash
yarn chain
```

### 6. Frontend starten

```bash
yarn start
```

### 7. Smart Contract deployen

```bash
yarn deploy
```



## Fehlerbehebungen

### Fehlermeldung: Caller is not the owner

Da die Funktionen zum Schreiben auf der Blockchain (z.B. Wein geerntet)  Sicherheitsfunktionen durch den Ownable-Vertrag aufweisen, muss bei dieser Fehlermeldung die Ethereum-Adresse, die im Frontend oben links angezeigt wird, überprüft werden. Der Grund ist, dass Hardhat beim Deployen manchmal eine andere Adresse verwendet.

**Lösung:**

Die im Frontend oben rechts angezeigte (eigene) Ethereum Adresse kopieren und

- Unter `packages/hardhat/deploy/00_deploy_your_contract.js` in Zeile 37 diese Adresse einfügen:

  ```bash
  await WineSupplyChain.transferOwnership(
        "0x4832980a9368422444C1fe1d2e62870BE911741F"
  );
  ```

  anschließend im Terminal folgenden Befehl ausführen:
```bash
yarn deploy --reset
```

- Außerdem muss einmalig die selbe Adresse unter `packages/react-app/src/views/UserInterface.jsx` in das Adress-Dictionary in Zeile 9 kopiert werden. So wird der Name Schloss Proschwitz dieser  Ethereum-Adresse zugeordnet und im User Interface (wenn die Daten des Weins abgerufen werden) angezeigt.

