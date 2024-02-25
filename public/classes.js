export class Card {
  constructor(frontHTML, backHTML, dependents, dependees, peers) {
    this.frontHTML = frontHTML;
    this.backHTML = backHTML;
    this.dependents = dependents;
    this.dependees = dependees;
    this.peers = peers;
  }
}