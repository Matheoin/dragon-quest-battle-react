class AudioManager {
	audioContext;
	sounds = new Map();

	constructor() {
		this.audioContext = new (
			window.AudioContext || window.webkitAudioContext
		)();
	}

	destroy() {
		if (this.audioContext && this.audioContext.state !== "close") {
			this.audioContext.close();
		}
		this.sounds.clear();
	}

	async loadSound(name, url) {
		if (this.sounds.has(name)) {
			console.log(`Sound "${name}" already loaded, skipping...`);
			return;
		}

		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
		this.sounds.set(name, {
			buffer: audioBuffer,
			source: null,
		});
		console.log("Sound loaded", name);
	}

	playSound(name, volume = 1.0) {
		console.log("Playing sound", name);
		const sound = this.sounds.get(name);
		if (!sound) {
			console.warn(`Sound "${name}" not found`);
			return;
		}

		const source = this.audioContext.createBufferSource();
		const gainNode = this.audioContext.createGain();

		source.buffer = sound.buffer;
		gainNode.gain.value = volume;

		console.log("Source", source);

		source.connect(gainNode);
		gainNode.connect(this.audioContext.destination);

		source.start();

		this.sounds.set(name, {
			buffer: sound.buffer,
			source: source,
		});
	}

	playMultipleSounds(soundNames) {
		// biome-ignore lint/complexity/noForEach: <explanation>
		soundNames.forEach((name) => this.playSound(name));
	}

	stopSound(name) {
		const sound = this.sounds.get(name);
		if (!sound) {
			console.warn(`Sound "${name}" not found`);
			return;
		}

		const source = sound.source;
		if (source) {
			source.stop();
		}

		this.sounds.set(name, {
			buffer: sound.buffer,
			source: null,
		});
	}

	stopAllSounds() {
		for (const song of this.sounds.keys()) {
			this.stopSound(song);
		}
	}
}

export default AudioManager;
