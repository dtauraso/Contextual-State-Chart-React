import React from "react";
import State from "./State";
/*
My programmer stories for the contextual state chart
As a programmer,
I want a transport system,
so that any variable can be transported up or down the hierarchy to where it needs to be used

As a programmer,
I want a record system,
so that all changes to the variables can be tracked in constant time

As a programmer,
I want a erasing system for variables,
so that the sub state machine will delete all variables used at the nth level

I want it as a replacement to the grapage collection used in programming
so that this can be done in C and act like a long list of free memory commands right before we move out of the submachine

This is also biolgically inspred, as microtubles don't last very long(10 minutes I think)
so the job to be done must be small and very efficient(It will be unable to do anything infinite)

As a programmer,
I want infinite granulary for a state,
so that I can map my throughts more accurately to the computer and not rely so much on
the traditional techniques

As a programmer,
I want a hierarchy of graphs,
so the tasks can be broken down into smaller parts


The below stories may need some work as these are assume to be impossible
As a programmer,
I want a paralllel processing system,
such that It's universal and natually resists deadlock and livelock
I think our body does this natually resists such problems with parallel processing

As a programer,
I want all tasks to have a fixed time limit,
so all tasks to be treated fairly always

As a programmer,
I want a priority queue,
so that the tasks related to the subtasks will be done first?
How can this be done when all tasks in queue are the same size?




variable table 
mod flags |
i |
1 character |
isEndOfSequence


each edge is searchable through the table
variables are assumed to be a single sequence
all state data modifications are trackable
(if this plan fails go back to a sequence table)
(sticking to this plan while it works)
state table
id |
-1 or single word |
1 chacter |
next_states(link to state name lookup table at sequence2 level) |
parentsnext_states(link to state name lookup table at sequence2 level) |
childennext_states(link to state name lookup table at sequence2 level) |
variable data sequence(variable table rows) (only sequences of chars/integers/floats allowed)
mod flags |
seq1 |
seq2

findNextStates(current_state) O(n) where n is the number of characters in all the next states linking from current_state

strings are varaibles
any list is a parent -> child state relationship where the child name starts at 0
    local in the parent's children vs global in the state table
    if the only way to find the child name is an index in the state table how can it be found?
    need a uniqe way to map the child column to the child name(have to be able to store many different copies of "i"
    uniquly but ollow the user to access them by the name used when inserting them)
    is this violated if the same id is used on many different states("i"'s)?
    if the "i"'s are of the form "i+" then we can use getChild(parent, "i") to get the unique "i" as long as
    there is only 1 "i" as a child state of parent

    getArray(parent, child(array_var_name), i, j, k)
    // array_var_name[i][j][k]
any dict is a parent -> child state relation where the child name is the key
search is O(n) where n is the number of characters in the find(parent, string) input

state name lookup table mapping to the state table
1 character |
n cols for numeric edges(id in state table)


state attribute col to data in sequences lookup table
seq1 |
n cols seq0 to sequences table

do this in js. Its very complex and has alot of imperative parts I'm not sure how to convert to sql

start with a vanilla trie then add to what is returned 
*/
const letterRows = () => {
  let letters = {};
  let number = 33;
  for (; number < 127; number++) {
    // console.log(String(x))
    const asciiCharacter = String.fromCharCode(number);
    // console.log(String.fromCharCode(x))
    letters = { ...letters, [asciiCharacter]: -1 };
  }

  return letters;
  // console.log(letters)
};
const isValidEdge = (edge) => {
  return edge > -1;
};

const makeTrieNode = (letter) => {
  return {
    character: letter,
    trieEdges: { ...letterRows() },
  };
};
const insertNewNode = (stateTable, addedIds, currentId, letter) => {
  // redesign using the object append logic from the filters in sauti
  console.log(stateTable, addedIds, currentId, letter);
  stateTable = [...stateTable, makeTrieNode(letter)];

  const newId = stateTable.length - 1;
  console.log("new id", letter, newId, currentId);

  // console.log("old object", stateTable[currentId].trieEdges, letter)
  // what is producing the a: 21? [letter]: newId after clearly printing something different
  stateTable = [
    ...stateTable.slice(0, stateTable.length - 1),
    {
      character: letter,
      trieEdges: { ...stateTable[newId].trieEdges, [letter]: newId },
    },
    // ,
    // ...stateTable.slice(currentId + 1, stateTable.length)
  ];
  //     [currentId] = {
  //     character: letter,
  //     trieEdges: {[letter]: newId}

  // }
  // .trieE[letter]: newId

  addedIds = [...addedIds, newId];
  currentId = newId;
  console.log(stateTable, addedIds, currentId);
  console.log("done adding");
  let returnItem = [stateTable, addedIds, currentId];
  return returnItem;
};
const getNextId = (letter, row) => {
  // console.log(letter, row.trieEdges, row.trieEdges[letter])
  return row.trieEdges[letter];
};
const find = (trieTable, sequence) => {
  // console.log(sequence)
  let collectedIds = [];
  let currentId = 0;
  let isFound = 2;
  // how do we have an already existing edge
  // when each letter is supposed to come after the other?
  sequence.forEach((letter, i) => {
    // console.log(letter, i)
    // currentId should point to the last item matched or added
    let nextId = getNextId(letter, trieTable[currentId]);

    // console.log(nextId)
    if (!isValidEdge(nextId)) {
      isFound = 0;
      return;
    } else if (isValidEdge(nextId)) {
      // console.log("we have an edge", trieTable, nextId)
      // So we have an edge.  Is it a match to word[j]?
      // console.log(trieTable, nextId, trieTable[nextId])
      collectedIds = [...collectedIds, nextId];
      currentId = nextId;
    }
  });
  // we have gone through the entire sequence and haven't set it to 0 yet
  if (isFound === 2) {
    isFound = 1;
  }
  // have a state path test that only tests information unique to that state name insertion(no checking for overlap with other state names)
  let returnArray = [trieTable, collectedIds, isFound];
  return returnArray;
};
const insert = (trieTable, sequence, currentId) => {
  console.log("inserting", sequence);
  let returnArray = find(trieTable, sequence, 0);

  trieTable = returnArray[0];
  let collectedIds = returnArray[1];
  let isFound = returnArray[2];

  if (collectedIds.length > 0) {
    currentId = collectedIds[collectedIds.length - 1];
  }
  console.log("about to insert");
  console.log(isFound, collectedIds, currentId, trieTable[currentId], sequence);
  let addedIds = [...collectedIds];
  // inserting is fucked up
  sequence.forEach((letter, i) => {
    console.log(letter, i);
    // for(var j in word) {
    // console.log(word[j], currentId)
    // console.log(getLetterColumns(stateTable[nextId]))
    // getLetterColumns(stateTable[nextId])
    // currentId should point to the last item matched or added
    // let nextId = getNextId(letter, trieTable[currentId])
    // console.log(nextLetterEdge)
    // new letter
    // console.log(i, j)
    // const sequenceI = i + parseInt(j)
    // tested and works
    // console.log(nextId)
    // once this is hit all the remaining rounds will be this
    // can make this it's own loop coming after we run of the graph
    // if(!isValidEdge(nextId)) {
    //     console.log("there is no edge")
    let returnItem = [];
    console.log("inserting new node");
    // we want to get the previous node have an edge to the new node
    // insertNewNode(trieTable, addedIds, previousId, letter)

    returnItem = insertNewNode(trieTable, addedIds, currentId, letter);
    // [trieTable, addedIds, currentId] = returnItem
    trieTable = returnItem[0];
    addedIds = returnItem[1];
    currentId = returnItem[2];
    // need to set the

    //     console.log("added", currentId)
    //     // console.log(trieTable, addedIds, currentId)
    // // the letter was added from a previous call of insertStateRows
    // }
    //  else if(isValidEdge(nextId)) {
    //     console.log("we have an edge", trieTable, nextId)
    //     // So we have an edge.  Is it a match to word[j]?
    //     // console.log(trieTable, nextId, trieTable[nextId])
    //     addedIds = [...addedIds, nextId]
    //     currentId = nextId

    // }

    // }
  });
  // have a state path test that only tests information unique to that state name insertion(no checking for overlap with other state names)
  let returnArray1 = [trieTable, addedIds];
  return returnArray1;
};
const combineSequences = (flattenedList) => {
  // flattenedList is a list of string
  // console.log(flattenedList)
  let sequence = [];
  for (var i in flattenedList) {
    sequence = [...sequence, flattenedList[i]];
  }
  return sequence;
};
const testInsert = () => {
  // no deconstruction

  // test on a few different and similar sequences
  let sequences = [
    ["addddd", "byhtgrf", "casretr"],
    ["addddd", "b", "casretr"],
    // ,
    // ['casretr', 'byhtgrf', 'addddd']
  ];

  // let nestedList = [['addddd'], ['byhtgrf'], ['casretr']]
  // let flattenedList = [].concat.apply([], nestedList).join('')
  // console.log([].concat.apply([], nestedList).join(''))
  // let sequence = []
  // for(var i in flattenedList) {
  //     sequence = [...sequence, flattenedList[i]]
  // }

  // link table
  //  id | state table id of last part of state name (spllitting the full state name stirng will fail)
  //  wherer claus for next states neighbor set

  // inverse link table to cache(only cach) the same links
  //  full state name as a string -> id to link table

  // the next states cell in a state table row holds the id(link table id)
  // a where clause can collect all the rows in the link table to find the right path to the state cell
  // inside the state table

  // variable table
  // id | slot
  // where clause for arrays of primitives

  // variableValue slot in state table can hold the id in the variable table

  // the state/var maps to the parent state in the state table
  // when we see the mapping make a copy of the state/var and store it inside the parent state as a child var
  // make the copy of the state/var(state can be a var structure)
  // after we run the parent state
  // upstream and downstream are flags

  let stateTable = {
    0: {
      character: "root",
      trieEdges: { ...letterRows() },
    },
  };
  let addedIds = [0];

  console.log("before insert", stateTable);
  let currentId = 0;
  // console.log(combineSequences([].concat.apply([], sequences).join('')))
  sequences.forEach((sequence, i) => {
    // console.log(combineSequences([].concat.apply([], sequence).join('')))
    // combineSequences
    let sequenceOfChars = [];
    sequenceOfChars = combineSequences([].concat.apply([], sequence).join(""));
    // the sequence doesn't print out after it's passed in
    // when it prints the whole sequence prints but program crashes with can't asscess 0 of undefined
    console.log(i);
    // console.log(sequenceOfChars)
    let insertResults = [];
    insertResults = insert(stateTable, sequenceOfChars, currentId);
    // [stateTable, addedIds] = insertResults
    stateTable = insertResults[0];
    addedIds = insertResults[1];
    console.log(stateTable, addedIds);
  });
  // [stateTable,addedIds] = insert([
  //     {
  //         character: 'root',
  //         trieEdges: {...letterRows()}

  //     }
  // ], sequence, 0)
  // console.log(stateTable, addedIds)
  // addedIds.forEach(id => {
  //     let key = Object.keys(stateTable[id].trieEdges).filter(edge => stateTable[id].trieEdges[edge] > 0)
  //     console.log(id, stateTable[id].character, "next letter", key, "next id", stateTable[id].trieEdges[key])
  // })
  // let count = 0
  // nestedList.forEach(innerList => {
  //     innerList.forEach((string) => {
  //         for(var i in string) {
  //             console.log(string[i], addedIds[count])
  //             count ++
  //         }
  //     })
  //     console.log('\n')
  // })
};

const getDefaultValue = (sequenceTable, attribute) => {
  const length = sequenceTable.length;
  let defaultValue = 0;
  if (length > 0) {
    const lastRow = sequenceTable[sequenceTable.length - 1];
    defaultValue = lastRow[attribute] + 1;
  }
  return defaultValue;
};

