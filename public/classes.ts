import { stringToStringDict, numToStringDict } from './types';

type dependentCardTypes = {
    dependent: CardType,
    dependee: CardType
}

type peerCardTypes = {
    peer1: CardType,
    peer2: CardType
}


type dependentCards = {
    dependent: Card,
    dependee: Card
}

type peerCards = {
    peer1: Card,
    peer2: Card
}




export class RegexMapping {
    name: string;
    regexDict: stringToStringDict;

    constructor(name: string, regexDict: stringToStringDict) {
        this.name = name;
        this.regexDict = regexDict;
    }
}

export class Template {
    name: string;
    cardTypes: CardType[];

}

export class CardType {
}


export class Note {
    name: string;
    cards: Card[];
    dependentPairs: dependentCards[] = [];
    peerPairs: peerCards[] = [];
    
    constructor(name: string, cards: Card[]) {
        this.name = name;
        this.cards = cards;
    }
}

export class Card {
    frontHTML: string;
    backHTML: string;
    dependents: Card[] = [];
    dependees: Card[] = [];
    peers: Card[] = [];

    constructor(frontHTML: string, backHTML: string, dependents: Card[], dependees: Card[], peers: Card[]) {
      this.frontHTML = frontHTML;
      this.backHTML = backHTML;
      this.dependents = dependents;
      this.dependees = dependees;
      this.peers = peers;
    }
}