import "./battle.css";
import { EVENTS_TYPES, useGame } from "../../hooks/useGame";
import DialogBox from "../../components/DialogBox";
import DialogAction from "../../components/DialogAction";
import Animation from "../../components/Animation";
import { useEffect, useState } from "react";
import StatsJoueur from "../../components/StatsJoueur";
import classNames from "classnames";

function Battle() {
	const { coreLoop, monstres, joueurs, inflictDamageMonster } = useGame();
	const [currentEvent, setCurrentEvent] = useState(null);

	useEffect(() => {
		if (coreLoop.length > 0) {
			setCurrentEvent(coreLoop[0]);
		}
	}, [coreLoop]);

	return (
		<div className="battle">
			{monstres && (
				<div className="top-container">
					{joueurs && (
						<div className={"etat-joueurs"}>
							{joueurs.map((joueur) => {
								return (
									<StatsJoueur
										key={joueur.id}
										name={joueur.name}
										pv={joueur.pv}
										mp={joueur.mp}
										id={joueur.id}
									/>
								);
							})}
						</div>
					)}
					<div className="battle-image">
						{monstres
							.filter((monstre) => monstre.pv > 0)
							.map((monstre) => {
								return (
									<div
										key={monstre.id}
										className={classNames("monsters", {
											turn:
												currentEvent?.type === EVENTS_TYPES.BOX &&
												currentEvent.prevEventType ===
													EVENTS_TYPES.MONSTER_TURN &&
												currentEvent.monster_id === monstre.id,
										})}
									>
										<img src={monstre.imgUrl} />
										<Animation monster_id={monstre.id} />
									</div>
								);
							})}
					</div>
				</div>
			)}
			{currentEvent && (
				<div className="bot-container">
					{currentEvent.type === EVENTS_TYPES.BOX && (
						<DialogBox
							text={currentEvent.text}
							id={currentEvent.id}
							action={currentEvent.action}
						/>
					)}
					{currentEvent.type === EVENTS_TYPES.ACTION_BOX && (
						<DialogAction
							text={currentEvent.text}
							id={currentEvent.id}
							actions={currentEvent.actions}
							intro={currentEvent.intro}
						/>
					)}
					{/* {currentEvent.type === EVENTS_TYPES.ATTACK_SELECTION && (
						<DialogBox
							text="Choisissez un monstre"
							id={1}
							action={() => null}
						/>
					)} */}
				</div>
			)}
		</div>
	);
}

export default Battle;
