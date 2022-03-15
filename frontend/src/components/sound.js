  // const [ theSound, setSound ] = useState( false );
  // const [ theVol, setVol ] = useState( 1 );

  // useEffect( () => { 
  //   // const AudioContext = window.AudioContext || window.webkitAudioContext;
  //   // const audioCtx = new AudioContext();
    // const theAud = audioRef.current;
  //   // const track = audioCtx.createMediaElementSource( audioElement );

    // volume
    // const gainNode = audioCtx.createGain();

    // const volumeControl = document.querySelector('[data-action="volume"]');
    // volumeControl.addEventListener('input', function() {
    //   gainNode.gain.value = this.value;
    // }, false );

    // track.connect( gainNode ).connect( audioCtx.destination );
  // }, [] );

  		<section class="master-controls">
        <input type="range" id="volume" class="control-volume" min="0" max="2" value="1" list="gain-vals" step="0.1" data-action="volume" />
        <datalist id="gain-vals">
          <option value="0" label="min">
          <option value="2" label="max">
        </datalist>
        <label for="volume">VOL</label>
      </section>