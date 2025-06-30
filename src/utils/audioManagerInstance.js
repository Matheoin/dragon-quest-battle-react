import AudioManager from "./AudioManager";

let audioManager = null;
let instanceCount = 0;

// Track if we're in development mode for hot reload detection
const isDevelopment = process.env.NODE_ENV === "development";

export const getAudioManager = () => {
	if (!audioManager) {
		audioManager = new AudioManager();
	}
	return audioManager;
};

export const initializeAudioManager = () => {
	instanceCount++;
	return getAudioManager();
};

export const cleanupAudioManager = () => {
	instanceCount--;

	// Only destroy if this is the last instance and we're not in development
	// This prevents destruction during hot reloads
	if (instanceCount === 0 && !isDevelopment) {
		if (audioManager) {
			audioManager.destroy();
			audioManager = null;
		}
	}
};

// For development: provide a way to manually cleanup if needed
export const forceCleanupAudioManager = () => {
	if (audioManager) {
		audioManager.destroy();
		audioManager = null;
	}
	instanceCount = 0;
};
