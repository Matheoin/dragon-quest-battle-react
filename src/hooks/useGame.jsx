import { createContext, useContext, useEffect, useState } from "react";
import { useAudio } from "./useAudio";

export const EVENTS_TYPES = {
	BOX: "BOX",
	ACTION_BOX: "ACTION_BOX",
	PLAYER_TURN: "PLAYER_TURN",
	MONSTER_TURN: "MONSTER_TURN",
	END_TURN: "END_TURN",
	ATTACK_SELECTION: "ATTACK_SELECTION",
	ANIMATION_SOUND: "ANIMATION_SOUND",
};

const DEFAULT_MONSTRES = [
	{ name: "Bunicorn", pv: 10, type: 1, imgUrl: "monsters/Bunicorn.png" },
	{ name: "Slime", pv: 7, type: 2, imgUrl: "monsters/Slime.png" },
	{ name: "Deadnaut", pv: 12, type: 3, imgUrl: "monsters/Deadnaut.png" },
];

const GameContext = createContext(undefined);

function generateBox(text, action) {
	return { type: EVENTS_TYPES.BOX, id: crypto.randomUUID(), text, action };
}
function generateActionBox(text, actions, options = {}) {
	return {
		type: EVENTS_TYPES.ACTION_BOX,
		id: crypto.randomUUID(),
		text,
		actions,
		...options,
	};
}
function generateAnimationAndSound(
	{ soud_name, sound_duration, animation_name, animation_duration, time_out },
	action,
) {
	return {
		type: EVENTS_TYPES.ANIMATION_SOUND,
		soud_name,
		sound_duration,
		animation_name,
		animation_duration,
		time_out,
		action,
	};
}
function generateMonsters() {
	const nbMonsters = Math.floor(Math.random() * 5) + 1;
	const monsters = [];

	for (let i = 0; i < nbMonsters; i++) {
		const idMonster = Math.floor(Math.random() * 3) + 1;
		const selectedMonster = DEFAULT_MONSTRES.find(
			(monster) => monster.type === idMonster,
		);

		if (selectedMonster) {
			monsters.push({
				...selectedMonster,
				id: i + 1,
			});
		}
	}
	return monsters;
}

