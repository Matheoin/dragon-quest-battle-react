import { useState } from "react";
import { useGame } from "../hooks/useGame";

function DialogAction({ text, id, actions, intro = false }) {
	const { coreLoop, setCoreLoop, next } = useGame();
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
			action.onclick();
			return;
		}
		setDisplaySubAction(true);
		setSubActions(action.actions);
	}
	function onSubClick(subAction) {
		setDisplayLastAction(false);
		setLastActions([]);

		if (subAction.onclick && !subAction.actions) {
			subAction.onclick();
			return;
		}
		setDisplayLastAction(true);
		setLastActions(subAction.actions);
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
										onClick={lastAction.onclick}
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