// let [ table, addedIds, isSame ] = addToTrie(table, sequence)
// change this one
const makeSequenceRows = (nextStates, sequenceTable) => {
  let rows = [];
  let words = getDefaultValue(sequenceTable, "words");

  let i = getDefaultValue(sequenceTable, "id");

  let offset = 0;
  // need edges and some trie tree logic
  // the worst thing that can happen is this will take longer overall
  // the benefit is we will have 1 id per sequence and will not have to store duplicate sequence
  // the state machine structure will use the same sequence many times(parents, links to same state)
  nextStates.forEach((stateName, j) => {
    stateName.forEach((letters, k) => {
      // need to update this for trie tree support
      // that way we can reuse the same sequence for any non data attribute of a state(we want to allow the user
      // to make copies of the same sequence in the variable attribute)
      for (var m in letters) {
        // k is id
        // words is for an entire collection of whole names
        rows = [
          ...rows,
          {
            // this is only data for each item in the sequence
            // missing links to other nodes for trie tree
            id: i + offset,
            letter: letters[m],
            position: parseInt(m),
            // 'modifiedFlag': "new",
            // integers for grouping the sequence into a list of strings
            word: k,
            words: words,
          },
        ];
        offset += 1;
      }
    });
  });

  return rows;
};
const makeWord = (sequenceTable, low, high) => {
  return sequenceTable
    .slice(low, high)
    .map((row) => row.letter)
    .join("");
};
const collectWords = (sequenceTable, wordsIdToSequenceTable) => {
  let collectionOfWords = [];
  // cutting off a necessary item for the slice to be full
  // omitting the overbound
  Object.keys(wordsIdToSequenceTable).forEach((wordId) => {
    // console.log(wordId, wordsIdToSequenceTable[wordId])
    // wordsIdToSequenceTable[wordId].forEach(id => {
    //     console.log(sequenceTable[id])
    // })

    let low = wordsIdToSequenceTable[wordId][0];
    let high = low;
    let i = low;
    const length = wordsIdToSequenceTable[wordId].length;
    let words = [];

    const lastPosition = wordsIdToSequenceTable[wordId][length - 1];
    for (; low <= high && high < lastPosition && i < lastPosition; i += 1) {
      high += 1;

      // stop counting, collect and shrink the window
      if (sequenceTable[high].word > sequenceTable[high - 1].word) {
        words = [...words, makeWord(sequenceTable, low, high)];

        low = high;

        // direction has been flipped
      } else if (sequenceTable[high].word < sequenceTable[high - 1].word) {
        collectionOfWords = [
          ...collectionOfWords,
          [...words, makeWord(sequenceTable, low, high)],
        ];
        words = [];

        low = high;

        // at last position but treat as if direction has been flipped at the end
      } else if (high === lastPosition) {
        collectionOfWords = [
          ...collectionOfWords,
          [...words, makeWord(sequenceTable, low, high + 1)],
        ];
        words = [];
      }
    }
  });
  return collectionOfWords;
};

const setupAddToStates = () => {
  let sequenceTable = [];
  const inputData = [
    ["aaa", "bbb", "c"],
    ["d", "ee", "fff"],
    ["a nother word", "5555", "g"],
    ["a first word", "888", "ggggg"],
  ];
  let rows1 = makeSequenceRows([inputData[0], inputData[1]], sequenceTable);
  // console.log(rows1)
  sequenceTable = [...sequenceTable, ...rows1];
  // sequenceTable.forEach(y => [
  //     console.log(y)
  // ])

  let wordsId = sequenceTable[sequenceTable.length - 1].words;

  let wordsIdToSequenceTable = {};

  const ids = rows1.map((row) => row.id);
  wordsIdToSequenceTable = { ...wordsIdToSequenceTable, [wordsId]: ids };
  // Object.keys(wordsIdToSequenceTable).forEach(id => {
  //     console.log(id, wordsIdToSequenceTable[id])
  // })

  let rows2 = makeSequenceRows([inputData[2], inputData[3]], sequenceTable);
  sequenceTable = [...sequenceTable, ...rows2];

  // console.log(rows2)
  // sequenceTable.forEach(y => [
  //     console.log(y)
  // ])
  let wordsId2 = sequenceTable[sequenceTable.length - 1].words;

  const ids2 = rows2.map((row) => row.id);
  wordsIdToSequenceTable = { ...wordsIdToSequenceTable, [wordsId2]: ids2 };
  // Object.keys(wordsIdToSequenceTable).forEach(id => {
  //     console.log(id, wordsIdToSequenceTable[id])
  // })
  // console.log(wordsIdToSequenceTable)
  let collectedWords = collectWords(sequenceTable, wordsIdToSequenceTable);
  // console.log(collectedWords)
  let failedFlag = false;
  inputData.forEach((listItem, i) => {
    listItem.forEach((word, j) => {
      for (var k in word) {
        if (word[k] !== collectedWords[i][j][k]) {
          // console.log(error)
          failedFlag = true;
        }
      }
    });
  });
  if (failedFlag) {
    console.log("collectWords");
  }
  // let x = 34
  // for(; x < 126 ; x++) {
  //     // console.log(String(x))
  //     console.log(String.fromCharCode(x))
  // }
  // put in a checking algorithm for each part
  // letterRows()

  // insert sequences to states table
  let stateTable = insertStateRows(["ab", "ns", "cd"], []);
  console.log(stateTable);
  // stateTable = insertStateRows(['a', 'n', 'c'], [])
};
const getLetterColumns = (row) => {
  // this may be a security glitch to be fixed in the future
  // the ascii edges are the only keys with length === 1
  let letters = Object.keys(row).filter((key) => key.length === 1);

  let letterColumns = {};
  letters.forEach((letter) => {
    letterColumns = { ...letterColumns, [letter]: row[letter] };
  });
  return letterColumns;
};
const getLetterEdgeColumns = (row) => {
  return Object.keys(getLetterColumns(row)).filter((column) => row[column] > 0);
};
const letterRows2 = (letter, id, row) => {
  let letters = {};
  let number = 33;
  for (; number < 127; number++) {
    // console.log(String(x))
    const asciiCharacter = String.fromCharCode(number);
    // console.log(String.fromCharCode(x))
    letters = { ...letters, [asciiCharacter]: -1 };
  }
  // put in alot of old links {[letter]: id} if they exist
  if (letter !== -1 && id !== -1) {
    const oldEdges = getLetterColumns(row);
    letters = {
      ...letters,
      ...oldEdges, // will be no addition if there are no old edges
      [letter]: id,
    };
  }
  return letters;
  // console.log(letters)
};

const makeNewRow = (id) => {
  return {
    id: id,
    word: String.fromCharCode(31),
    letter: String.fromCharCode(31),
    ...letterRows(-1, -1, []), // needs to hold the next letter
    downStreamEndWord: -1,
    upStreamendWord: -1,
    nextStates: -1,
    parents: -1,
    children: -1,
    variableData: -1,
    // ith level in hierarchy
    // variable in state has been modified flag
  };
};
const isNMinusOneLetterRows = (row) => {
  // will only return true if there is at least 1 row with a link
  let letterRows = Object.keys(getLetterColumns(row));
  // console.log(letterRows)
  let linkRows = 0;
  letterRows.forEach((letter) => {
    // return false if there are no links and there is at least 1 row with the value
    // 0 or <= 2
    if (!(row[letter] > -1 || row[letter] === -1)) {
      return false;
    } else if (row[letter] > 0) {
      linkRows += 1;
    }
  });
  if (linkRows > 0) {
    return true;
  }

  // 1 or more rows > -1
  // all remaining rows (could be 0 rows) === -1
};
const inLetterRange = (letter) => {
  // console.log('checking leeter range', "|" + letter + "|")
  // console.log(letter.charCodeAt(0))
  const number = letter.charCodeAt(0);
  return number >= 33 && number < 127;
};
// will fail the moment we have 1 string the same as another but longer
// doesn't take the previous overlapping of strings as above
const isNMinusOneRow = (row) => {
  // console.log('here')
  return (
    row.id > -1 &&
    row.word.charCodeAt(0) === 31 && // is this the default letter?
    inLetterRange(row.letter) && // is there a letter
    isNMinusOneLetterRows(row) && // is there a link?
    row.downStreamEndWord === -1 &&
    row.upStreamendWord === -1 &&
    row.nextStates === -1 &&
    row.parents === -1 &&
    row.children === -1 &&
    row.variableData === -1
  );
};
const isNMinusOneRowHasObjectDataNode = (row) => {
  // needs to have the modificatins
  return (
    row.id > -1 &&
    row.word.charCodeAt(0) === 31 &&
    inLetterRange(row.letter) &&
    isNMinusOneLetterRows(row) &&
    row.downStreamEndWord === -1 &&
    row.upStreamendWord === -1 &&
    row.nextStates === -1 &&
    row.parents === -1 &&
    row.children === -1 &&
    row.variableData === -1
  );
};
// only going to work with the nth row if there is no n + kth row
const rowHasDataNoNPlusKInSequence = (row) => {
  // upStreamendWord and downStreamEndWord also might not have any data too
  // row.downStreamEndWord    === -1  | -1 | a
  // row.upStreamendWord      === -1  | a  | a + 1
  // row.nextStates           === -1  | a + 1 | a + 2
  // row.parents              === -1  | | a + 3
  // row.children             === -1  | | a + 4
  // row.variableData         === -1  | | a + 5
  // all the different seqence formulas
  // there is at least a -1 in 0 through n - 1 different attributes
  // the general sequence of values > -1 must be assending by at least 1
  // if the (+) function is always used to make new id's then as long as they increase
  // it's valid
  // just need -1 or any value > 0

  return (
    row.id > -1 &&
    row.word.charCodeAt(0) === 31 && // needs to be a string of length 1 or more
    inLetterRange(row.letter) && // is there a letter?
    isNMinusOneLetterRows(row) &&
    row.downStreamEndWord === -1 &&
    row.upStreamendWord === -1 &&
    row.nextStates === -1 &&
    row.parents === -1 &&
    row.children === -1 &&
    row.variableData === -1
  );

  // the nth row must have the following structure
  // 'id': getDefaultValue(stateTable, 'id'),
  // 'word' === the full word,
  // 'letter' is a letter
  //  letterRows has every column holding an id value === -1
  // the following columns must have a value > -1 and increasing by 1 value
  // from the first column to the next
  // 'downStreamEndWord'
  // 'upStreamendWord'
  // 'nextStates'
  // 'parents',
  // 'children',
  // 'variableData'
};
const addNewRow = (stateTable, currentId, letter, word) => {
  let newCurrentRow = {
    ...stateTable[currentId],
    letter: letter,
    word: word,
    // stateTable[currentId] is the old row. It may hold links
    ...letterRows(letter, stateTable.length, stateTable[currentId]), // needs to hold the next letter
  };
  stateTable = [
    ...stateTable.slice(0, currentId),
    newCurrentRow,
    ...stateTable.slice(currentId + 1, stateTable.length),
  ];

  return [...stateTable, makeNewRow(stateTable.length)];
};
// 1) need to group these functions by purpose

// 2) need to make a generic trie tree functions first as it will be used in 2 locations

