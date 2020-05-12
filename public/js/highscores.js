var beachArray = ['sand', 'beach', 'surfing', 'waves', 'boardwalk', 'surfboard', 'shore', 'coast', 'sandbar'];
var campingArray = ['backpack', 'fishing' ,'campfire', 'forest', 'birds', 'animals', 'trees', 'waterfall'];

let selectThemeForm = document.getElementById("selectThemeForm");
let themeElement = document.getElementById("theme");
let answer = '';
let guessed = [];
let wordStatus = null;

let chancesLeft = 6
function beach(){
    rand = Math.floor(Math.random()*beachArray.length);
    answer = beachArray[rand];
}

function camping(){
    rand = Math.floor(Math.random()*campingArray.length);
    answer = campingArray[rand];
}

selectThemeForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    if (themeElement.value === 'camping'){
        camping();
        gameplay();
        
    } else if (themeElement.value === 'beach'){
        beach();
        gameplay();
}
});


function generateButtons(){
    let buttonsHTML = 
    `<button id="a" onclick="handleGuess('a')">a</button>
    <button id="b" onclick="handleGuess('b')">b</button>
    <button id="c" onclick="handleGuess('c')">c</button>
    <button id="d" onclick="handleGuess('d')">d</button>
    <button id="e" onclick="handleGuess('e')">e</button>
    <button id="f" onclick="handleGuess('f')">f</button>
    <button id="g" onclick="handleGuess('g')">g</button>
    <button id="h" onclick="handleGuess('h')">h</button>
    <button id="i" onclick="handleGuess('i')">i</button>
    <button id="j" onclick="handleGuess('j')">j</button>
    <button id="k" onclick="handleGuess('k')">k</button>
    <button id="l" onclick="handleGuess('l')">l</button>
    <button id="m" onclick="handleGuess('m')">m</button>
    <button id="n" onclick="handleGuess('n')">n</button><br>
    <button id="o" onclick="handleGuess('o')">o</button>
    <button id="p" onclick="handleGuess('p')">p</button>
    <button id="q" onclick="handleGuess('q')">q</button>
    <button id="r" onclick="handleGuess('r')">r</button>
    <button id="s" onclick="handleGuess('s')">s</button>
    <button id="t" onclick="handleGuess('t')">t</button>
    <button id="u" onclick="handleGuess('u')">u</button>
    <button id="v" onclick="handleGuess('v')">v</button>
    <button id="w" onclick="handleGuess('w')">w</button>
    <button id="x" onclick="handleGuess('x')">x</button>
    <button id="y" onclick="handleGuess('y')">y</button>
    <button id="z" onclick="handleGuess('z')">z</button>`

    document.getElementById('keyboard').innerHTML = buttonsHTML;
}

function handleGuess(chosenLetter) {
    guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
    document.getElementById(chosenLetter).setAttribute('disabled', true);
  
    if (answer.indexOf(chosenLetter) >= 0) {
        guessedWord();
        checkResult();
    }else if (answer.indexOf(chosenLetter) === -1) {
        chancesLeft = chancesLeft - 1;
        updateChance();
        checkResult();
    }
}

function guessedWord(){
    wordStatus = []
    alphabets = answer.split('')
    for(i = 0; i < alphabets.length; i++ ){
        if (guessed.includes(alphabets[i])){
            wordStatus.push(alphabets[i])
        }else{
            wordStatus.push(' _ ')
        }
    }
    wordStatus = wordStatus.join('')
    document.getElementById('playgame').innerHTML = 'Guess the below word';
    document.getElementById('wordStatus').innerHTML = wordStatus;
}


function checkResult() {
    if (wordStatus === answer) {
    document.getElementById('keyboard').innerHTML = 'You Won!!!';
    }
    if (chancesLeft == 0) {
        document.getElementById('wordStatus').innerHTML = 'The answer was: ' + answer;
        document.getElementById('keyboard').innerHTML = 'You Lost!!!';
    }
  
}

function updateChance(){
    document.getElementById('chances').innerHTML = "Chances Left: " +chancesLeft
}
  
function reset() {
    event.preventDefault();
    if (themeElement.value === 'camping'){
        camping();
        gameplay();
        
    } else if (themeElement.value === 'beach'){
        beach();
        gameplay();
    }
}

document.getElementById('chances').innerHTML = "Chances Left: " +chancesLeft;

function gameplay(){
    chancesLeft = 6;
    guessed = [];

    updateChance();
    guessedWord();
    generateButtons();
}