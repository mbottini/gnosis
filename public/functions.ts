import { RegexMapping } from './classes';
import { stringToStringDict, numToStringDict, numToStringListDict } from './types';

// Start by getting the right list from the mapping. If we have <s> -> <с> but <sh> -> <ш>, then we need to do <sh> -> <ш> first.

function orderRegexKeys(allKeys: string[]): string[] {
    let lengthToLetter: numToStringListDict = {};
    let finalList: string[] = [];

    for (let key of allKeys) {
        if (lengthToLetter[key.length] === undefined) {
            lengthToLetter[key.length] = [key];
        } else {
            lengthToLetter[key.length].push(key);
        }
    }

    let allLengths = Object.keys(lengthToLetter).map(Number).sort((a, b) => a - b);
    for (let length of allLengths) {
        let letters = lengthToLetter[length];
        finalList = finalList.concat(letters);
    }
    return finalList;
}

//No reason to order the keys every time--make sure this comes pre-ordered.
export function applyRegexMapping(datum: string, thisRegex: RegexMapping): string {
    let newDatum = datum;
    let unorderedKeys = Object.keys(thisRegex.regexDict);
    let orderedKeys = orderRegexKeys(unorderedKeys);
    for (let key in orderedKeys) {
        let regex = new RegExp(key, 'g');
        newDatum = newDatum.replace(regex, thisRegex.regexDict[key]);
    }
    return newDatum;
}