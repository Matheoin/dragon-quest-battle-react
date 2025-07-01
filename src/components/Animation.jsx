import { SpriteAnimator } from "react-sprite-animator";
import { EVENTS_TYPES, useGame } from "../hooks/useGame";

const animations = {
	attack: {
		sprite: "attack_animation/weapon_animation.png",
		width: 130,
		height: 110,
		direction: "horizontal",
		fps: 20,
		startFrame: 25,
		frameCount: 30,
		wrapAfter: 5,
		stopLastFrame: true,
		scale: 0.5,
	},
	thunder: {},
	fire_ball: {},
};

function Animation({ monster_id }) {
	const { coreLoop, monstres } = useGame();
	const currentEvent = coreLoop[0];

	return (
		<div className="animation">
			{currentEvent.type === EVENTS_TYPES.ANIMATION_SOUND &&
				currentEvent.monster_id === monster_id && (
					<SpriteAnimator
						sprite="attack_animation/weapon_animation.png"
						width={130}
						height={110}
						direction={"horizontal"}
						fps={20}
						startFrame={25}
						frameCount={30}
						wrapAfter={5}
						stopLastFrame={true}
						scale={0.5}
					/>
				)}
		</div>
	);
}

export default Animation;
