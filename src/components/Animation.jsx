import { SpriteAnimator } from "react-sprite-animator";
import { EVENTS_TYPES, useGame } from "../hooks/useGame";

const animations = {
	attack: {
		sprite: "attack_animation/weapon_animation.png",
		width: 130,
		height: 110,
		direction: "horizontal",
		fps: 10,
		startFrame: 25,
		frameCount: 30,
		wrapAfter: 5,
		stopLastFrame: true,
		scale: 0.5,
	},
	light: {
		sprite: "attack_animation/weapon_animation.png",
		width: 130,
		height: 110,
		direction: "horizontal",
		fps: 10,
		startFrame: 75,
		frameCount: 80,
		wrapAfter: 5,
		stopLastFrame: true,
		scale: 0.5,
	},
	fire_ball: {
		sprite: "attack_animation/weapon_animation.png",
		width: 130,
		height: 110,
		direction: "horizontal",
		fps: 10,
		startFrame: 80,
		frameCount: 85,
		wrapAfter: 5,
		stopLastFrame: true,
		scale: 0.5,
	},
};

function Animation({ monster_id }) {
	const { coreLoop, monstres } = useGame();
	const currentEvent = coreLoop[0];

	const selectedAnimation =
		animations[currentEvent?.animation_name || animations.attack];

	return (
		<div className="animation">
			{currentEvent?.type === EVENTS_TYPES.ANIMATION_SOUND &&
				currentEvent?.monster_id === monster_id && (
					<SpriteAnimator
						sprite={selectedAnimation.sprite}
						width={selectedAnimation.width}
						height={selectedAnimation.height}
						direction={selectedAnimation.direction}
						fps={selectedAnimation.fps}
						startFrame={selectedAnimation.startFrame}
						frameCount={selectedAnimation.frameCount}
						wrapAfter={selectedAnimation.wrapAfter}
						stopLastFrame={selectedAnimation.stopLastFrame}
						scale={selectedAnimation.scale}
					/>
				)}
		</div>
	);
}

export default Animation;
