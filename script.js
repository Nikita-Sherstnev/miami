/*
Последние изменения:
0.1 
Добавлен перк agility, влияет на атаку. 
Здоровье выделяется красным при уровне ниже 20, не опускается ниже нуля.
Добавлен номер текущего раунда.
Добавлена защита.
Теперь пустое имя не принимается.
Добавлен перк endurance.
0.2
Добавлена кнопка уменьшения ловкости соперника
Добавлены разные маски противников
Теперь сила выделяется красным при уровне 10 и ниже
*/

let player = {
	  health: 100,
	  power: 20,
    agility: 10,
    endurance: 5
}

let opponent = {
    health: 100,
    power: 20,
    agility: 10,
    endurance: 5
}

let imgOpponents = ["Tony.jpg","Tony2.png","Crocodile.png","Richard.jpg","Rasmus.png","Rick.png",
"Bat.jpg","Fish.png","Giraffe.png","Pig.png","Pantera.jpg"];

let round = 1;

let playerProtection = 0;
let opponentProtection = 0;

( function(){
	var btn = document.getElementById("agilityButton");
    btn.style.top = Math.floor((Math.random() * document.documentElement.clientWidth)) + "px";
    btn.style.left = Math.floor((Math.random() * document.documentElement.clientHeight)) + "px";
}() );

const decreaseAgility = () => {
  opponent.agility -= 5;
  document.getElementById('agilityButton').hidden = true;
  printToScreen();
}

const checkEmptyName = () => {
  let name = document.getElementById('nameRequire');
  if (document.getElementById('playerName').value == "") {
    if (Math.random() < 0.95)
    name.innerText = "Пожалуйста, введите имя!";
    else
    name.innerText = "JS is the new black!";
  }
  else
    startGame(); 
}

const startGame = () => {
	let playerName = document.getElementById("playerName").value;
	document.getElementById("playerNameEnter").innerText = playerName;
	document.getElementById("introduction").style.display = "none";
	document.getElementById('attack-button').disabled = false;
  document.getElementById('protect-button').disabled = false;
}

const attack = () => {
   let attackButton = document.getElementById('attack-button');
   let protectButton = document.getElementById('protect-button');
   let restartButton = document.getElementById('restart-button');
   let gameMessage = document.getElementById('game-message');

   let playerAttack = determineAttack(player.power, player.agility);

   if (opponentProtection == 1) {
    opponent.health -= Math.round(playerAttack / opponent.endurance);
    if(opponent.endurance > 1) opponent.endurance--;
    opponentProtection = 0;
   } else {
    opponent.health -= playerAttack;
   }
    
   if (opponent.health < 0) { opponent.health = 0; }

   player.power -= 5;
   playerProtection = 0;
   if (player.power == 0) { attackButton.hidden = true; }
   printToScreen();

   if (isGameOver(opponent.health)){
    endGame("Вы выиграли!");
    document.getElementById('next-opponent-button').hidden = false; 
   	return;
   }

   attackButton.disabled = true;
   protectButton.disabled = true;

   opponentAction();
}

const opponentAttack = () => {
   setTimeout(() => {
    let opponentAttack = determineAttack(opponent.power, opponent.agility);

    if (playerProtection == 1) {
    player.health -= Math.round(opponentAttack / player.endurance);
    if(player.endurance > 1) player.endurance--;
    playerProtection = 0;
    } else {
    player.health -= opponentAttack;
    }

    if (player.health < 0) player.health = 0;
    opponent.power -= 5;
    opponentProtection = 0;
    printToScreen();
    document.getElementById('game-message').innerText = "...";

    if (isGameOver(player.health)){
    endGame("Противник выиграл!");
    return;
    }

    document.getElementById('attack-button').disabled = false;
    document.getElementById('protect-button').disabled = false;
   }, 750)
}

const protect = () => {
   let attackButton = document.getElementById('attack-button');
   let protectButton = document.getElementById('protect-button');
   let restartButton = document.getElementById('restart-button');
   let gameMessage = document.getElementById('game-message');

   playerProtection = 1;
   player.power += 5;
   attackButton.hidden = false;
   printToScreen();

   attackButton.disabled = true;
   protectButton.disabled = true;

   opponentAction();
}

const opponentProtect = () => {
  setTimeout(() => {
    let opponentAttack = determineAttack(opponent.power, opponent.agility);
    
    opponentProtection = 1;
    opponent.power += 5;
    printToScreen();
    document.getElementById('game-message').innerText = "...";

    document.getElementById('attack-button').disabled = false;
    document.getElementById('protect-button').disabled = false;
   }, 750)
}

const opponentAction = () => {
  if (opponent.power == 0 || Math.random() > 0.5) {
   document.getElementById('game-message').innerText = "Противник защищается!";
   opponentProtect();
   } else {
   document.getElementById('game-message').innerText = "Противник наносит удар!";
   opponentAttack();
   }
}

const printToScreen = () => {
	let opponentHealth = document.getElementById('opponent-health');
	let playerHealth = document.getElementById('player-health');
  let opponentPower = document.getElementById('opponent-power');
  let playerPower = document.getElementById('player-power');

  if (opponent.health < 20) 
    opponentHealth.innerHTML = "<span style='color:red'>" + opponent.health + "</span>";
  else 
    opponentHealth.innerText = opponent.health;

  if (player.health < 20) 
    playerHealth.innerHTML = "<span style='color:red'>" + player.health + "</span>";
  else
    playerHealth.innerText = player.health;
  

  if (opponent.power <= 10) 
    opponentPower.innerHTML = "<span style='color:red'>" + opponent.power + "</span>";
  else 
    opponentPower.innerText = opponent.power;

  if (player.power <= 10) 
    playerPower.innerHTML = "<span style='color:red'>" + player.power + "</span>";
  else
    playerPower.innerText = player.power;

  document.getElementById('opponent-agility').innerText = opponent.agility;
  document.getElementById('player-agility').innerText = player.agility;
}

const isGameOver = (health) => {
	return health <= 0;
}

const endGame = (message) => {
    document.getElementById('game-message').innerText = message;
    document.getElementById('attack-button').hidden = true;
    document.getElementById('protect-button').hidden = true;
    document.getElementById('restart-button').hidden = false;
}

const restart = () => {
	let attackButton = document.getElementById('attack-button');
  let protectButton = document.getElementById('protect-button');
	resetStats();

	document.getElementById('game-message').innerText = "...";
	attackButton.disabled = false;
  protectButton.disabled = false;
  buttonsVisibility();

  round = 1;
  document.getElementById('round').innerText = "Раунд " + round;
  document.getElementById('imgOpponent').src = "img/" + imgOpponents[round-1];
  printToScreen();
}

const determineAttack = (power, agility) => {
	return Math.floor(Math.random() * (power + agility));
}

const nextOpponent = () => {
  document.getElementById('imgOpponent').src = "img/" + imgOpponents[round];

  resetStats();
  opponent.power += 5 * round;
  round += 1;
  document.getElementById('round').innerText = "Раунд " + round;

  buttonsVisibility();
  document.getElementById('game-message').innerText = "...";
  printToScreen();
}

const buttonsVisibility = () => {
  document.getElementById('attack-button').hidden = false;
  document.getElementById('protect-button').hidden = false;
  document.getElementById('restart-button').hidden = true;
  document.getElementById('next-opponent-button').hidden = true;
}

const resetStats = () => {
  player.health = 100;
  opponent.health = 100;
  player.power = 20;
  opponent.power = 20
  player.endurance = 5;
  opponent.endurance = 5;
}

printToScreen();
