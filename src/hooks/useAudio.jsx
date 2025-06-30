import { useCallback, useEffect, useMemo, useState } from "react";
import AudioManager from "../utils/AudioManager";

export const useAudio = () => {
	const [audioManager, setAudioManager] = useState(null);

	function destroy() {
		if (audioManager) {
			audioManager.destroy();
		}
	}

	useEffect(() => {
		return () => {
			destroy();
		};
	}, []);

	function init() {
		setAudioManager(new AudioManager());
	}

	const loadSound = useCallback(
		async (name, url) => {
			console.log(audioManager);
			await audioManager.loadSound(name, url);
		},
		[audioManager],
	);

	const playSound = useCallback(
		(name, volume) => {
			setTimeout(() => {
				audioManager.playSound(name, volume);
			}, 1000);
		},
		[audioManager],
	);

	const playMultipleSounds = useCallback(
		(soundNames) => {
			audioManager.playMultipleSounds(soundNames);
		},
		[audioManager],
	);

	return { loadSound, playSound, playMultipleSounds, init, destroy };
};
