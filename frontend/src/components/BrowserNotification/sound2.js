	audioCtx = new AudioContext();
	track = audioCtx.createMediaElementSource(audioElement);

	// volume
	const gainNode = audioCtx.createGain();

	const volumeControl = document.querySelector('[data-action="volume"]');
	volumeControl.addEventListener('input', function() {
		gainNode.gain.value = this.value;
	}, false);