const addRowsToStateTable = (
  idData,
  currentId,
  sequenceLength,
  stateName,
  stateTable
) => {
  // modify and return currentId
  stateName.forEach((word, i) => {
    for (var j in word) {
      // console.log(word[j], currentId)
      // console.log(getLetterColumns(stateTable[nextId]))
      // getLetterColumns(stateTable[nextId])
      // currentId should point to the last item matched or added
      let nextLetterEdge = getLetterColumns(stateTable[currentId])[word[j]];
      // console.log(nextLetterEdge)
      // new letter
      // console.log(i, j)
      const sequenceI = i + parseInt(j);
      // tested and works
      if (!isValidEdge(nextLetterEdge)) {
        // console.log(sequenceI, sequenceLength - 1, sequenceI < sequenceLength - 1)
        // if j === word.length - 1 then add in a word
        if (sequenceI < sequenceLength - 1) {
          stateTable = addNewRow(stateTable, currentId, word[j], word);
          // wordIds = [...wordIds, currentId]
          idData = {
            ...idData,
            [currentId]: {
              isCharacterOnlySlot: true,
              character: word[j],
              word: word[j],
              // newNode is misleading
              // isAStateObjectDataStoredHere
              isAStateObjectDataStoredHere: true,
            },
          };
        } else {
          stateTable = addNewRow(
            stateTable,
            currentId,
            word[j],
            String.fromCharCode(31)
          );
          idData = {
            ...idData,
            [currentId]: {
              isCharacterOnlySlot: false,
              character: word[j],
              word: word,
              isAStateObjectDataStoredHere: true,
            },
          };
        }
        currentId = stateTable.length - 1;
        // addedIds = [...addedIds, currentId]

        // need to add the link to the new one to

        // the letter was added from a previous call of insertStateRows
      } else if (isValidEdge(nextLetterEdge)) {
        // So we have an edge.  Is it a match to word[j]?
        const currentLetter = stateTable[nextLetterEdge]["letter"];
        // not tested yet
        if (currentLetter !== word[j]) {
          // not a match so need to add a new edge to stateTable[currentId]
          // and append a new row to the end of the array
          // not tested yet
        } else {
          // We do have a match

          // currently on last letter
          // it was already added from insertStateRows
          if (j === word.length - 1 && i === stateName.length - 1) {
            // currentId = nextLetterEdge
          } else {
            // there are more letters to go through
            // keep going
            // currentId = nextLetterEdge
          }
        }
      }
    }
  });

  return stateTable;
};
const insertStateRows = (stateName, stateTable) => {
  // will need the other 2 tables and the full info for a state to be complete
  console.log("insert rows");
  if (stateTable.length === 0) {
    // add root row
    stateTable = [makeNewRow(0)];
  }
  // console.log(stateTable)
  // let letterEdges = getLetterColumns(stateTable[0])

  // the following rules are for the stateName as a sequence of strings
  // consisting of a total of n characters
  // first 0 to n - 1 rows must have the following structure
  // 'id': getDefaultValue(stateTable, 'id'),
  // 'word' === -1,
  // 'letter' is a letter
  //  letterRows has exactly 1 column holding an id value > -1
  // the following columns must have a value === -1
  // 'downStreamEndWord'
  // 'upStreamendWord'
  // 'nextStates'
  // 'parents',
  // 'children',
  // 'variableData'

  // the nth row must have the following structure
  // 'id': getDefaultValue(stateTable, 'id'),
  // 'word' === the full word,
  // 'letter' is a letter
  //  letterRows has every column holding an id value === -1
  // the following columns must have a value > -1 and increasing by 1 value
  // from the first column to the next
  // 'downStreamEndWord'
  // 'upStreamendWord'
  // 'nextStates'
  // 'parents',
  // 'children',
  // 'variableData'

  // for the n + 1 columns(to make a unique path)
  // how to mention the letterRows will have the next value set, so on subsequent adds
  // the set value will "rotate" through the columns
  // 'id': getDefaultValue(stateTable, 'id'),
  // 'word' === the full word,
  // 'letter' is a letter
  //  letterRows has every column holding an id value === -1
  // the following columns must have a value > -1 and increasing by 1 value
  // from the first column to the next
  // 'downStreamEndWord'
  // 'upStreamendWord'
  // 'nextStates'
  // 'parents',
  // 'children',
  // 'variableData'
  // let addedIds = [0]
  // let wordIds = []
  // so we can find the [0, n - 1], n, and n + k elements for the sequence of length n + k(extra dimentions)
  let idData = {
    0: { isCharacterOnlySlot: true, word: String.fromCharCode(31) },
  };
  let currentId = 0;
  const sequenceLength = stateName.join("").length;
  stateTable = addRowsToStateTable(
    idData,
    currentId,
    sequenceLength,
    stateName,
    stateTable
  );

  // the validation should reflect the structual properties of the storage routine
  // prove all entries have been added in correctly
  let failed = false;
  // idData should eventually have all of the ids of the rows visited and added
  Object.keys(idData).forEach((id) => {
    //  {isCharacterOnlySlot: true, character: "a", word: "a", isNewNode: true}
    // [0, n - 1] nodes
    if (id >= 0 && id < sequenceLength - 1) {
      if (idData[id].isCharacterOnlySlot) {
        // [0, n - 1]
        if (!idData[id].isAStateObjectDataStoredHere) {
          // run isNMinusOneRow test(default test)
          // [0, n -1] => n
        } else {
          // run isNMinusOneRowHasObjectDataNode(node data has been added to this one) test (has node data test)
        }
      }
      // n
      else if (id == sequenceLength - 1) {
        // new item
        if (!idData[id].isAStateObjectDataStoredHere) {
          // run isNRow test(default test)
        }
        // n => n U [n + 1, n + k] k is the number of extra strings added to the list of state names
        // [n, n + k]
      } else if (id >= sequenceLength - 1 && id < Object.keys(idData).length) {
      }
    }
  });
  // path test
  // traverse through the rows and make sure the order of ids recorded match the path
  // addedIds.forEach(id => {
  //     // console.log(id)
  //     // isNMinusOneRow(stateTable[id])
  //     // why is it acting like this function was called only 1 time?
  //     if(id < addedIds.length - 1 && !isNMinusOneRow(stateTable[id])) {
  //         console.log('one of the rows has a problem')
  //         failed = true
  //     }
  // })
  console.log(idData);

  // console.log("failed ===", failed)
  // [0, n - 1] new rows have been validated
  // currentId should be at the nth row now
  // const currentRow = stateTable[ addedIds[addedIds.length - 2] ]
  // console.log(currentRow)
  //     // is the link from the last item the same number as currentId?
  // let linkFromNMinusOneToNthItem = getLetterEdgeColumns(currentRow).filter(column => currentRow[column] === currentId)
  // console.log(linkFromNMinusOneToNthItem)
  // if we are at the last one(added or just a match)
  // is the row data already set?
  // yes, then we have to generate a unique dimention path to ensure this state is unique
  //
  // else
  // fill out the row
  // console.log(stateTable)
  return stateTable;
};
// 'added'
// 'deleted'
// 'unset'
// make records shallow and deep
// alter records shallow and deep
// collect records shallow and deep
// user interface for adjusting records
// collecting records
// cleaning records
// no nested objects/arrays allowed, because it's too many details to track
// assume there are no nested objects to be tracked(not to be confused with how the tracking system is structured)
// assume all the data is an object

// value = {v: single_character, isModified: flagName, position: value, parentKeyChange: true}
// no nesting of any kind
// use tables for all things
// single object with key, values
/*
{
    0: {v: single_character, isModified: flagName, position: value, parentKeyChange: false},
    1: {v: single_character, isModified: flagName, position: value, parentKeyChange: false},
    2: {v: single_character, isModified: flagName, position: value, parentKeyChange: false},
    isModified: flagName,
    position: value,
    parentKeyChange: false
}

{
    one: {v: single_character, isModified: flagName, position: value, parentKeyChange: true},
    two: {v: single_character, isModified: flagName, position: value, parentKeyChange: true},
    three: {v: single_character, isModified: flagName, position: value, parentKeyChange: true},
    isModified: flagName,
    position: value,
    parentKeyChange: false
}
isModified represents the array as a whole.  It doesn't represent the individual items
flag values: unset, added, deleted
*/
const makeNode = (value) => {
  return { data: value, flag: "new" };
};
const deleteNode = (value) => {
  console.log("deleted", value);
  return { ...value, flag: "deleted" };
};
const unsetNode = (value) => {
  return { ...value, flag: "unset" };
};

const convertString = (string, cb) => {
  let newArray = [];
  for (var i in string) {
    // O(n^2) but no mutation
    newArray = [...newArray, cb(string[i])];
  }
  return newArray;
};
const convertArray = (array, cb) => {
  let newArray = [];
  // O(n^2) but no mutation

  array.forEach((element) => {
    newArray = [...newArray, cb(element)];
  });
  return newArray;
};
const convertArrayRecursive = (array, recurse, cb) => {
  let newArray = [];

  // O(n^2) but no mutation
  array.forEach((element) => {
    newArray = [...newArray, recurse(element, cb)];
  });
  return newArray;
};

// there is a difference between putting data in my format and marking the users level of changes
const convertToRecordingForm = (object) => {
  // instead of 1 element, 1 array, 1 key vlue pair per recusive call, have 1 structure to handle
  // an array of objects or 1 object

  // if an object
  // theierData -> their data
  // type -> object
  // have a auxiliary object holding the flags for items
  // convert the string to an array of chars and have 1 flag for each char
  // the only 'nesting' allowed is turning a strng to an array of chars
  // 1 copy of their data structure but only keeping the shape and keys
  // console.log('convertToRecordingForm', object, typeof(object))
  // treat all items as objects
  if (typeof object === "string") {
    let newArray = convertString(object, makeNode);
    return newArray;
  }
  if (Array.isArray(object)) {
    let newArray = convertArray(object, makeNode);
    return newArray;
  }
  if (typeof object === "object") {
    // key -> value
    let keys = Object.keys(object);

    // n^2
    let newObject = {};
    keys.forEach((key) => {
      // if(Array.isArray(object[key])) {

      // }
      newObject = { ...newObject, [key]: makeNode(object[key]) };
    });
    return newObject;
  }
};

const convertToCallBackRecursive = (object, cb) => {
  // console.log('convert', object)
  // treat all items as objects

  if (typeof object === "string") {
    let newArray = convertString(object, cb);
    return newArray;
  } else if (Array.isArray(object)) {
    let newArray = convertArrayRecursive(
      object,
      convertToCallBackRecursive,
      makeNode
    );

    return newArray;
  } else if (typeof object === "object") {
    console.log("object", object);
    // key -> value
    let keys = Object.keys(object);

    // n^2
    let newObject = {};
    keys.forEach((key) => {
      newObject = {
        ...newObject,
        [key]: convertToCallBackRecursive(object[key], cb),
      };
    });
    return cb(newObject);
  }
};

const updateFlagsRecursive = (object, newFlagValue) => {
  // data, flag
  // object is the tracked object
  // newFlagValue is a string
  // console.log('change flag', object)
  if (Array.isArray(object)) {
    let newArray = [];
    object.forEach((element) => {
      newArray = [...newArray, updateFlagsRecursive(element, newFlagValue)];
    });
    return newArray;
  } else if (typeof object === "object") {
    // console.log("object", object)
    // key -> value
    let keys = Object.keys(object);

    // n^2
    let newObject = {};
    keys.forEach((key) => {
      newObject = {
        ...newObject,
        [key]:
          key === "flag"
            ? newFlagValue
            : updateFlagsRecursive(object[key], newFlagValue),
      };
    });
    // console.log(newObject)
    return newObject;
  } else {
    // object should be a single string now
    return object;
  }
};

