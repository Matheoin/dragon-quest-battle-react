import { useCallback, useEffect } from "react";
import {
	cleanupAudioManager,
	getAudioManager,
	initializeAudioManager,
} from "../utils/audioManagerInstance";

export const useAudio = () => {
	useEffect(() => {
		// Initialize audio manager and track this instance
		initializeAudioManager();

		// Cleanup function - will only destroy on actual unmount, not hot reload
		return () => {
			cleanupAudioManager();
		};
	}, []);

	const loadSound = useCallback(async (name, url) => {
		const manager = getAudioManager();
		console.log(manager);
		await manager.loadSound(name, url);
	}, []);

	const playSound = useCallback((name, volume) => {
		const manager = getAudioManager();
		setTimeout(() => {
			manager.playSound(name, volume);
		}, 500);
	}, []);

	const playMultipleSounds = useCallback((soundNames) => {
		const manager = getAudioManager();
		manager.playMultipleSounds(soundNames);
	}, []);

	const stopSound = useCallback((name) => {
		const manager = getAudioManager();
		manager.stopSound(name);
	}, []);

	const stopAllSounds = useCallback(() => {
		const manager = getAudioManager();
		manager.stopAllSounds();
	}, []);

	return { loadSound, playSound, playMultipleSounds, stopSound, stopAllSounds };
};
