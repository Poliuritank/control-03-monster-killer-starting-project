const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';
let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValues() {
	const enteredValue = prompt(
		'Enter maximum life for you and the monster.',
		'100'
	);
	const parsedValue = parseInt(enteredValue);
	if (isNaN(parsedValue) || parsedValue <= 0) {
		throw { message: 'Invalid user input, not a number!' };
	}
	return parsedValue;
}

let chosenMaxLife;

try {
	chosenMaxLife = getMaxLifeValues();
} catch (error) {
	console.log(error);
	chosenMaxLife = 100;
	alert('You entered something wrong, default value of 100 was used.');
	// throw error;
// } finally {

}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
	let logEntry = {
		event: ev,
		value: val,
		finalMonsterHealth: monsterHealth,
		finalPlayerHealth: playerHealth,
	};

	switch (ev) {
		case LOG_EVENT_PLAYER_ATTACK:
			logEntry.targer = 'MONSTER';
			break;
		case LOG_EVENT_PLAYER_STRONG_ATTACK:
			logEntry.targer = 'MONSTER';
			break;
		case LOG_EVENT_MONSTER_ATTACK:
			logEntry.targer = 'PLAYER';
			break;
		case LOG_EVENT_PLAYER_HEAL:
			logEntry.targer = 'PLAYER';
			break;
		case LOG_EVENT_GAME_OVER:
			break;
		default:
			logEntry = {};
	}

	// if (ev === LOG_EVENT_PLAYER_ATTACK) {
	// 	logEntry.targer = 'MONSTER';
	// } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
	// 	logEntry.targer = 'MONSTER';
	// } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
	// 	logEntry.targer = 'PLAYER';
	// } else if (ev === LOG_EVENT_PLAYER_HEAL) {
	// 	logEntry.targer = 'PLAYER';
	// } else if (ev === LOG_EVENT_GAME_OVER) {
	// }
	battleLog.push(logEntry);
	// printLogHandler();
}

function reset() {
	currentMonsterHealth = chosenMaxLife;
	currentPlayerHealth = chosenMaxLife;
	resetGame(chosenMaxLife);
}

function endRound() {
	const initialPlayerHealth = currentPlayerHealth;
	const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
	currentPlayerHealth -= playerDamage;
	writeToLog(
		LOG_EVENT_MONSTER_ATTACK,
		playerDamage,
		currentMonsterHealth,
		currentPlayerHealth
	);

	if (currentPlayerHealth <= 0 && hasBonusLife) {
		hasBonusLife = false;
		removeBonusLife();
		currentPlayerHealth = initialPlayerHealth;
		setPlayerHealth(initialPlayerHealth);
		alert('You would be dead but bonus life saved you');
	}

	if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
		alert('You Won!');
		writeToLog(
			LOG_EVENT_GAME_OVER,
			'PLAYER WON',
			currentMonsterHealth,
			currentPlayerHealth
		);
	} else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
		alert('You Lose!');
		writeToLog(
			LOG_EVENT_GAME_OVER,
			'MONSTER WON',
			currentMonsterHealth,
			currentPlayerHealth
		);
	} else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
		alert('You have a draw!');
		writeToLog(
			LOG_EVENT_GAME_OVER,
			'DRAW',
			currentMonsterHealth,
			currentPlayerHealth
		);
	}

	if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
		reset();
	}
}

function attackMonster(mode) {
	let maxDamage;
	let logEvent;
	if (mode === MODE_ATTACK) {
		maxDamage = ATTACK_VALUE;
		logEvent = LOG_EVENT_PLAYER_ATTACK;
	} else if (mode === MODE_STRONG_ATTACK) {
		maxDamage = STRONG_ATTACK_VALUE;
		logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
	}
	const damage = dealMonsterDamage(maxDamage);
	currentMonsterHealth -= damage;
	writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

	endRound();
}

function attackHandler() {
	attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
	attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
	let healValue;
	if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
		alert("You can't heal to more than your max initial health.");
		healValue = chosenMaxLife - currentPlayerHealth;
	} else {
		healValue = HEAL_VALUE;
	}
	increasePlayerHealth(healValue);
	currentPlayerHealth += healValue;
	writeToLog(
		LOG_EVENT_PLAYER_HEAL,
		healValue,
		currentMonsterHealth,
		currentPlayerHealth
	);
	endRound();
}

function printLogHandler() {
	// for (let i = 0; i < 3; i++) {
	// 	console.log('_______________');
	// }
	// ________________________________
	// let j = 0;
	// do {
	// 	console.log('hello');

	// 	j++;
	// } while (j < 3);

	// ________________________________
	// for (let i = 10; i>0; i--){
	// 	console.log(i);
	// }
	// ________________________________
	// for (let i = 0; i < battleLog.length; i++) {
	// 	console.log(battleLog[i]);
	// }
	// ________________________________
	// let i = 0;
	// for (const logEntry of battleLog) {
	// 	console.log(i);
	// 	i++;
	// 	console.log(logEntry);
	// 	// console.log(battleLog[i]);
	// }
	// ________________________________
	let i = 0;
	for (const logEntry of battleLog) {
		if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {
			console.log(`#${i}`);
			for (const key in logEntry) {
				console.log(`${key} => ${logEntry[key]}`);
			}
			lastLoggedEntry = i;
			break;
		}
		i++;
	}
	// ________________________________
	// for (let i = 0; i <= 20; i++) {
	// 	if (i % 2 == 1 || i === 0 || i === 6 || i === 8) {
	// 		continue;
	// 	}
	// 	console.log(i);
	// }
	// ________________________________
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