// these functions are meant to operate on variable data deep inside the state chart
// the same data for teh type was used as the value
const pushBack = (packageArray) => {
  // console.log('push')
  // console.log(packageArray)
  let [trackedObject, newItem] = packageArray;
  // console.log('keys', Object.keys(array))
  // console.log(trackedObject)

  return {
    flag: trackedObject["flag"],
    data: {
      type: [...trackedObject["data"]["type"]],
      value: [...trackedObject["data"]["value"], makeNode(newItem)],
    },
  };
};
const popBack = (array) => {
  // console.log('pop')

  // console.log(array, array['data']['value'].map((item, i) => (i === array['data']['value'].length - 1) ? deleteNode(item) : item))
  return {
    flag: array["flag"],
    data: {
      type: [...array["data"]["type"]],
      value: [
        ...array["data"]["value"].map((item, i) =>
          i === array["data"]["value"].length - 1 ? deleteNode(item) : item
        ),
      ],
    },
  };
};

const insertItem = (array, i, value) => {
  // assumes the array has been converted to the recording form
  // the value is the data the user is interested in(not one with a recording flag)
  // friends = [
  //     ...friends.slice(0, friendIndex),
  //     friend,
  //     ...friends.slice(friendIndex + 1)
  //   ];
  return [...array.slice(0, i), makeNode(value), ...array.slice(i + 1)];
};

const edit = (array, i, value) => {
  // insert value at i, delete pushed old value at i + 1
  array = insertItem(array, i, value);
  // item to delete is now at i + 1
  return array.map((item, index) =>
    index === i + 1 ? deleteNode(item) : item
  );
};
const search = (array, value) => {
  let i = 0;

  array.forEach((item, index) => {
    if (item.data === value) {
      i = index;
      return i;
    }
  });
};
const nonEmptyArray = (object) => {
  if (object === null) return false;
  if (!Array.isArray(object)) return false;
  if (object.length === 0) return false;
  return true;
};

const nonEmptyObject = (object) => {
  if (object === null) return false;
  if (typeof object !== "object") return false;
  if (Object.keys(object).length === 0) return false;
  return true;
};
const collectMostShallowChange = (object) => {
  // the most shallow changes are collected(they bring all the deep changes with them)
  // object is the tracked object
  // need to return an array of tracked objects or a single tracked object
  // assume there are no nested objects to be tracked(not to be confused with how the tracking system is structured)
  // console.log('start here', object)

  // there is no way to know how deep or the path to the recorded key is to put the change
  // in context of the tree as a whole

  if (Array.isArray(object)) {
    let newArray = [];

    // O(n^2) but no mutation
    object.forEach((element) => {
      let newElement = collectMostShallowChange(element);
      if (newElement === null) {
        return;
      }
      // console.log('new element', newElement)

      newArray = [...newArray, newElement];
    });
    return newArray;
  } else if (typeof object === "object") {
    // console.log("object", object)
    // key -> value

    const flag = object["flag"];
    if (flag === "deleted" || flag === "new") {
      return object;
    }
    // else {
    //     return object
    // }
    // base case for {flag: "unset", data: "+"}
    else if (flag === "unset") {
      if (typeof object["data"] === "string") {
        return null;
      }
      // console.log(object)
      // dig into the tree
      let newObject = collectMostShallowChange(object["data"]);
      // console.log('object from data', newObject, newObject.length)
      return {
        flag: object["flag"],
        data: newObject,
      };
      // } else {
      //     console.log(object)
      //     return object
      // }
    } else {
      // not working right
      // data inside the object the 'data' key points to
      let newObject = {};
      let keys = Object.keys(object);
      // special case
      // assume there are object that only have the keys of type and value
      // and for those cases we only want the changed value not ('value' -> changed value)
      keys.forEach((key) => {
        let newItem = collectMostShallowChange(object[key]);

        // edge cases of the base cases being returned
        // need to know what type the value is to only return the value and not the key 'value' value pair
        if (!(nonEmptyArray(newItem) || nonEmptyObject(newItem))) {
          return;
        }
        console.log("new item", newItem);
        if (Object.keys(newItem).includes("data")) {
          if (Object.keys(newItem["data"]).length === 0) {
            return {};
          }
        }
        // if(key === 'value') {
        //     newObject = newItem
        // } else {
        // newObject = {   ...newObject,
        //                 [key]: newItem}
        // }
      });
      return newObject;
    }
  } else {
    // object should be a single string now
    return object;
  }
};

const collectFlaggedElements = (array) => {
  return array.filter((item) => item.flag !== "unset");
};

const cleanFlaggedElements = (array) => {
  return array
    .filter((item) => item.flag !== "deleted")
    .map((item) => (item.flag !== "unset" ? unsetNode(item) : item));
};
const cleanRecordsMostShallow = (object) => {
  // delete the most shallow objects
  // change 'new' flags to 'unset' on the most shallow items

  // object is the tracked object
  // need to return an array of tracked objects or a single tracked object
  // console.log(object)
  if (Array.isArray(object)) {
    let newArray = [];
    // O(n^2) but no mutation

    object.forEach((element) => {
      let newItem = cleanRecordsMostShallow(element);
      if (newItem !== null) {
        newArray = [...newArray, newItem];
      }
    });
    return newArray;
  } else if (typeof object === "object") {
    // console.log("object", object)
    // key -> value

    // what happens when we are in the keys of the data part of record?
    if (object["flag"] === "deleted") {
      return null;
    } else if (object["flag"] === "new") {
      // reset this one to unset and call the remaining items
      let newObject1 = cleanRecordsMostShallow(object["data"]);
      // not sure if this works
      return unsetNode({
        flag: object["flag"],
        data: newObject1,
      });
    } else if (object["flag"] === "unset") {
      let newObject = cleanRecordsMostShallow(object["data"]);
      // not sure if this works
      return {
        flag: object["flag"],
        data: newObject,
      };
    } else {
      let keys = Object.keys(object);

      // n^2
      let newObject = {};
      keys.forEach((key) => {
        let newItem = cleanRecordsMostShallow(object[key]);
        if (newItem !== null) {
          newObject = { ...newObject, [key]: newItem };
        }
      });
      return newObject;
    }
  } else {
    // object should be a single string now
    return object;
  }
};

const findState = (tree, path) => {
  if (tree === undefined) {
    return null;
  }
  if (path.length === 0) {
    return tree;
  }
  let firstNode = path[0];

  return findState(
    tree[firstNode],
    path.filter((node, i) => i > 0)
  );
};
/*


user data
{key: [chars]}
{key: number}
[{key: [chars]}]
[{key: number}]
[[chars]]
[numbers]
[chars]
number

[chars] or [numbers] or number

a char or a number is atomic

aux
{key: baseObject}
[{'objectFlag': flagValue, 'position': id, object: {key: baseObject}} ]
[baseObject]

baseObject
{'entryFlag': flagValue, 'position': id, 'container': [flags]}
{'entryFlag': flagValue, 'container': flag}

container, key, value pair, value container


test input data

user:
[ 'one', 2, three', 4]

machine:
{
    userData: [ ['o', 'n', 'e'], [2], ['t', 'h', 'r', 'e', 'e'], [4]]

    flags: [[{flag: 'flagData', position: 0}, 'flagData', 'flagData'],
            ['flagData'],
            ['flagData', 'flagData', 'flagData', 'flagData', 'flagData'],
            ['flagData']]
}

user:

{
    'key_1' : 'one',
    'key_2' : 2,
    'key_3' : 'three',
    'key_4' : 4

}
 machine:

 {
     ueserData: {
            'key_1' : ['o', 'n', 'e'],
            'key_2' : [2],
            'key_3' : ['t', 'h', 'r', 'e', 'e'],
            'key_4' : [4]
     },
     flags: {
            'key_1' : {
                'entryFlag': flagValue,
                'container': [{flag: 'flagData', position: 0}, 'flagData', 'flagData']
            },
            'key_2': {
                'entryFlag': flagValue,
                'container': ['flagData']
            },
            'key_3' : {
                'entryFlag': flagValue,
                'container': ['flagData', 'flagData', 'flagData', 'flagData', 'flagData']
            },
            'key_4' : {
                'entryFlag': flagValue,
                'container': ['flagData']
            }
        }
     
 }

 user:
{
    'key_1' : ['one'],
    'key_2' : [2],
    'key_3' : ['three'],
    'key_4' : [4]

}

[
    {
        'key_1' : 'one',
        'key_2' : 'two',
        'key_3' : 'three'
    },

    {
        'key_1' : 1,
        'key_2' : 2,
        'key_3' : 3
    },
    {
        'key_1' : 'one',
        'key_2' : 2,
        'key_3' : 'three'
        'key_4' : 4

    }
]

[
    {
        'key_1' : ['one'],
        'key_2' : ['two'],
        'key_3' : ['three']
    },

    {
        'key_1' : [1],
        'key_2' : [2],
        'key_3' : [3]
    },
    {
        'key_1' : ['one'],
        'key_2' : [2],
        'key_3' : ['three']
        'key_4' : [4]

    }
]

modify user info
need path to user data
need to interpret the structure of data to get through the path

test each case as a state using crud operations
show all the results in the webpage
then make new trie tree in c style in a new component using the js system functions made here
*/
//////
// deepAssign rerouting functions from user functions

const unsetFlags = (container, value) => {
  return updateFlagsRecursive(value, "unset");
};
const deletedFlags = (container, value) => {
  return updateFlagsRecursive(value, "deleted");
};

const newFlags = (container, value) => {
  return updateFlagsRecursive(value, "new");
};

const deletedFlag = (container, value) => {
  return deleteNode(value);
};

const cleanFlaggedRecordsMostShallow = (container, value) => {
  return cleanRecordsMostShallow(value);
};

const pushBackItem = (container, value) => {
  // the value contains the array and the item to push back
  return pushBack(value);
};
const popBackItem = (container, value) => {
  return popBack(value);
};

const cleanArray = (container, value) => {
  return cleanFlaggedElements(value);
};
const convertToRecord = (conainer, value) => {
  // console.log('convertToRecord', conainer, value)
  return convertToRecordingForm(value);
};

////////
/// deepAssign routing functions

const setToValue = (container, value) => {
  return value;
};
const append = (container, value) => {
  return [...container, value];
};
////////
const deepAssign = (state, path, value, cb) => {
  // state is an object
  // console.log("deep copy", path)
  // console.log("path", path)
  // console.log("reduced path", path.filter((node, i) => i > 0))
  // console.log(path.length === 0)
  // console.log(state)

  if (path.length === 0) {
    // console.log("replace", state, value)
    return cb(state, value);
  } else if (path.length > 0) {
    const firstNode = path[0];

    if (!state.hasOwnProperty(firstNode)) {
      // copy of original with some object references from the original?
      return { ...state };
    } else {
      return {
        ...state,
        // [] seems to protect the variable name from being treated as a key
        [firstNode]: deepAssign(
          state[firstNode],
          path.filter((node, i) => i > 0),
          value,
          cb
        ),
      };
    }
  }
};

// for converting only the value in {type: string, value: '543242} to record from
const getVariableValuePath = (parent, variableName) => {
  // console.log(['stateTrie', ...parent, 'variables', variableName, 'variable', 'value'])
  return [
    "stateTrie",
    ...parent,
    "variables",
    variableName,
    "variable",
    "value",
  ];
};

// for converting the entire object {type: string, value: '543242} to record from
const getVariableValuePath2 = (parent, variableName) => {
  return ["stateTrie", ...parent, "variables", variableName, "variable"];
};

const getVariableValueFromParent = (parent, variableName) => {
  return findState(tree, getVariableValuePath(parent, variableName));
};

