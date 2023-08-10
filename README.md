
# Prototyp eines digitalen Produktpasses für Wein auf Basis von Blockchain-Technologie

Dieses Projekt ist ein Prototyp eines digitalen Produktpasses, der auf der Ethereum-Blockchain implementiert wurde. Er wurde in Zusammenarbeit mit dem Weingut Schloss Proschwitz entwickelt und dient als Grundlage für eine Masterarbeit. Der Fokus liegt auf der Rückverfolgung und Authentifizierung von Weinen, um Transparenz und Vertrauen in der Lieferkette zu schaffen.
<p align="center">
  <img src="https://github.com/KonstantinSe/WineDApp_Master_Thesis/assets/120366135/ff0846c5-7cf9-466f-ac3d-41131ae83589" width="500">
</p>

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
## Nutzung und Test

### Lokale Währung ins Wallet laden

Um Transaktionen auf der lokalen Blockchain durchzuführen, muss man, genau wie im Ethereum Mainnet, mit Gas bezahlen. Das Gas wird mit ETH beglichen. Um ETH in das lokale Wallet zu laden, klicken Sie  auf das folgende Symbol:
  <img src="https://github.com/KonstantinSe/WineDApp_Master_Thesis/assets/120366135/7b71b8a3-f4b8-4500-af23-0e88a69b30f2" width="150">

### Erstellung einer Weincharge

- Gehen Sie zum Tab "Admin Interface".
- Wähle Sie die Weinsorte aus.
- Eine Chargen-ID wird automatisch erstellt, beginnend bei 0.
- Achten Sie darauf, die korrekte Reihenfolge des Herstellungsprozesses einzuhalten, sonst gibt der Smart Contract eine Fehlermeldung zurück.
- Hinweis: Die Dateneingabe mittels QR-Code funktioniert zum aktuellen Zeitpunkt noch nicht.

### Abrufen der Informationen des Weins

- Wechseln Sie zum Tab "User Interface"
- Geben Sie die Chargen-ID ein 
- Hinweis: Die Charge muss alle Herstellungsschritte durchlaufen haben, um Informationen abrufen zu können.

### Test von Zugriffsberechtigungen

- Öffne Sie ein Inkognito-Fenster und rufen Sie `localhost:3000` auf.
- Da Sie nun eine andere Ethereum-Adresse verwenden und nicht mehr der Owner des Vertrags sind, können Sie nur noch Daten abrufen und keine Daten mehr über den Smart Contract auf die Blockchain schreiben

## Fehlerbehebungen

### Fehlermeldung: Caller is not the owner


Da die Funktionen zum Schreiben auf der Blockchain (z.B. Wein geerntet) Sicherheitsfunktionen durch den Ownable-Vertrag aufweisen, muss bei dieser Fehlermeldung die Ethereum-Adresse, die im Frontend oben links angezeigt wird, überprüft werden. Der Grund ist, dass Hardhat beim Deployen manchmal eine andere Adresse verwendet.

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






