import { stringToStringDict, numToStringDict } from './types';

type dependentCardTypes = {
    dependent: CardType,
    dependee: CardType
}

//I considered making this just a list of card types, but we could have a situation where card 1 is a peer of card 2 which is a peer of card 3, but cards 1 and 3 are not peers of each other
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


//A Template is a set of card types, while a Note is a set of cards. It is possible during template design to automatically assign peer- and dependency-relationships between card types; then when a note is manufactured, the associated cards will automatically have the same relationships.
export class Template {
    name: string;
    cardTypes: CardType[];
    dependentPairs: dependentCardTypes[] = [];
    peerPairs: peerCardTypes[] = [];

}

export class CardType {
    //The HTMLs should probably be a class of some sort that requires a certain set of fields and has a method that reads in fields and spits out the HTML snippet that gets displayed.
    frontHTML: string;
    backHTML: string;

    // We *probably* do not need to hold dependent/head relationships here, but might end up needing to. See the long comment in the Note class.
    
}


export class Note {
    name: string;
    cards: Card[]; //Probably a list, but could be a dict mapping card types to cards.
    noteTemplate: Template;

    // We may not actually need to hold card relationships here, so they're commented out. A Template has dependent and peer relationships because there may be dependency/peer relationships between cards of the same note that we want to generate automatically. But that info only needs to be stored on the cards themselves.

    // We will still want Templates to store automatic dependency/peer relations, but by a similar but opposite token CardType probably doesn't need to. 
    
    // Suppose a template is created with a peer relationship between Russian -> English and English -> Russian, and a dependency relationship where "stress placement in <word>" is dependent on Russian -> English. This is stored in the Template. Then when we wish to make some cards, we summon the Template and add some data to fields. Then a Note is created with three cards (голова́ -> head (card A), head -> голова́ (card B), and 'stress on голова' (card C)). Card A contains {peers: [card B], dependents: [card C]}; card B contains {peers: [card A]}, and card C contains {dependees: [card A]}; these are generated automatically, drawing on the template data. 

    //dependentCardPairs: dependentCards[] = [];
    //peerCardPairs: peerCards[] = [];
    
    constructor(name: string, cards: Card[]) {
        this.name = name;
        this.cards = cards;
    }
}


export class Card {
    cardType: CardType;
    frontHTML: string;
    backHTML: string;
    dependents: Card[] = [];
    dependees: Card[] = [];
    peers: Card[] = [];
    trackers: Tracker[] = [];

    constructor(cardType: CardType, frontHTML: string, backHTML: string, dependents: Card[], dependees: Card[], peers: Card[]) {
        this.cardType = cardType;
        this.frontHTML = frontHTML;
        this.backHTML = backHTML;
        this.dependents = dependents;
        this.dependees = dependees;
        this.peers = peers;
    }
}

export class Deck {
    name: string;
    noteList: Note[];
    courses: Course[]; // If we want decks to be heritable from course to course/year to year within a school, then we may want a deck that belongs to multiple Courses (also if we have e.g. different sections of the same course; that might be another object?)

    superdeck: Deck;
    subdecks: Deck[];
    notes: Note[];
}


//A laundry list of object classes, not all of which might necessarily make it into production

export class District {
    name: string;
    schools: School[];
}

export class DistrictAdmin {
    username: string;
    district: District;
}

export class School {
    name: string;
    teachers: Teacher[];
    courses: Course[];
    students: Student[];
    district: District;
}

export class SchoolAdmin {
    username: string;
    school: School;
}

export class Teacher {
    username: string;
    name: string;
    school: School;
    courses: Course[];

}

export class Course {
    name: string;
    teachers: Teacher[];
    students: Student[];

    //It should be able for Spanish II to "inherit" the decks from Spanish I
    prereqs: Course[];
    postreqs: Course[];
}

export class Student {
    courses: Course[];
    decks: Deck[];
    username: string;

}

//Tracker is supposed to keep track of a student's card. This is closely related to Card and it is not yet clear what features belong to Card and which to Tracker. 

// A plausible structure here is that "Cards" are mostly ghosts that exist mainly to generate Trackers, and mostly store a CardType and a Note. Then a tracker is instantiated for each student, and the tracker stores signposts to the right card type and note; during reviews the machine just summons the note data and feeds it into the card type to get the HTML. If this is the case, though, Card probably needs to know what its daughter trackers are so that it can assign and update dependency and peer relationships.
export class Tracker {
    card: Card;
    student: Student;
    dependents: Tracker[];
    dependees: Tracker[];
    peers: Tracker[];
    interval: number; //in milliseconds? rounded to the nearest hour? day?
    history: Review[];

}

export class Review {
    time: number;
    outcome: number; //1 for pass and 0 for fail, or maybe just use a boolean, though we should leave open the possibility of more sophisticated systems
}