const getVariableValueFromParent2 = (parent, variableName) => {
  return findState(tree, getVariableValuePath2(parent, variableName));
};
/////
// user functions for shallow operations
const userAppend = (tree, parentState, variableName, value) => {
  // console.log(parentState, variableName, value)
  const variableValuePath = getVariableValuePath2(parentState, variableName);
  // console.log(variableValuePath)
  tree = deepAssign(
    tree,
    variableValuePath, // path
    [findState(tree, variableValuePath), value], // data to set
    pushBackItem
  );
  return tree;
};
const userPopBack = (tree, parentState, variableName) => {
  const variableValuePath = getVariableValuePath2(parentState, variableName);

  tree = deepAssign(
    tree,
    variableValuePath, // path
    findState(tree, variableValuePath), // data to set
    popBackItem
  );
  return tree;
};

const userConvertToRecord = (tree, parent, variableName) => {
  const variableValuePath = getVariableValuePath(parent, variableName);
  tree = deepAssign(
    tree,
    variableValuePath, // path
    findState(tree, variableValuePath), // data to set
    convertToRecord
  );
  return tree;
};
// not correct path construction
// only works for a path of 1 key
const addDatasToPath = (path) => {
  // path is a list of strings
  let newPath = [];
  path.forEach((item) => {
    newPath = [...newPath, "data", "value", "data", item];
  });
  return newPath;
};
/// data, value
const userDeepDeleteKeyValue = (tree, parent, variableName, pathToKey) => {
  //have to put data between each item in pathToKey
  const fullPath = [
    ...getVariableValuePath2(parent, variableName),
    ...addDatasToPath(pathToKey),
  ];
  console.log(fullPath);
  console.log("data found", findState(tree, fullPath));
  // passed entire array into the delete flag function
  // need to come up with a different function than deletedFlag
  // used to treat arrays like they were objects
  tree = deepAssign(
    tree,
    fullPath, // path
    findState(tree, fullPath), // data to set
    deletedFlag
  ); // only delete the level the user specifies
  // console.log('deleted from tree', tree)
  return tree;
};
/////

const cleanRecords = (tree, parent, variableName) => {
  const variableValuePath = getVariableValuePath(parent, variableName);

  tree = deepAssign(
    tree,
    variableValuePath, // path
    findState(tree, variableValuePath), // data to set
    cleanArray
  );
  return tree;
};
const cleanRecordsDeep = (tree, parent, variableName) => {
  // erase all objects having a flag of deleted
  // change all 'new' flags to unset
  let path = getVariableValuePath2(parent, variableName);

  tree = deepAssign(
    tree,
    path, // path
    findState(tree, path), // data to set
    cleanFlaggedRecordsMostShallow
  );
  return tree;
};

// I'm aware all states and vars are accessible using tree(It's a convenience for now),
// but the idea is for the child states to only use data from the parent
// This is not only about making a calculator app.
// It's about making a flexible program representation and the calculator app
// is just a test input.
const returnTrue = (tree, parent, currentState) => {
  return true;
};
const returnFalse = (tree, parent, currentState) => {
  return false;
};

// const makePath = (currentState, variableNameList) => {
//     // variable name is not a list anymore
//     return ['stateTrie', ...currentState, 'variables', ...variableNameList]
// }

// can the tracking system be done without the user writing any tracking code?
// yes if the tracking code is made before or after the state function code gets run
const startState = (parent, currentState) => {
  // parent is currently root which is a non-existtant dummy state
  // load up the downstream
  // ['stateTrie']
  // console.log("start state", currentState)
  // storeIntoDownStreamStart(currentState, 'input')

  // console.log("my tree", tree)

  return true;
};

const splitState = (parent, currentState) => {
  // console.log('in split', parent, currentState)
  // console.log("my tree", tree)
  // storeIntoDownStreamEnd(currentState, 'input')
  // console.log(tree)
  return true;
};

const collectChar = (parent, currentState) => {
  // let i = var_store['i']
  // let input = var_store['input']
  // //console.log(input[i])
  // if (input[i] != ' ')
  // {
  //     var_store['collected_string'] += input[i]
  //     var_store['i'] += 1
  //     return true

  // }
  // return false
  // console.log("collectChar")
  // console.log(tree)

  // console.log(parent)
  // let variableName = 'input'
  // console.log(getVariableValuePath2(parent, 'input'))
  // console.log(findState(tree, getVariableValuePath2(parent, 'input')))
  let variable = getVariableValueFromParent2(parent, "input");
  // console.log('input', variable)
  // console.log(getVariableValueFromParent(parent, 'tokens'))
  let x = convertToRecordingForm([2, 3, 4]);
  // console.log(x)

  let y = convertToRecordingForm("12345");
  // console.log(y)

  let z = convertToRecordingForm([
    { group: "no", object: { token: "12", category: "number" } },
  ]);
  // console.log(z)
  // the original record for array assumed the array was not already turned into a dict, hence the need for varaible
  // now that variable is gone, we are not at an array anymore
  // converted an empty string to an empty array in the value attribute
  // tree = userConvertToRecord(tree, parent, 'collectedString')
  // let variableValuePath = getVariableValuePath(parent, 'collectedString')
  // ["stateTrie", ...parent, 'variables', 'collectedString', 'variable', 'value']
  // tree = deepAssign(  tree,
  //                     variableValuePath,  // path
  //                     findState(tree, variableValuePath), // data to set
  //                     convertToRecord)
  // console.log('converted', getVariableValueFromParent2(parent, 'collectedString'))

  // convert tree variable
  // append
  tree = userAppend(tree, parent, "collectedString", "1");

  // tree = deepAssign(  tree,
  //                     variableValuePath,  // path
  //                     [findState(tree, variableValuePath), '1'], // data to set
  //                     pushBackItem)
  // console.log('append', getVariableValueFromParent(parent, 'collectedString'))

  tree = userAppend(tree, parent, "collectedString", "+");

  // tree = deepAssign(  tree,
  //                     variableValuePath,  // path
  //                     [findState(tree, variableValuePath), '+'], // data to set
  //                     pushBackItem)
  // console.log('append', getVariableValueFromParent(parent, 'collectedString'))

  // popBack
  tree = userPopBack(tree, parent, "collectedString");
  // tree = deepAssign(  tree,
  //                     variableValuePath,  // path
  //                     findState(tree, variableValuePath), // data to set
  //                     popBackItem)
  // console.log('popBack', getVariableValueFromParent(parent, 'collectedString'))

  // collect records
  // let records = collectFlaggedElements(getVariableValueFromParent(parent, 'collectedString'))
  // console.log(records)
  // clean out
  // tree = cleanRecords(tree, parent, 'collectedString')

  // tree = deepAssign(  tree,
  //                     variableValuePath,  // path
  //                     findState(tree, variableValuePath), // data to set
  //                     cleanArray)
  // console.log('cleaned', getVariableValueFromParent(parent, 'collectedString'))
  // console.log(tree)

  tree = userConvertToRecord(tree, parent, "tokens");

  tree = userAppend(tree, parent, "tokens", "12");
  tree = userAppend(tree, parent, "tokens", "+");
  tree = userAppend(tree, parent, "tokens", "20");

  tree = userPopBack(tree, parent, "tokens");

  // console.log('tokens result', getVariableValueFromParent(parent, 'tokens'))
  // let tokensRecords = collectMostShallowChange(getVariableValueFromParent(parent, 'tokens'))
  // console.log('chages from tokens', tokensRecords)

  // tree = cleanRecordsDeep(tree, parent, 'tokens')
  // console.log(tree)

  // console.log('testing recursive convert to recording form')
  // const newStuff = getVariableValueFromParent2(parent, 'input')
  // console.log('here is recording form', newStuff)
  // let result = convertToCallBackRecursive({'type': 'string', 'value': '1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12', 'test' : {'key': 'nested value'}}, makeNode)
  // console.log(result)
  // console.log('testData stuff', getVariableValueFromParent2(parent, 'testData'))
  tree = userDeepDeleteKeyValue(tree, parent, "testData", ["test"]);
  // tree = cleanRecordsDeep(tree, parent, 'testData')
  // let path = getVariableValuePath2(parent, 'testData')
  // tree = deepAssign(     tree,
  //                         path,  // path
  //                         findState(tree, path), // data to set
  //                         unsetFlags)
  // console.log("done with collectChar", tree)
  // const resultChangedFlag = updateFlagsRecursive(newStuff, 'unset')
  // console.log(resultChangedFlag)
  // console.log('done')
  // console.log(tree)
  // let ggg  = convertToCallBackRecursive({'type': 'object', 'value': {'test': 'nested value'}}, makeNode)
  // console.log('testing', ggg)
  return true;
};
var tree = {
  // /* done */'input' : /* passes '1 + 2 + 3 + 4',*//*'1 + 2 + 3 + 4 - 5 + 6 + 7 - 8 - 9 + 10 + 11 + 12',*//*'1+',*//*'1 +2',*/'1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12', // '1 '
  // 10 - 18 - 8 - 42
  //  /* done */'expression' : [],
  // 'collected_string' : '',
  // 'i' : 0,

  // 'operationVars' : {

  //     'a' : 0,

  //     'b' : 0},

  // 'lexVars' : {
  //     'operators' : ['*', '/', '-', '+'],
  //     'j' : 0,
  //     'operations' : {'*': "mult", '/': "divide", '+': "plus", '-': "minus"}},
  // this control graph uses string for states and cases
  stateTrie: {
    // any next states having {} means it is a finishing state(but having no edges as true signals an error )
    // {'next': [], 'children':[], 'functions':[]}
    // {'next': {'0': {}}, 'children':{'0': {}}, 'functions':{'0'}}
    // [start, 0], [start, variables]
    // 'function'   : "",
    // 'next'       : [[]],
    // 'children'   : [[]],
    // 'variable'   : ,
    // 'parents'    : [[]]
    // 'varChildren'
    // 'prev'

    // will have to check for key membership before accessing
    // I am  using object trees and linked lists as a more scalable way to solve nonlinear
    // problems than using a solution that would only work for the linear nature of this problem.
    // That way these techniques can be applied to many different kinds of programs much more different
    // than the calculator problem.
    start: {
      0: {
        function: startState,
        children: [["xyz"]],
        parents: [["root", "0"]],
        // var names only have to be unique within the scope of a unique state
        variables: {
          input: {
            // {i: {v: char}}
            // 'variable'  : newFunction('1 + 2 + 3 + 4 - 5 + 6 * 7 - 8 - 9 + 10 * 11 + 12', makeNode),
            parents: [["start", "0"]],
          },
          testData: {
            // { 'test' : {i: {v: char}}  }
            // 'variable'  : newFunction({'test': 'nested value'}, makeNode),
            parents: [["start", "0"]],
          },
          /// [0], []
        },
        downstream: {
          start: { input: ["split", "0"], testData: ["split", "0"] },
        },

        // source: user: [[varName, VarNamevarName]]   machne: {varName: data, destination: state}
        // destination: 1 to 1

        // hopper table: split, 0, variables, input -> [start, 0, variables, input]
        // ordered pairs of 1 source and many possible distinations(must all be unique)
        // start has
        //[{source, {destination: {varNameSource: varNameDestination}}}]

        // {destinationString, {source: {varName: data}}}

        // end has
        //[{destination, {source: {varName: data}}}]

        // A, not B(how long does A wait?kill all at end of last machine and note the ones that never got to B)
        // not A, B(Nothing came to B)
        // not A, not B(Do we check for travel lines that don't exist by accident?)
        // A, B(data was detected by B)
        // if data makes it
        // there is a destination key to find at the destination state
        // else
        // there is no destination key
        // print out there is a problem from the source to the destination and the data never came(no data came)
        // else if the user tries to access a variable that was supposed to be set by the transport system(how to know this?)
        // print out there is a problem from the source to the destination and the data never came(the specifically accessible data
        // never came)
      },
    },
    // this state is only here to prove the downstream goes south from a to b
    xyz: {
      function: returnTrue,
      children: [["split", "0"]],
    },
    split: {
      0: {
        function: splitState,
        next: [["validate"], ["invalid"]],
        children: [["char"]],
        parents: [["start", "0"]], // "variabls" are nested states from the "class" state
        variables: {
          input: {
            variable: null,
            parents: [["split", "0"]],
          },
          testData: {
            variable: null,
            parents: [["split", "0"]],
          },
          collectedString: {
            variable: convertToCallBackRecursive(
              { type: "string", value: "" },
              makeNode
            ),
            parents: [["split", "0"]],
          },
          // make full representation when building the trie
          // split/0/tokens/0...n =>  [[group: no, object: {token: '12', category: 'number'}]]

          tokens: {
            variable: convertToCallBackRecursive(
              { type: "list", value: [] },
              makeNode
            ),
            parents: [["split", "0"]],
          },
        },
        downstream: {
          end: { input: ["start", "0"], testData: ["start", "0"] },
        },
      },
    },
    // split
    char: {
      function: collectChar,
      next: [/*['last_to_save'], */ ["char"] /*, ['save']*/],
      parents: [["split"]], // actually needs parents because it's the first state checked from split
    },

    save: {
      function: "save",
      next: [[" "]],
    },

    " ": {
      function: "cf.parseChar",
      next: [[" "], ["init"]],
    },

    init: {
      function: "init",
      next: [["char"]],
    },

    last_to_save: {
      function: "lastToSave",
    },

    validate: {
      function: "validate",
      next: [["evaluateExpression", "0"]],
    },

    // represents a state machine so needs to have variables
    "order of operations": {
      0: {
        function: "returnTrue",
        next: [["inputHas1Value"], ["evaluateExpression"]],
        children: [["accumulator", "0"]],
      },
      variables: {
        // variables in keep only loose their value
        keep: {
          varChildren: {
            i: 1,
            currentOperator: 1,
            operators: 1,
            currentTermStateName: { 0: 1 },
          },
        },
      },
    },
    // variable state so don't need to say variales
    operators: {
      varChldren: { "*": 1, "/": 1, "+": 1, "-": 1 },
    },

    "*": {
      function: "mult",
      next: [["/"]],
      parents: [["operators"]],
    },
    "/": {
      function: "divide",
      next: [["+"]],
      parents: [["operators"]],
    },
    "+": {
      function: "add",
      next: [["-"]],
      parents: [["operators"]],
    },
    "-": {
      function: "subtract",
      parents: [["operators"]],
    },

    currentTermStateName: {
      0: {
        variable: { type: "list", value: ["item", "0"] },
        parents: [["accumulator"]],
      },
      1: {
        variable: { type: "list", value: ["item", "0"] },
        parents: [["accumulator"]],
      },
      2: {
        variable: { type: "list", value: ["item", "0"] },
        parents: [["accumulator"]],
      },
    },
    accumulator: {
      // accumulator
      0: {
        children: [["operation"]],
      },
      variables: {
        keep: {
          varChildren: {
            operator: 1,
            acc: 1,
            currentTermStateName: { 1: 1 },
          },
        },
      },
      // the only code I can automate is the data being transfered on the ferry
      downstream: {
        start: [],
      },
      upstream: {
        end: [],
      },
    },
    operator: {
      variable: { type: "string", value: "" },
      parents: [["accumulator", "0"]],
    },
    acc: {
      variable: { type: "int", value: 0 },
      parents: [["accumulator", "0"]],
    },

    // assume each parent may have a 'ferry' context for results going upstream or downstream.
    operation: {
      0: {
        children: [["a"]],
      },
      variables: {
        keep: {
          // 2 kinds of data
          // representation data
          // temporary data
          // assume the things made in the functions will be put into an erase category?
          varChildren: {
            x: 1,
            y: 1,
            z: 1,
            currentTermStateName: { 2: 1 },
          },
        },
      },
      // this context will hold the value of z, because x, y, and z will be erased
      // when b is done running
      upstream: {
        start: [],
      },
      downstream: {
        end: [],
      },
    },
    x: {
      variable: { type: "int", value: 0 },
      parents: [["operation"]],
    },
    y: {
      variable: { type: "int", value: 0 },
      parents: [["operation"]],
    },
    z: {
      variable: { type: "int", value: 0 },
      parents: [["operation"]],
    },
    // a + b
    // a / b
    // a op b stuff goes here
    a: {
      function: "getA" /*  setKindOfNumberToA */,
      next: [["op"], ["chain is over"]],
      parents: [["evaluateExpression"]],
    },

    op: {
      function: "cf.parseChar",
      next: [["error"], ["b", "evaluate"]],
    },

    b: {
      evaluate: {
        function: "evaluate",
      },
    },
    // a + b + c
    // acc op= b stuff goes here
    // deal with jumping across breaks in the accumulator chain
    // start putting in evaluator with
    //
    // order of operations goes here
    // evaluateChain

    i: {
      variable: { type: "int", value: 0 },
    },

    currentOperator: {
      variable: { type: "int", value: 0 },
    },

    expression: {
      variable: { type: "list", value: [] },
      parents: [["evaluateExpression"]],
    },

    op_ignore: {
      function: "cf.parseChar",
      next: [["error"], ["value_ignore", "0"]],
    },

    value_ignore: {
      0: {
        function: "cf.parseChar",
        next: [
          ["reset_for_next_round_of_input"],
          ["op_ignore"],
          ["value_ignore", "valid_op"],
        ],
      },
      valid_op: {
        function: "validOp",
        next: [["op"]],
      },
    },

    error: {
      function: "noMoreInput",
    },

    invalid: {
      function: "inputIsInvalid",
    },

    reset_for_next_round_of_input: {
      function: "resetForNextRound",
      next: [["end_of_evaluating"]],
    },

    end_of_evaluating: {
      function: "returnTrue",
    },
    input_has_1_value: {
      function: "showAndExit",
    },
  },
};

