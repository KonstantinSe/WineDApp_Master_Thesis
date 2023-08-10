// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



// Verschiedene Verträge werden von OpenZeppelin importiert
// ERC721 Standard (NFT) für die Erstellung und das Tracking der Weinchargen
// Ownable  für den "onlyOwner" Modifier und die Sicherheit des Vertrags
// Counter für das sichere Erstellen der Chargennummern

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//Smart Contragt erbt von ERC721 und Ownable und nutzt Counters
contract WineSupplyChain is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

// Status für den Zustand der Weinchargen wird definiert
    enum Status { Harvested, Processed, Produced, Bottled }

// Definiert den Counter um den Chargen durch Abruf der Funktion harvestGrapes eine ID (beginnend bei 0 ) zuzuweisen
    Counters.Counter private _badgeIdTracker;

//Definiert den Struct der alle Daten einer Weincharge erhält
    struct Badge {
        string  wineName;
        uint256 grapeHarvestTimestamp;
        address grapeHarvestedBy;
        uint256 grapeProcessedTimestamp;
        address grapeProcessedBy;
        uint256 wineProducedTimestamp;
        address wineProducedBy;
        uint256 wineBottledTimestamp;
        address wineBottledBy;
        Status status;
    }

//mappt die Chargen-ID auf den Struct mit den Chargendaten und speichert das Mapping in einem Array
    mapping(uint256 => Badge) public badges;

//Deklarierung verschiedener Events 
    event GrapesHarvested(uint256 badgeId, string name, address harvestedBy, uint256 timestamp);
    event GrapesProcessed(uint256 badgeId, address processedBy, uint256 timestamp);
    event WineProduced(uint256 badgeId, address producedBy, uint256 timestamp);
    event WineBottled(uint256 badgeId, address bottledBy, uint256 timestamp);


// Constructor der einmalig beim deployen des Vertrags auf der Blockchain aufgerufen wird. Legt Namen und Abkürzung des Tokens fest"
    constructor() ERC721("SchlossProschwitzWein", "SPW") {}

//Funktion die aufgerufen wird, wenn die Weintrauben geernet werden. Kann nur 
// duch Owner ( Adresse die den Smart Contract deployed hat, aufgerufen werden) 
    function harvestGrapes(string memory _wineName) public onlyOwner returns(uint256) {
        // Prüfen, ob die übergebene Weinsorte nicht leer ist
         require(bytes(_wineName).length > 0, "Rebsorte darf nicht leer sein");
        // Aktueller Wert des Counters (ChargenID) wird auf Variable geschrieben
        // Anschließend wird die neue Weincharge "gemintet" und die ChargenID zugeordnet
        uint256 newBadgeId = _badgeIdTracker.current();
        _mint(msg.sender, newBadgeId);
        // Die Daten (Weinsorte, aktueller Timestamp, Adresse des Absenders, Status == Harvested) werden auf den STruct gechrieben
         badges[newBadgeId] = Badge(_wineName, block.timestamp, msg.sender, 0, address(0), 0, address(0), 0, address(0), Status.Harvested);
        // Counter wird um +1 erhöht, um nächste Charge richtig zuzuordnen
        _badgeIdTracker.increment();
        // Event wird gefeuert
        emit GrapesHarvested(newBadgeId, _wineName, msg.sender, block.timestamp);
        return(newBadgeId);
        
    }

    // ähnlich wie obere Funktion: nimmt die ChargenID als Input und setzt voraus, dass Charge existiert 
    // & der Prozess die richtige Reihenfolge einhält
    // Legt Status auf "Processed" und schreibt aktuellen Timestamp und Absenderadresse in den Struct
    function processGrapes(uint256 _badgeId) public onlyOwner {
        require(_exists(_badgeId), "Charge existiert nicht");
        require(badges[_badgeId].status == Status.Harvested, "Trauben muessen gelesen werden, bevor sie verarbeitet werden koennen");
        Badge storage badge = badges[_badgeId];
        badge.grapeProcessedTimestamp = block.timestamp;
        badge.grapeProcessedBy = msg.sender;
        badge.status = Status.Processed;

        emit GrapesProcessed(_badgeId, msg.sender, block.timestamp);
    }
    // Herstellungsschritt: Wein Produzieren. Funktionalität identisch zu processGrapes
    function produceWine(uint256 _badgeId) public onlyOwner {
        require(_exists(_badgeId), "Charge existiert nicht");
        require(badges[_badgeId].status == Status.Processed, "Trauben muessen verarbeitet werden, bevor Wein produziert werden kann");
        Badge storage badge = badges[_badgeId];
        badge.wineProducedTimestamp = block.timestamp;
        badge.wineProducedBy = msg.sender;
        badge.status = Status.Produced;

        emit WineProduced(_badgeId, msg.sender, block.timestamp);
    }
    // Herstellungsschritt: Wein abfüllen. Funktionalität identisch zu processGrapes 
    function bottleWine(uint256 _badgeId) public onlyOwner {
        require(_exists(_badgeId), "Charge existiert nicht");
        require(badges[_badgeId].status == Status.Produced, "Wein muss produziert werden, bevor er abgefuellt werden kann");
        Badge storage badge = badges[_badgeId];
        badge.wineBottledTimestamp = block.timestamp;
        badge.wineBottledBy = msg.sender;
        badge.status = Status.Bottled;

        emit WineBottled(_badgeId, msg.sender, block.timestamp);
    }
    // Funktion die als Input die Chargen-ID nutzt & die Weinkunden 
    // über das Frontend später aufrufen können um alle Daten einer spezifischen Charge zu erhalten
    function getBadgeData(uint256 _badgeId) public view returns (string memory, uint256, address, uint256, address, uint256, address, uint256, address, Status) {
        require(_exists(_badgeId), "Charge existiert nicht");
        require(badges[_badgeId].status == Status.Bottled, "Charge ist noch nicht durch alle Herstellungschritte gegangen");
        Badge storage badge = badges[_badgeId];
        return (badge.wineName, badge.grapeHarvestTimestamp, badge.grapeHarvestedBy, badge.grapeProcessedTimestamp, badge.grapeProcessedBy, badge.wineProducedTimestamp, badge.wineProducedBy, badge.wineBottledTimestamp, badge.wineBottledBy, badge.status);
    }
}
