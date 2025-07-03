import { useState } from "react";
import { useGame } from "../hooks/useGame";
import { useAudio } from "../hooks/useAudio";

function DialogAction({ text, id, actions, intro = false }) {
	const { coreLoop, setCoreLoop, next } = useGame();
	const { playSound } = useAudio();
	const [diplaySubAction, setDisplaySubAction] = useState(false);
	const [displayLastAction, setDisplayLastAction] = useState(false);
	const [subActions, setSubActions] = useState([]);
	const [lastActions, setLastActions] = useState([]);

	function onClick(action) {
		setDisplayLastAction(false);
		setLastActions([]);
		setDisplaySubAction(false);
		setSubActions([]);

		if (action.onclick && !action.actions) {
			playSound("select_onclick", 1);
			action.onclick();
			return;
		}
		setDisplaySubAction(true);
		setSubActions(action.actions);
		playSound("select_onclick", 1);
	}
	function onSubClick(subAction) {
		setDisplayLastAction(false);
		setLastActions([]);

		if (subAction.onclick && !subAction.actions) {
			subAction.onclick();
			playSound("select_onclick_monster", 1);
			return;
		}
		setDisplayLastAction(true);
		setLastActions(subAction.actions);
		playSound("select_onclick", 1);
	}
	function onLastClick(lastAction) {
		if (lastAction.onclick && !lastAction.actions) {
			lastAction.onclick();
			playSound("select_onclick_monster", 1);
			return;
		}
	}

	return (
		<>
			<div key={id} className="dialog-action">
				<div className="dialog-text">{text}</div>
				<div className={intro ? "action-buttons intro" : "action-buttons"}>
					{actions.map((action) => {
						return (
							<button
								key={action.id}
								type="button"
								onClick={() => onClick(action)}
							>
								{action.text}
							</button>
						);
					})}
				</div>
			</div>
			{diplaySubAction && (
				<div className="dialog-sub-action">
					<div className="action-buttons">
						{subActions.map((subAction) => {
							return (
								<>
									<button
										key={subAction.id}
										type="button"
										onClick={() => onSubClick(subAction)}
									>
										{subAction.text}
									</button>
								</>
							);
						})}
					</div>
				</div>
			)}
			{displayLastAction && (
				<div className="dialog-sub-action">
					<div className="action-buttons">
						{lastActions.map((lastAction) => {
							return (
								<>
									<button
										key={lastAction.id}
										type="button"
										onClick={() => onLastClick(lastAction)}
									>
										{lastAction.text}
									</button>
								</>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
}

export default DialogAction;