var stateChangesAllLevels = [];
var stateCount = 0;

class Data extends React.Component {
  constructor() {
    super();
    this.state = { stateChanges: [] };
  }

  // for now let all functions access all variables using a path of length 1
  // the point is to fight react as little as possible(don't know if we can access
  // and modify nested state by using recursion and a path of state)
  // the variable's role determines where it is in the graph

  // save = (store, var_store, node) => {

  //     let i = var_store['i']
  //     let input = var_store['input']
  //     if (input[i] === ' ')
  //     {
  //         let collected_string = var_store['collected_string']
  //         var_store['expression'].push(collected_string)
  //         return true

  //     }
  //     return false
  // }
  // init = (store, var_store, node) => {

  //     let i = var_store['i']
  //     let input = var_store['input']
  //     if (input[i] != ' ')
  //     {
  //         var_store['collected_string'] = ''
  //         return true
  //     }
  //     return false
  // }

  // lastToSave = (store, var_store, node) => {

  //     if (endOfInput(store, var_store, node))
  //     {
  //         let collected_string = var_store['collected_string']
  //         var_store['expression'].push(collected_string)
  //         var_store['input'] = var_store['expression']
  //         var_store['i'] = 0
  //         var_store['expression'] = []
  //         var_store['collected_string'] = ''
  //         return true
  //     }
  //     return false
  // }
  // getA = (parent, currentState) => {
  //     // use setState(), no mutation
  //     // https://stackoverflow.com/questions/18933985/this-setstate-isnt-merging-states-as-i-would-expect
  //     // https://github.com/VoliJS/NestedLink
  //     // test and figure out what works before converting everything
  //     // this.setState({ selected: { name: 'Barfoo' }});

  //     // var newSelected = Object.assign({}, this.state.selected);
  //     // newSelected.name = 'Barfoo';
  //     // this.setState({ selected: newSelected });

  //     // this.setState({ selected: Object.assign({}, this.state.selected, { name: "Barfoo" }) });
  //     // 'evaluateExpression' , '0'
  //     // let a = stateTrie['x']

  //     // all chains start with this function
  //     // this.state = {
  //     //     ...this.state,
  //     //     operation_vars: {chain_length: 0}
  //     // }
  //     // this.setState({operationVars: {chainLength: 0}})
  //     // var_store['operation_vars']['chain_length'] = 0

  //     //console.log(var_store['operation_vars']['kind_of_number'])
  //     let i = this.state['stateTrie']['i']
  //     let input = this.state['stateTrie']['input']
  //     let chainLength = this.state['stateTrie']['chainLength']

  //     // a = input[i]

  //     // this.state = {
  //     //     ...this.state,
  //     //     operation_vars: {a: input[i]}
  //     // }
  //     // this.setState({operation_vars: {a: input[i]}})
  //     // var_store['operation_vars']['a'] = input[i]

  //     // let chainLength = this.state["operationVars"]["chainLength"]
  //     // this.state = {
  //     //     ...this.state,
  //     //     operation_vars: {chainLength: chainLength + 1}
  //     // }
  //     // this.setState({operation_vars: {chainLength: chainLength + 1}})
  //     // this.state = {
  //     //     ...this.state,
  //     //     i: this.state["i"] + 1
  //     // }

  //     this.state = {
  //         ...this.state,
  //         'stateTrie' : {
  //             ...this.state['stateTrie'],
  //             'x' : {
  //                 ...this.state['stateTrie']['x'],
  //                 'variable' : {
  //                     ...this.state['stateTrie']['x']['variable'],
  //                     'value' : input[i]
  //                 }
  //             },
  //             'operatorChainLength' : {
  //                 ...this.state['stateTrie']['operatorChainLength'],
  //                 'variable' : {
  //                     ...this.state['stateTrie']['operatorChainLength']['variable'],
  //                     'value' : chainLength + 1
  //                 }
  //             },
  //             'i' : {
  //                 ...this.state['stateTrie']['i'],
  //                 'variable' : {
  //                     ...this.state['stateTrie']['i']['variable'],
  //                     'value' : i + 1
  //                 }
  //             }
  //         }
  //     }
  //     // var_store['operation_vars']['chain_length'] += 1
  //     // this.setState({i: this.state["i"] + 1})
  //     // var_store['i'] += 1
  //     //console.log(var_store)

  //     return true
  // }

  // getB = (parent, currentState) => {

  //     //console.log(var_store['operation_vars']['kind_of_number'])
  //     let i = this.state['stateTrie']['i']
  //     let input = this.state['stateTrie']['input']

  //     var_store['operation_vars']['b'] = input[i]
  //     var_store['operation_vars']['chain_length'] += 1
  //     var_store['i'] += 1

  //     // update
  //     this.state = {
  //         ...this.state,
  //         'stateTrie' : {
  //             ...this.state['stateTrie'],
  //             'x' : {
  //                 ...this.state['stateTrie']['x'],
  //                 'variable' : {
  //                     ...this.state['stateTrie']['x']['variable'],
  //                     'value' : input[i]
  //                 }
  //             },
  //             'operatorChainLength' : {
  //                 ...this.state['stateTrie']['operatorChainLength'],
  //                 'variable' : {
  //                     ...this.state['stateTrie']['operatorChainLength']['variable'],
  //                     'value' : chainLength + 1
  //                 }
  //             },
  //             'i' : {
  //                 ...this.state['stateTrie']['i'],
  //                 'variable' : {
  //                     ...this.state['stateTrie']['i']['variable'],
  //                     'value' : i + 1
  //                 }
  //             }
  //         }
  //     }

  //     //console.log(var_store)

  //     return true
  // }

  // isOp = (parent, currentState) => {
  //     // check current operand with jth operand
  //     let i = var_store['i']
  //     let input = var_store['input']
  //     //console.log(input[i])
  //     let j = var_store['lex_vars']['j']
  //     let operators = var_store['lex_vars']['operators']
  //     return input[i] === operators[j]

