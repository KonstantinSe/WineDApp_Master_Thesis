
# Prototyp eines digitalen Produktpasses für Wein auf Basis von Blockchain-Technologie

Dieses Projekt ist ein Prototyp eines digitalen Produktpasses, der für die Ethereum-Blockchain und andere EVM basierte Blockchains entworfen wurde. Er wurde in Zusammenarbeit mit dem Weingut Schloss Proschwitz entwickelt und dient als Grundlage für eine Masterarbeit. Der Fokus liegt auf der Rückverfolgung und Authentifizierung von Weinen.

### Flowchart
<p align="center">
  <img src="https://github.com/KonstantinSe/WineDApp_Master_Thesis/assets/120366135/dcea5dd1-c501-423a-9030-13f7ee108fa7" width="600">
</p>


### User Interface
<p align="center">
  <img src="https://github.com/KonstantinSe/WineDApp_Master_Thesis/assets/120366135/b92a67bd-f30b-4f4b-883e-41ef643c3169" width="600">
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

### 6.Weiteres Terminalfenster öffnen und Frontend starten

```bash
yarn start
```

### 7. Weiteres Terminalfenster öffnen und Smart Contract deployen

```bash
yarn deploy
```
## Nutzung und Test

### Lokale Währung ins Wallet laden

Um Transaktionen auf der lokalen Blockchain durchzuführe muss, genau wie im Ethereum Mainnet, mit Gas bezahlt werden. Das Gas wird mit ETH beglichen. Um ETH in das lokale Wallet zu laden, klicken Sie auf das folgende Symbol:
  <img src="https://github.com/KonstantinSe/WineDApp_Master_Thesis/assets/120366135/30e21494-c29c-4ef2-beec-6ddf7ad0e1cf" width="160">


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


### Fehlermeldung: "Caller is not the owner"
![image](https://github.com/KonstantinSe/WineDApp_Master_Thesis/assets/120366135/757bc027-74ed-460c-8087-3c254256e510)

Diese Fehlermeldung kann auftreten, wenn versucht wird, bestimmte Transaktionen auf der Blockchain durchzuführen, die nur der Eigentümer ausführen darf. Sie ist das Ergebnis einer Sicherheitsfunktion, die durch den geerbten Ownable-Vertrag implementiert wurde. Der Fehler tritt auf, wenn der Vertrag feststellt, dass die Adresse, die die Transaktion ausführt, nicht die Eigentümeradresse ist.

Der Grund für diese Diskrepanz könnte sein, dass beim Deployen des Vertrags eine andere Adresse verwendet wurde, als die, die aktuell verwendet wird. 

**Lösung des Problems:**

1. **Ermittlung der Ethereum-Adresse:** Die im Frontend oben rechts angezeigte Ethereum-Adresse des Benutzers muss kopiert werden.

2. **Anpassung des Eigentümers im Vertrag:** Die kopierte Adresse muss in der Datei `packages/hardhat/deploy/00_deploy_your_contract.js` in Zeile 37 eingefügt werden:

   ```bash
   await WineSupplyChain.transferOwnership(
         „0x4832980a9368422444C1fe1d2e62870BE911741F"
   ```
3. **Den Vertrag erneut deployen**:
```bash
yarn deploy --reset
```


Durch diese Anpassung wird der Vertrag so aktualisiert, dass er die neue Adresse als Eigentümer erkennt. Dies sollte die Fehlermeldung beheben und ermöglichen, dass die Transaktionen wie vorgesehen durchgeführt werden können.



- Außerdem muss einmalig die selbe Adresse unter `packages/react-app/src/views/UserInterface.jsx` in das Adress-Dictionary in Zeile 9 kopiert werden. So wird der Name Schloss Proschwitz dieser  Ethereum-Adresse zugeordnet und im User Interface (wenn die Daten des Weins abgerufen werden) angezeigt.