export const GameProvider = ({ children }) => {
	const { loadSound, playSound, stopAllSounds } = useAudio();
	const [gameReady, setGameReady] = useState(false);
	const [gameStart, setGameStart] = useState(false);
	const [coreLoop, setCoreLoop] = useState([]);
	const [monstres, setMonstres] = useState([]);
	const [joueurs, setJoueurs] = useState([
		{ name: "Héro", pv: 27, mp: 20, id: 1 },
		{ name: "Erik", pv: 24, mp: 14, id: 2 },
		{ name: "Véronica", pv: 20, mp: 24, id: 3 },
	]);

	console.log("coreLoop", coreLoop);

	function startGame() {
		setGameStart(true);
	}

	const resetGame = () => {
		setGameReady(false);
		setGameStart(false);
		setCoreLoop((prevLoop) => {
			prevLoop.splice(0, prevLoop.length);
			return prevLoop;
		});
		setMonstres([]);
	};

	const onFuite = () => {
		setCoreLoop((prevLoop) => {
			prevLoop.splice(1, 0, generateBox("Vous avez pris la fuite", resetGame));
			return prevLoop;
		});
		next();
	};

	function onFight() {
		next();
	}

	// function onAttaque(player_id) {
	// 	setCoreLoop((prevLoop) => {
	// 		prevLoop.splice(1, 0, { type: EVENTS_TYPES.ATTACK_SELECTION, player_id });
	// 		return prevLoop;
	// 	});
	// 	next();
	// }

	function inflictDamageMonster(player_id, monster_id, monster_name) {
		const player = joueurs.find((joueur) => joueur.id === player_id);
		setCoreLoop((prevLoop) => {
			prevLoop.splice(
				1,
				0,
				generateBox(`${player.name} attack ${monster_name}`, () => {
					next();
				}),
				// todo: ajouter animation et sond
				generateAnimationAndSound(
					{ soud_name: "attack_slash", sound_duration: 1, time_out: 1.5 },
					() => {
						const degats = 10;
						setMonstres((prevMonstres) => {
							const newMonstres = [...prevMonstres];
							for (let i = 0; i < newMonstres.length; i++) {
								if (newMonstres[i].id === monster_id) {
									newMonstres[i] = {
										...newMonstres[i],
										pv: newMonstres[i].pv - degats,
									};
									break;
								}
							}
							return newMonstres;
						});
						setCoreLoop((prevLoop) => {
							prevLoop.splice(
								1,
								0,
								generateBox(
									`${player.name} inflige ${degats} dégâts à ${monster_name}`,
									() => next(),
								),
							);
							return prevLoop;
						});
						next();
					},
				),
			);
			return prevLoop;
		});
		next();
	}
	function inflictDamagePlayer(
		player_id,
		player_name,
		monster_id,
		monster_name,
	) {
		setCoreLoop((prevLoop) => {
			prevLoop.splice(
				1,
				0,
				generateBox("audio + animation", () => {
					const degats = 1;
					setJoueurs((prevJoueurs) => {
						const newJoueurs = [...prevJoueurs];
						for (let i = 0; i < newJoueurs.length; i++) {
							if (newJoueurs[i].id === player_id) {
								newJoueurs[i] = {
									...newJoueurs[i],
									pv: newJoueurs[i].pv - degats,
								};
								break;
							}
						}
						console.log(newJoueurs);
						return newJoueurs;
					});
					setCoreLoop((prevLoop) => {
						prevLoop.splice(
							1,
							0,
							generateBox(
								`${monster_name} inflige ${degats} à ${player_name}`,
								() => next(),
							),
						);
						return prevLoop;
					});
					next();
				}),
			);
			return prevLoop;
		});
		next();
	}

	function onPlayerTurn(player_id) {
		const player = joueurs.find((joueur) => joueur.id === player_id);
		setCoreLoop((prevLoop) => {
			prevLoop.splice(
				1,
				0,
				generateActionBox(
					player.name,
					[
						{
							id: "idAttaque",
							text: "Attaque",
							onclick: () => {},
							actions: monstres
								.filter((monstre) => monstre.pv > 0)
								.map((monstre) => {
									return {
										id: monstre.id,
										text: monstre.name,
										onclick: () =>
											inflictDamageMonster(player_id, monstre.id, monstre.name),
									};
								}),
						},
						{ id: "idParade", text: "Parade", onclick: () => {} },
						{ id: "idSkills", text: "Skills", onclick: () => {} },
						{ id: "idObjet", text: "Objets", onclick: () => {} },
						{ id: "idFuite", text: "Fuite", onclick: onFuite },
					],
					{ player_id },
				),
			);
			return prevLoop;
		});
		next();
	}
	function onMonsterTurn(monster_id) {
		console.log("monster turn");
		const player_index = Math.floor(Math.random() * joueurs.length) + 1;
		const player = joueurs[player_index - 1];
		const monster = monstres.find((monstre) => monstre.id === monster_id);
		setCoreLoop((prevLoop) => {
			prevLoop.splice(
				1,
				0,
				generateBox(`${monster.name} attack ${player.name}`, () =>
					inflictDamagePlayer(player.id, player.name, monster_id, monster.name),
				),
			);
			return prevLoop;
		});
		next();
	}

	const generateInitialEvents = () => {
		const initialMonsters = generateMonsters();
		setMonstres(initialMonsters);
		const turns = generateTurns(initialMonsters);

		const events = [
			generateActionBox(
				"Des monstres apparaissent !",
				[
					{ id: "id", text: "Combattre", onclick: onFight },
					{ id: "id2", text: "Fuite", onclick: onFuite },
				],
				{ intro: true },
			),
			...turns,
		];

		setCoreLoop(events);
		setGameReady(true);
	};

	function generateTurns(initialMonsters) {
		console.log(monstres);
		const turns = [
			...joueurs.flatMap((joueur) =>
				Array(1).fill({
					type: EVENTS_TYPES.PLAYER_TURN,
					player_id: joueur.id,
				}),
			),
			...initialMonsters.flatMap((monstre) =>
				Array(1).fill({
					type: EVENTS_TYPES.MONSTER_TURN,
					monster_id: monstre.id,
				}),
			),
		];

		const playerTurns = turns.filter(
			(turn) => turn.type === EVENTS_TYPES.PLAYER_TURN,
		);
		const monsterTurns = turns.filter(
			(turn) => turn.type === EVENTS_TYPES.MONSTER_TURN,
		);

		for (let i = playerTurns.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[playerTurns[i], playerTurns[j]] = [playerTurns[j], playerTurns[i]];
		}
		for (let i = monsterTurns.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[monsterTurns[i], monsterTurns[j]] = [monsterTurns[j], monsterTurns[i]];
		}

		const interleavedTurns = [];
		let i = 0;
		let j = 0;
		while (i < playerTurns.length || j < monsterTurns.length) {
			if (i < playerTurns.length) {
				interleavedTurns.push(playerTurns[i]);
				i++;
			}
			if (j < monsterTurns.length) {
				interleavedTurns.push(monsterTurns[j]);
				j++;
			}
		}

		interleavedTurns.push({ type: EVENTS_TYPES.END_TURN });

		return interleavedTurns;
	}

	useEffect(() => {
		if (gameStart) {
			console.log("Game as starting");

			playSound("battle_theme", 1);

			if (coreLoop.length === 0) {
				generateInitialEvents();
			}
		} else {
			stopAllSounds();
		}
	}, [gameStart]);

	useEffect(() => {
		loadSound("battle_theme", "audio/battle_theme.mp3");
		loadSound("attack_slash", "audio/attack_slash.wav");
	}, []);

	useEffect(() => {
		const event = coreLoop?.[0];
		if (event?.type === EVENTS_TYPES.PLAYER_TURN) {
			onPlayerTurn(event.player_id);
		}
		if (event?.type === EVENTS_TYPES.MONSTER_TURN) {
			onMonsterTurn(event.monster_id);
		}
		if (event?.type === EVENTS_TYPES.END_TURN) {
			const events = generateTurns(monstres);
			setCoreLoop((prevLoop) => {
				prevLoop.splice(1, 0, ...events);
				return prevLoop;
			});
			next();
		}
		if (event?.type === EVENTS_TYPES.ANIMATION_SOUND) {
			playSound(event.soud_name, 0.5);
			setTimeout(() => {
				event.action();
				console.log("time_out");
			}, event.time_out * 1000);
		}
	}, [coreLoop[0]]);

	useEffect(() => {
		if (!gameStart && !gameReady) {
			return;
		}
		for (const monstre of monstres) {
			if (monstre.pv <= 0) {
				setCoreLoop((prevLoop) => {
					return prevLoop.filter((chaqueEvent) => {
						if (
							chaqueEvent.type === EVENTS_TYPES.MONSTER_TURN &&
							chaqueEvent.monster_id === monstre.id
						) {
							return false;
						}
						return true;
					});
				});
			}
		}
		if (monstres.every((monstre) => monstre.pv <= 0)) {
			setCoreLoop((prevLoop) => {
				prevLoop.splice(1, 0, generateBox("Victoire", resetGame));
				return prevLoop;
			});
			next();
		}
	}, [monstres]);

	const next = () => {
		if (!gameStart) {
			return;
		}

		setCoreLoop((prevLoop) => {
			const newLoop = prevLoop.slice(1);

			return newLoop;
		});
	};

	return (
		<GameContext.Provider
			value={{
				gameStart,
				setGameStart,
				coreLoop,
				setCoreLoop,
				next,
				monstres,
				setMonstres,
				joueurs,
				setJoueurs,
				inflictDamageMonster,
				startGame,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export const useGame = () => {
	const context = useContext(GameContext);

	return context;
};