  // }

  // evaluate = (store, var_store, node) => {

  //     //console.log(var_store)

  //     let i = var_store['i']
  //     let input = var_store['input']
  //     var_store['operation_vars']['b'] = input[i]

  //     let a = Number(var_store['operation_vars']['a'])
  //     let b = Number(var_store['operation_vars']['b'])

  //     let j = var_store['lex_vars']['j']
  //     let operators = var_store['lex_vars']['operators']
  //     let operations = var_store['lex_vars']['operations']

  //     var_store['operation_vars']['a'] = operations[operators[j]] (a, b)
  //     var_store['operation_vars']['b'] = 0
  //     var_store['i'] += 1
  //     let str_a = String(var_store['operation_vars']['a'])

  //     let chain_length = var_store['operation_vars']['chain_length']

  //     let before_the_chain = var_store['input'].slice(0, i - 2)

  //     let before_the_chain_len = before_the_chain.length
  //     let the_chain = str_a

  //     let after_the_chain = var_store['input'].slice(i + 1, var_store['input'].length)

  //     var_store['input'] = before_the_chain

  //     var_store['input'].push(the_chain)
  //     for(var k in after_the_chain)
  //     {
  //         var_store['input'].push(after_the_chain[k])
  //     }

  //     var_store['i'] = before_the_chain_len

  //     return true
  // }

  // ignoreOp = (store, var_store, node) => {

  //     let i = var_store['i']
  //     let input = var_store['input']
  //     //console.log(input[i])
  //     let j = var_store['lex_vars']['j']
  //     let operators = var_store['lex_vars']['operators']
  //     //console.log(operators[j])
  //     //console.log((input[i] === operators[j]))
  //     // need to prove input[i] is an operator, but not operators[j]
  //     //console.log(input[i], operators.includes(input[i]))
  //     if (endOfInput(store, var_store, node))
  //     {
  //         return false
  //     }
  //     if (operators.includes(input[i]) && (input[i] != operators[j]))
  //     {
  //         var_store['operation_vars']['a'] = 0
  //         return true
  //     }
  //     return false
  // }

  // endOfInput = (store, var_store, node) => {

  //     //console.log(node)
  //     //console.log(var_store)
  //     let i = var_store['i']
  //     let input = var_store['input']
  //     //console.log(i, i >= input.length)
  //     return i >= input.length
  // }

  // inputIsInvalid = (store, var_store, node) => {
  //     console.log('your input is invalid')
  //     return true
  // }

  // noMoreInput = (store, var_store, node) => {

  //     //console.log('at noMoreInput')
  //     return endOfInput(store, var_store, node)

  // }

  // saveDigit = (store, var_store, node) => {
  //     let char = cf.getChar(store, var_store)

  //     return (char >= '0' && char <= '9')

  // }

  // isWhiteSpace = (store, var_store) => {

  //     return cf.getChar(store, var_store) === ' '
  // }

  // mult = (a, b) => {

  //     return a * b
  // }
  // divide = (a, b) => {

  //     return a / b
  // }
  // plus = (a, b) => {
  //     //console.log(a, b)
  //     return a + b
  // }
  // minus = (a, b) => {

  //     return a - b
  // }

  // parsing_checks = {

  //     'op' : {'0':isOp},
  //     'value_ignore' : {'0':cf.isDigit},
  //     'op_ignore' : {'0': ignoreOp},
  //     ' ' : {'0':isWhiteSpace},

  // }

  // resetForNextRound = (store, var_store, node) => {

  //     let i = var_store['i']
  //     let input = var_store['input']
  //     if (i >= input.length)
  //     {
  //         //console.log(node)
  //         var_store['lex_vars']['j'] += 1
  //         var_store['i'] = 0
  //         return true
  //     }

  //     return false
  // }

  // showAndExit = (store, var_store, node) => {

  //     let input = var_store['input']
  //     if(input.length === 1)
  //     {
  //         console.log(input[0])
  //         return true
  //     }

  //     return false

  // }

  // validOp = (store, var_store, node) => {

  //     let i = var_store['i']
  //     let input = var_store['input']
  //     if (isOp(store, var_store, node))
  //     {
  //         var_store['operation_vars']['a'] = input[i - 1]
  //         return true
  //     }
  //     return true
  // }
  // validate = (store, var_store, node) => {

  //     // expressions list
  //     // len > 3
  //     // alternate # and op
  //     // make sure the alternate starts and ends with #
  //     var i = 1
  //     let input = var_store['input']
  //     //console.log(input)

  //     if (input.length >= 3)
  //     {
  //         if (Number(input[0]) === NaN)
  //         {

  //             return false
  //         }
  //         while (i < input.length)
  //         {
  //             // 2, 4, 6
  //             if (i % 2 === 1)
  //             {

  //                 if (!var_store['lex_vars']['operators'].includes(input[i]))
  //                 {
  //                     return false
  //                 }
  //             }
  //             // 1, 3, 5
  //             else
  //             {
  //                 if (Number(input[i]) === NaN)
  //                 {
  //                     return false
  //                 }
  //             }

  //             i += 1
  //         }
  //         if (Number(input[input.length - 1]) === NaN)
  //         {
  //             return false
  //         }

  //         return true

  //     }
  //     return false

  // }
  // make a half-designed version of this for making the full version
  // make it without the variable name generator and make the ferry function assume the ferry context wasn't made yet

  // assume a state tracker is an array of strings(need a trie because the ferry function
  // has to know if user make a ferry context already and for automatic variable generator)
  // flags:
  // children are parallel
  // bottom up dump vars(start and end)
  // top down dump vars(start and end)
  // the dump vars are to ferry data from
  // parent/child machine to another child/parent machine automitcally
  // make sure starts and ends don't overlap
  // next state can assume the prev's children have taken the data and sent it to the parent
  // f(next states)

  // nfa && dfa style
  // 1 loop for each state
  // dump data from parent if endpoint is specified
  // 1 loop to rerun any if the deep part doesn't pass ; backtracking
  // 1 loop to get the winnig state and index

  // get the status of node run
  // if child, put the next states into next states
  // if parent

  // if parent.parallel
  // concurrency
  // for each parent next state
  // {status, react-html(history of data), dataToTransfer(ferry vars through hierarchy)} = f([next state])

  // backtracking
  // if status is true
  // the winning state is true
  // dump data to parent from child if endpoint is specified
  // break
  // if all status's are false
  // the winning state is false

  // cncurrent paths conclude here
  // status = f(next states)

  // backtracking
  // if status is true
  // break
  // if status is false
  // the winning state is false
  // auto clean
  // delete all objects in the temp context of the parent machine
  // get data from the ferry context and transfer it to drop site

  // [free object] => parent of the children the ferry context was going to put into without visiting the intermediate nodes
  // now we already know what the start and stop points are, so the only thing needed is to say pass to child or pass to parent
  // the children receiveing the data can be considered 1 object
  // control flow and state can be reused via the hierarchy
  // have the object be a free state so anyone in any part of the tree needing to use it can use it
  // the control flow tree can be resued by having multiple parents
  // can't eliminate the transport data idea, just don't cross the streams
  // control flow can take 1 path to the functions using the data
  // object model can take another path to the functions using the data
  // applications: calculator -> representation -> langugae
  // make the language with this

  /*


bottom = {parent names: bottom object}

timelines for next states
assumes each state has a parents: {parentNames} attributes
parent : {
	"next state name": {
		threshold: 2,
		count: 3
		parentIsAlsoParentInStateChart: false,
		timelineWeAreIntrudingOn: correctTimelineParentName
	}
}

edges
{edgeName: "next state name",
isFromCorrecttimeline: 0}

is the parent a parent of the state in the state chart?
stateChart["next state name"]["parents"][parent] === undefined


how to we find out what timeline and what state to rerun
in the editor provide the timeline tree for all visible timelines
	if the user wants to connect to a state in a different timeline they have to click on the state
	nearest answestor algorithm is now only considering the number of visible timelines
O(# of timelines the user is paying attention to)

edge (stateName, if the timeline of that state is different from this one then timelineName)
edges: [edge]


parentTree = {
	'bottom': {
		parent12: {'edges': [a, state1, c]]
		parent2: {	'different timeline': {state1: parent12},
					'edges': [state1, state2],
					'winning states': [state1, state2],
					'indents': 0},
	}
	'graph': {
		parent3: {nextParent: null, prevParentCount: 2, ithChild: 3},
		parent2: {nextParent: parent3, prevParentCount: 1, ithChild: 1},
		parent12: {nextParent: parent3, prevParentCount: 1, ithChild: 1}
	}

}
How do we know we need to restart the machine vs stopping the machine after we run the end state?
	Have a queue of each unit of data the machine uses. Once the machine has finished processing the data at each level it quits
The timeline is the one currently in use from the current state
	the current state can have several timeilines connecting to it but each one will run separately
what if the timeline attribute is true for each node in the path?
is the data from the 'bottom' just being lifted from the graph? if so then the data there is temporary


No threshold becuase the same incomming edge can get run over and over again without all the incomming edges getting run
at least 1 time.
each state that can only run after the incomming edges get run once
	store the incoming state names so we can check if all incoming edges have been run 1 time


If state y has not succeeded in moving to the next state because it was unable to run any of it's next states it is a spin state
After it moves to the next state it's no longer a spin state. What if it's next states are empty? Does the timeline get removed?

t1 runs and can't run state y as prev state = '' and state y needs state x to run first
t2 runs an succeeds
	t2 is linked to t1 at state y, so t2 sends t1 it's state x to t1's prev state only if state y is not a spin state
t1 uses prev state = state x to activate it's state y

diference between same state repeating trial runs and rerunning it after some other states?
We can't assume any syncronized time the prevs come in from any other timeline to the timeline of consideration.
They can come in at any time and some may come in at the same time.

The keys for unlocking the states must come from different timelines(they define the idea of syncronizing multiple asyncronious processes at certain points in time)


while (we have not hit the chosen end state) or (the input queue with the top state is not empty)
	for each timeline
		set parallel processing flag
		for each next state
			if we have already successfully run a state
				if we are not doing parallel processing
					break
				else
					unlock state if possible
					run unlocked state if possible
					any still locked state or state that can be unlocked and run successfully gets to be in the next round
			else
				unlock state if possible
				run unlocked state if possible
				any still locked state or state that can be unlocked and run successfully gets to be in the next round


		for each winner
			if the winner is in range [2, n]
				the winner is a sibling timeline
			else
				the winne is a continuation of the current timeline at the current machine level or
				a new branch in the current timeline that goes 1 level below the current machine level
state = {
	name:
	functionName:
	inputQueue:
	nextStates:
	children:
	isVariable:
	value:
	isParallel:
	locks: { 	'parent a': {'state a': 0, 'locks active': []}, 
				'parent b': {'state b': 0, 'locks active': []}, 'timelines unlocked': []}
}
locks:
	deterministic:
		a state can have n locks from only 1 timeline but only 1 lock opens the state
	nondeterminstic:
		a state can have n locks from n timelines and at least 1 lock per timeline for all timelines must be opened to run the state
IEEE_Software_Design_2PC.pdf


*/

  isParent = (state) => {
    // return state.con
    return Object.keys(state).includes("children");
  };
  /// stream functions
  isDownStream = (state) => {
    let y = findState(tree["stateTrie"], state);

    let keys = Object.keys(y);
    // console.log(y)
    return keys.includes("downstream");
  };
  isDownStreamEnd = (state) => {
    if (this.isDownStream(state)) {
      return this.getDownStreamEnd(tree["stateTrie"], state) !== null;
    }
  };
  isDownStreamStart = (state) => {
    if (this.isDownStream(state)) {
      return this.getDownStreamStart(tree["stateTrie"], state) !== null;
    }
  };
  getDownStreamStart = (tree, currentState) => {
    return findState(tree, [...currentState, "downstream", "start"]);
  };
  getDownStreamEnd = (tree, currentState) => {
    return findState(tree, [...currentState, "downstream", "end"]);
  };

  stringifyState = (state) => {
    return state.join("~");
  };
  getDownStreamStartVariables = (tree, state, downstream) => {
    // the data from downstream the user setup is in the form {variableName: destinationState}
    // we want to return data in the form {varName: varData}
    // console.log('here')
    // console.log(state)
    const fullOutgoingVariablePaths = [
      "stateTrie",
      ...state,
      "downstream",
      "start",
    ];
    const variables = findState(tree, fullOutgoingVariablePaths);
    // console.log(variables)
    const variableNames = Object.keys(variables);
    variableNames.forEach((variableName) => {
      // console.log(variableName, variables[variableName])
      const fullVariablePath = [
        "stateTrie",
        ...state,
        "variables",
        variableName,
        "variable",
      ];
      const variableData = findState(tree, fullVariablePath);

      // The user can't use ~ to make state names or this will not work
      const stringifiedStateName = this.stringifyState(variables[variableName]);

      // console.log(variableName, variableData, stringifiedStateName)
      // inefficient but works

      downstream = {
        ...downstream,
        [stringifiedStateName]:
          downstream !== null
            ? {
                ...downstream[stringifiedStateName],
                [variableName]: variableData,
              }
            : { [variableName]: variableData },
      };
    });
    return downstream;
  };

  // this.setDownStreamEndVariables(tree, state, downStream)
  storeIntoDownStreamEndVariables = (tree, state, downStream) => {
    // state is the destination state
    // we want to read data from the downStream[stringifiedStateName] in the form {varName: varData}
    // we want to store each variable name in the dict into the variable location
    // described by the state and the variable name['stateTrie', ...state, 'variables', variableName, 'variable']

    // console.log(state, downStream)
    const stringifiedStateName = this.stringifyState(state);
    // console.log(downStream[stringifiedStateName])
    const variableNames = Object.keys(downStream[stringifiedStateName]);
    variableNames.forEach((variableName) => {
      const fullVariablePath = [
        "stateTrie",
        ...state,
        "variables",
        variableName,
        "variable",
      ];

      tree = deepAssign(
        tree,
        fullVariablePath,
        downStream[stringifiedStateName][variableName],
        setToValue
      );
      // set the copied data in variable to 'new'
      tree = deepAssign(
        tree,
        fullVariablePath,
        findState(tree, fullVariablePath),
        newFlags
      );
    });
    // console.log('did it work?', tree)
    return tree;
    // const fullVariablePath = ['stateTrie', ...state, 'variables', variableName, 'variable']
    // want to visit all the variables saved and match them to the empty variable slots in the destination state
    // make sure they match before saving them
  };
  //////
  ///// functions for collecting changes and cleaning changes in data
  collectChanges = (tree, state) => {
    const variableStateLevel = findState(tree, [
      "stateTrie",
      ...state,
      "variables",
    ]);
    if (variableStateLevel !== null) {
      const variableNames = Object.keys(variableStateLevel);
      // console.log('variables for this level', state, variableNames)
      // console.log('tree before collecting')
      // console.log(tree)
      // problems 1
      // 4 states should have change sets to look through
      let mapping = {};
      variableNames.map((variableName) => {
        // problem 2
        // doesn't find nested items and gives undfined for no changes found
        let changes = collectMostShallowChange(
          getVariableValueFromParent2(state, variableName)
        );
        // console.log('here are the changes collected for', variableName)

        // console.log(variableName, changes)
        // console.log(tree)
        mapping = { ...mapping, [variableName]: changes };
      });
      // console.log('after cleaning')
      // console.log(tree)
      return mapping;
    } else {
      // console.log('no vars for this level', state)
      return {};
    }
  };
  cleanChanges = (tree, state) => {
    const variableStateLevel = findState(tree, [
      "stateTrie",
      ...state,
      "variables",
    ]);
    if (variableStateLevel !== null) {
      const variableNames = Object.keys(variableStateLevel);
      // console.log('variables for this level', state, variableNames)
      // console.log('tree before collecting')
      // console.log(tree)
      // problems 1
      // 4 states should have change sets to look through
      // let mapping = {}
      variableNames.map((variableName) => {
        // problem 2
        // doesn't find nested items and gives undfined for no changes found
        // let changes = collectMostShallowChange(getVariableValueFromParent2(state, variableName))
        // console.log(variableName, changes)
        // console.log('before cleaning')
        // console.log(tree)
        // mapping = { ...mapping,
        //             [variableName] : changes}
        tree = cleanRecordsDeep(tree, state, variableName);
      });
      // console.log('after cleaning')
      // console.log(tree)
      return tree;
    } else {
      // console.log('no vars for this level', state)
      return tree;
    }
  };
  setupMachine = () => {
    let lastOne = this.visit(["start", "0"], [["start", "0"]], 0, null, null);
    stateChangesAllLevels = [lastOne, ...stateChangesAllLevels];
    // run deepAssign for entire forest
    this.setState({ stateChanges: stateChangesAllLevels });
    // console.log(this.state.stateChanges)
    // console.log(stateChangesAllLevels)
  };
  // showStates = () => {
  //     console.log(this.state.stateChanges)
  // }
  // each level calls this function 1 time
  visit = (parent, nextStates, recursiveId, downStream, upStream) => {
    // runs each runable state in the contextual state chart
    // time complexity
    // n * n
    // n nodes
    // each node runs a recording system that copies entire tree(n nodes)

    // 2 important things to be done when the user runs code in a state
    // they have to transport data from 1 level to another
    // they have to track all changes for debugging
    // this all has to fit into the unique state model(each state, each variable has a unique name so any level of
    // context can be expressed throughout the state chart)
    // the user also must be able to type in the variable name of their orginal choosing to access it
    // while the variable is also unique(hard to solve dilemna)
    // this must be a simple to use state machine(the user must feel like it's just regular programming)

    // transport system
    // The states are arranged in a hierarchy, and data will need to travel up and down, ideally with the
    // user doing very little.
    // The user sets the start state and the end state to enable their chosen data to automatically travel
    // between the hierarchical points.  The user doesn't need to write copy statements or prop drilling to acomplish this.  It's similar to Context API,
    // but the data will be able travel up and down.

    // sourceState: begin: varName -> destinationState : assume the varName will match the varName at
    // the destinationState
    // destinationState: end: varName -> sourceState : assume the varName will match the varName at
    // the sourceState

    // hopper table: destinationState -> {varName: varData}
    // the destination state will know the source so if the hooper data isn't there there than we know what A and B are
    // detecting the error of A -> B` -> B where B` is B but comes earlier(not currently implemented)
    // don't know how to detect other kinds of errors so the user can track them down quicker
    // generalized fully automated transport system for the user and detects 1 kind of error

    // record system
    // recording all changes the user mades to data
    // collect it after the state runs and after the hopper drops data to a parent state
    // this way we can track their changes from state to state
    // We can't run more than 1 state at a time becuase tracking and transporting data require all the data in our graph to be
    // copied.

    // if the user feels like it's cumbersome then the solution has failed
    // ['start', '0'] will be the parent 2 times in a row
    let numberOfChildrenRun = 0;
    console.log("visit", recursiveId, parent, nextStates, numberOfChildrenRun);
    // console.log(Object.keys(tree['stateTrie']))

    // try all the states
    // replace with a forEach
    let stateChangesCurrentLevel = [];
    let firstTimeRecursiveVisitWasRun = false;
    while (nextStates.length > 0) {
      if (stateCount === 5) {
        console.log("done with states");
        console.log();
        break;
      }
      let newNextStates = [];
      let ranTrueFunction = false;
      let resultOfFunction = false;

      // console.log(nextStates, ranTrueFunction)
      nextStates.forEach((state) => {
        // the callback function is just run so this will quit it early for the current round
        // of forEach
        if (ranTrueFunction) {
          return;
        }

        // don't want to run the 2nd true function
        if (resultOfFunction) {
          return;
        }

        let copiedDownStream = false;
        let downStreamHopperStateNamesList = [];
        if (this.isDownStreamEnd(state)) {
          tree = this.storeIntoDownStreamEndVariables(tree, state, downStream);
          copiedDownStream = true;
        }

        let currentState = findState(tree["stateTrie"], state);
        resultOfFunction = currentState["function"](parent, state);
        if (!resultOfFunction) {
          return;
        }
        ranTrueFunction = true;
        stateCount += 1;
        numberOfChildrenRun += 1;
        if (copiedDownStream) {
          const stringifiedStateName = this.stringifyState(state);
          downStreamHopperStateNamesList = Object.keys(
            downStream[stringifiedStateName]
          );
        }
        let stateRecords = {
          parentState: parent,
          stateName: state,
          firstParent: false,
          isParent: false,
          dataCopiedDown: copiedDownStream,
          downStreamHopperStateNames: downStreamHopperStateNamesList,
          variablesChanged: [],
        };
        if (this.isParent(currentState)) {
          if (numberOfChildrenRun === 1) {
            const mapping = this.collectChanges(tree, state);
            // console.log('measuring changes to first parent', state, mapping)
            tree = this.cleanChanges(tree, state);
            stateRecords = {
              ...stateRecords,
              firstParent: true,
              isParent: true,
              variablesChanged: mapping,
            };
          } else {
            // the change logging must only be run one time per state

            const mapping = this.collectChanges(tree, parent);
            // console.log('measuring changes to nth state', state, parent, mapping)
            tree = this.cleanChanges(tree, parent);
            stateRecords = {
              ...stateRecords,
              isParent: true,
              variablesChanged: mapping,
            };
          }
          if (this.isDownStreamStart(state)) {
            // we want to store the downstream data for each state that runs
            // and send it down
            downStream = this.getDownStreamStartVariables(
              tree,
              state,
              downStream
            );
          }

          stateChangesCurrentLevel = [
            ...stateChangesCurrentLevel,
            stateRecords,
          ];

          let currentLevelSaved = this.visit(
            state,
            currentState["children"],
            recursiveId + 1,
            downStream,
            upStream
          );
          // can't test this untill we have another path to test with
          if (!firstTimeRecursiveVisitWasRun) {
            firstTimeRecursiveVisitWasRun = true;
          }
          if (firstTimeRecursiveVisitWasRun) {
          } else {
            // splice stateChangesAllLevels if it is not the last one
            // use the current recursion depth [n, end) to splice it
          }
          stateChangesAllLevels = [currentLevelSaved, ...stateChangesAllLevels];
        } else {
          newNextStates = currentState["next"];
          const mapping = this.collectChanges(tree, parent);
          // console.log('measuring changes to nth state', state, parent, mapping)
          tree = this.cleanChanges(tree, parent);
          stateRecords = {
            ...stateRecords,
            variablesChanged: mapping,
          };

          stateChangesCurrentLevel = [
            ...stateChangesCurrentLevel,
            stateRecords,
          ];
        }
      });
      nextStates = newNextStates;
    }
    return stateChangesCurrentLevel;
  };
  render() {
    return (
      <div>
        {/* {console.log('happening')} */}
        {/* the parent and the first state to run need to be the same for the first call */}
        <button onClick={() => testInsert()}>start</button>
        {/* <button onClick={() => this.showStates()}>show states</button> */}

        {/* {this.state.stateChanges.length > 0 && this.state.stateChanges.map(level => (
                    level.map((state, i) => (
                        <State key={i} changes={state} />
                    ))
                ))} */}
      </div>
    );
  }
}
export default Data;
