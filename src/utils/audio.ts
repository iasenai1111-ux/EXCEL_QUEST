/**
 * Web Audio API 8-Bit Retro Sound Synthesizer & BGM Engine
 * Complete audio system for EXCEL QUEST with dedicated volume controls
 * and authentic 8-bit chiptune loop of Kansas - "Carry on Wayward Son".
 */

type AudioListener = () => void;

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private bgmVolume: number = 0.7;
  private sfxVolume: number = 0.85;
  private bgmEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private bgmMode: 'bit' | 'original' = 'bit';
  private originalAudio: HTMLAudioElement | null = null;
  private customAudioName: string = '';
  private originalAudioError: string = '';
  private originalObjectUrl: string | null = null;

  // BGM playback state
  private bgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private bgmNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private listeners: Set<AudioListener> = new Set();
  private autoplayHandled: boolean = false;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const savedMute = localStorage.getItem('excel_quest_muted');
      if (savedMute !== null) this.isMuted = savedMute === 'true';

      const savedMasterVol = localStorage.getItem('excel_quest_master_volume');
      if (savedMasterVol !== null) this.masterVolume = Math.max(0, Math.min(1, parseFloat(savedMasterVol) || 0.8));

      const savedBgmVol = localStorage.getItem('excel_quest_bgm_volume');
      if (savedBgmVol !== null) this.bgmVolume = Math.max(0, Math.min(1, parseFloat(savedBgmVol) || 0.7));

      const savedSfxVol = localStorage.getItem('excel_quest_sfx_volume');
      if (savedSfxVol !== null) this.sfxVolume = Math.max(0, Math.min(1, parseFloat(savedSfxVol) || 0.85));

      const savedBgmEnabled = localStorage.getItem('excel_quest_bgm_enabled');
      if (savedBgmEnabled !== null) this.bgmEnabled = savedBgmEnabled === 'true';

      const savedSfxEnabled = localStorage.getItem('excel_quest_sfx_enabled');
      if (savedSfxEnabled !== null) this.sfxEnabled = savedSfxEnabled === 'true';

      const savedMode = localStorage.getItem('excel_quest_bgm_mode');
      if (savedMode === 'original' || savedMode === 'bit') {
        this.bgmMode = savedMode;
      }
    }

    // Attach user gesture listener for browser autoplay policy
    this.setupAutoplayUnlock();
  }

  private setupAutoplayUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.initCtx();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.autoplayHandled = true;
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // BGM Sub-bus Gain
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmEnabled ? this.bgmVolume : 0, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);

        // SFX Sub-bus Gain
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // --- REACTIVE OBSERVER SUBSCRIPTIONS ---
  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  // --- VOLUME CONTROLS ---
  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setMasterVolume(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    this.masterVolume = clamped;
    localStorage.setItem('excel_quest_master_volume', String(clamped));
    this.applyGains();
    this.notify();
  }

  public getBGMVolume(): number {
    return this.bgmVolume;
  }

  public setBGMVolume(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    this.bgmVolume = clamped;
    localStorage.setItem('excel_quest_bgm_volume', String(clamped));
    this.applyGains();
    this.notify();
  }

  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  public setSFXVolume(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    this.sfxVolume = clamped;
    localStorage.setItem('excel_quest_sfx_volume', String(clamped));
    this.applyGains();
    this.notify();
  }

  public isBGMEnabled(): boolean {
    return this.bgmEnabled;
  }

  public setBGMEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    localStorage.setItem('excel_quest_bgm_enabled', String(enabled));
    this.applyGains();
    if (!enabled && this.bgmPlaying) {
      this.stopBGM();
    }
    this.notify();
  }

  public isSFXEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setSFXEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    localStorage.setItem('excel_quest_sfx_enabled', String(enabled));
    this.applyGains();
    this.notify();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('excel_quest_muted', String(this.isMuted));
    this.applyGains();
    if (this.isMuted && this.bgmPlaying) {
      this.stopBGM();
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  private applyGains() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      if (this.masterGain) {
        const targetMaster = this.isMuted ? 0 : this.masterVolume;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setTargetAtTime(targetMaster, now, 0.05);
      }
      if (this.bgmGain) {
        const targetBgm = this.bgmEnabled ? this.bgmVolume : 0;
        this.bgmGain.gain.cancelScheduledValues(now);
        this.bgmGain.gain.setTargetAtTime(targetBgm, now, 0.05);
      }
      if (this.sfxGain) {
        const targetSfx = this.sfxEnabled ? this.sfxVolume : 0;
        this.sfxGain.gain.cancelScheduledValues(now);
        this.sfxGain.gain.setTargetAtTime(targetSfx, now, 0.05);
      }
      if (this.originalAudio) {
        const effectiveVol = (this.isMuted || !this.bgmEnabled) ? 0 : (this.masterVolume * this.bgmVolume);
        this.originalAudio.volume = Math.max(0, Math.min(1, effectiveVol));
      }
    } catch {}
  }

  // --- SOUND EFFECTS (SFX) ROUTED VIA sfxGain ---

  public playCoin() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {}
  }

  public playJump() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.17);
    } catch {}
  }

  public playBlockHit() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {}
  }

  public playStomp() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.11);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  public playDamage() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.setValueAtTime(180, this.ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {}
  }

  public playFlagpole() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const start = this.ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 0.18);
      });
    } catch {}
  }

  public playTerminalOpen() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const notes = [440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.14, this.ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.16);
      });
    } catch {}
  }

  public playClick() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  public playSuccess() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.28);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(this.ctx.currentTime + idx * 0.09);
        osc.stop(this.ctx.currentTime + idx * 0.09 + 0.3);
      });
    } catch {}
  }

  public playError() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.setValueAtTime(160, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {}
  }

  public playGameOver() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      // Pause or stop BGM when game over triggers
      this.stopBGM();
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const notes = [
        { f: 493.88, d: 0.18 }, // B4
        { f: 466.16, d: 0.18 }, // A#4
        { f: 440.00, d: 0.18 }, // A4
        { f: 415.30, d: 0.45 }, // G#4
        { f: 349.23, d: 0.22 }, // F4
        { f: 293.66, d: 0.55 }, // D4
      ];
      let t = this.ctx.currentTime;
      notes.forEach((item) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(item.f, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + item.d - 0.03);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + item.d);
        t += item.d;
      });
    } catch {}
  }

  public playVictory() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const melody = [
        { f: 523.25, d: 0.15 },
        { f: 523.25, d: 0.15 },
        { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.4 },
        { f: 587.33, d: 0.2 },
        { f: 659.25, d: 0.2 },
        { f: 783.99, d: 0.6 }
      ];
      let t = this.ctx.currentTime;
      melody.forEach(item => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + item.d - 0.02);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + item.d);
        t += item.d;
      });
    } catch {}
  }

  public playPowerUp() {
    if (this.isMuted || !this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.sfxGain) return;
      const notes = [330, 392, 659, 523, 587, 784];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const start = this.ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 0.13);
      });
    } catch {}
  }

  // --- BGM ENGINE: 8-BIT CHIPTUNE vs ORIGINAL STUDIO ROCK ---

  public isBGMPlaying(): boolean {
    return this.bgmPlaying;
  }

  public getBgmMode(): 'bit' | 'original' {
    return this.bgmMode;
  }

  public setBgmMode(mode: 'bit' | 'original') {
    if (this.bgmMode === mode) return;
    this.bgmMode = mode;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('excel_quest_bgm_mode', mode);
      } catch {}
    }
    if (this.bgmPlaying) {
      this.stopBGM();
      this.startBGM();
    } else {
      this.notify();
    }
  }

  public getCustomAudioName(): string {
    return this.customAudioName;
  }

  public getOriginalAudioError(): string {
    return this.originalAudioError;
  }

  private setOriginalAudioSource(url: string, label: string, objectUrl: boolean) {
    if (!this.originalAudio) {
      this.originalAudio = new Audio();
      this.originalAudio.loop = true;
      this.originalAudio.preload = 'none';
    }
    this.originalAudio.pause();
    if (this.originalObjectUrl) URL.revokeObjectURL(this.originalObjectUrl);
    this.originalObjectUrl = objectUrl ? url : null;
    this.originalAudioError = '';
    this.customAudioName = label;
    this.originalAudio.onerror = () => {
      this.originalAudioError = 'Não foi possível carregar o áudio. Verifique se o link é direto, público e permite reprodução no navegador.';
      this.notify();
    };
    this.originalAudio.onplaying = () => {
      this.originalAudioError = '';
      this.notify();
    };
    this.originalAudio.src = url;
    this.applyGains();
    this.setBgmMode('original');
    // A seleção do áudio é uma ação do usuário: tentar iniciar imediatamente.
    this.bgmPlaying = true;
    void this.originalAudio.play().then(() => {
      this.notify();
    }).catch(() => {
      this.originalAudioError = 'Reprodução bloqueada ou formato não compatível. Use um link direto HTTPS para MP3/OGG ou selecione um arquivo local.';
      this.notify();
    });
    this.notify();
  }

  public loadCustomOriginalAudio(file: File) {
    if (!file.type.startsWith('audio/') && !/\\.(mp3|ogg|wav|m4a|aac)$/i.test(file.name)) {
      throw new Error('Selecione um arquivo de áudio válido.');
    }
    const url = URL.createObjectURL(file);
    this.setOriginalAudioSource(url, file.name, true);
  }

  public setOriginalAudioUrl(rawUrl: string, name?: string) {
    let parsed: URL;
    try { parsed = new URL(rawUrl.trim()); }
    catch { throw new Error('Digite uma URL completa, começando com https://'); }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error('Somente URLs HTTP ou HTTPS são aceitas.');
    }
    if (/^(www\\.)?(youtube\\.com|youtu\\.be|open\\.spotify\\.com|music\\.apple\\.com|soundcloud\\.com)$/i.test(parsed.hostname)) {
      throw new Error('Esse endereço é uma página de música, não um arquivo de áudio. Utilize uma URL direta de MP3/OGG.');
    }
    this.setOriginalAudioSource(parsed.href, name || 'Áudio por link', false);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.bgmNodes.forEach(n => {
      try {
        n.gain.gain.setValueAtTime(0.0001, this.ctx?.currentTime || 0);
        n.osc.stop();
      } catch {}
    });
    this.bgmNodes = [];

    if (this.originalAudio) {
      try {
        this.originalAudio.pause();
      } catch {}
    }
    this.notify();
  }

  public pauseBGM() {
    this.stopBGM();
  }

  public resumeBGM() {
    this.startBGM();
  }

  public toggleBGM(): boolean {
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  public startBGM() {
    if (this.isMuted || !this.bgmEnabled) return;
    this.stopBGM();
    this.initCtx();

    this.bgmPlaying = true;
    this.notify();

    if (this.bgmMode === 'original') {
      this.playOriginalRockTrack();
    } else {
      this.playCarryOnWaywardSonLoop();
    }
  }

  /**
   * Specifically called when starting or continuing gameplay.
   * Ensures AudioContext is un-suspended and loops Kansas - "Carry on Wayward Son".
   */
  public startGameplayBGM() {
    if (this.isMuted || !this.bgmEnabled) return;
    this.initCtx();
    if (!this.ctx) {
      // If AudioContext cannot be initialized yet, listen for first touch
      const handler = () => {
        this.startBGM();
        window.removeEventListener('click', handler);
        window.removeEventListener('keydown', handler);
      };
      window.addEventListener('click', handler, { once: true });
      window.addEventListener('keydown', handler, { once: true });
      return;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.startBGM();
      }).catch(() => {});
    } else {
      this.startBGM();
    }
  }

  private playCarryOnWaywardSonLoop() {
    if (!this.bgmPlaying || this.isMuted || !this.bgmEnabled || !this.ctx || !this.bgmGain) {
      this.bgmPlaying = false;
      this.notify();
      return;
    }

    const ctx = this.ctx;
    const now = ctx.currentTime + 0.05;
    this.bgmNodes = [];

    // Frequencies (Hz)
    const D2 = 73.42, F2 = 87.31, G2 = 98.00, A2 = 110.00, C3 = 130.81;
    const D3 = 146.83, F3 = 174.61, G3 = 196.00, A3 = 220.00, C4 = 261.63, Cs4 = 277.18;
    const D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00;
    const C5 = 523.25, D5 = 587.33;

    // SECTION 1: VOCAL HOOK ("Carry on my wayward son...")
    // [leadFreq, duration, bassFreq]
    const melody: [number, number, number][] = [
      // "Car-ry on my way-ward son"
      [A4, 0.28, D3],
      [C5, 0.28, D3],
      [D5, 0.52, D2],
      [C5, 0.28, C3],
      [A4, 0.52, A2],

      // "There'll be peace when you are done"
      [A4, 0.28, D3],
      [C5, 0.28, D3],
      [D5, 0.52, D2],
      [C5, 0.28, C3],
      [A4, 0.26, A2],
      [G4, 0.56, G2],

      // "Lay your wea-ry head to rest"
      [A4, 0.28, D3],
      [C5, 0.28, D3],
      [D5, 0.52, D2],
      [C5, 0.28, C3],
      [A4, 0.26, A2],
      [G4, 0.26, G2],
      [F4, 0.26, F2],
      [D4, 0.56, D2],

      // "Don't you cry no more"
      [F4, 0.34, F2],
      [G4, 0.34, G2],
      [A4, 0.48, A2],
      [G4, 0.34, G2],
      [D4, 0.78, D2],

      // SECTION 2: THE ICONIC HARD-ROCK GUITAR RIFF
      // Pass 1
      [D4, 0.17, D3], [D4, 0.17, D3], [F4, 0.24, F2], [D4, 0.17, D3],
      [G4, 0.26, G2], [D4, 0.17, D3], [F4, 0.24, F2], [D4, 0.17, D3],
      [C4, 0.24, C3], [A3, 0.38, A2],

      // Pass 2
      [D4, 0.17, D3], [D4, 0.17, D3], [F4, 0.24, F2], [D4, 0.17, D3],
      [G4, 0.26, G2], [D4, 0.17, D3], [F4, 0.24, F2], [D4, 0.17, D3],
      [C4, 0.22, C3], [Cs4, 0.22, A2], [D4, 0.52, D2],

      // Pass 3 (Riff Variation)
      [D4, 0.17, D3], [D4, 0.17, D3], [F4, 0.24, F2], [D4, 0.17, D3],
      [G4, 0.26, G2], [D4, 0.17, D3], [F4, 0.24, F2], [D4, 0.17, D3],
      [C4, 0.24, C3], [A3, 0.38, A2],

      // Pass 4 (Climax Turnaround)
      [D4, 0.17, D3], [D4, 0.17, D3], [F4, 0.24, F2], [D4, 0.17, D3],
      [G4, 0.26, G2], [A4, 0.26, A2], [C5, 0.32, C3], [D5, 0.68, D2],
    ];

    let t = now;
    melody.forEach(([freq, dur, bassFreq], idx) => {
      if (!ctx || !this.bgmGain) return;

      // 1. Lead Chiptune Melody (Square Wave with 8-bit vibrato envelope)
      const leadOsc = ctx.createOscillator();
      const leadGain = ctx.createGain();
      leadOsc.type = 'square';
      leadOsc.frequency.setValueAtTime(freq, t);

      leadGain.gain.setValueAtTime(0.08, t);
      leadGain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.02);

      leadOsc.connect(leadGain);
      leadGain.connect(this.bgmGain);
      leadOsc.start(t);
      leadOsc.stop(t + dur);

      // 2. Heavy Driving Bassline (Triangle / Sawtooth)
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, t);

      bassGain.gain.setValueAtTime(0.14, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.02);

      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGain);
      bassOsc.start(t);
      bassOsc.stop(t + dur);

      // 3. 8-Bit Percussion: Hi-hat / Snare burst on backbeats
      if (idx % 2 === 1) {
        try {
          const noiseOsc = ctx.createOscillator();
          const noiseGain = ctx.createGain();
          noiseOsc.type = 'sawtooth';
          noiseOsc.frequency.setValueAtTime(80, t);
          noiseOsc.frequency.exponentialRampToValueAtTime(30, t + 0.05);

          noiseGain.gain.setValueAtTime(0.04, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

          noiseOsc.connect(noiseGain);
          noiseGain.connect(this.bgmGain);
          noiseOsc.start(t);
          noiseOsc.stop(t + 0.06);
          this.bgmNodes.push({ osc: noiseOsc, gain: noiseGain });
        } catch {}
      }

      this.bgmNodes.push({ osc: leadOsc, gain: leadGain }, { osc: bassOsc, gain: bassGain });
      t += dur;
    });

    const totalDuration = t - now;
    // Seamless loop scheduler
    this.bgmTimer = window.setTimeout(() => {
      if (this.bgmPlaying) {
        this.playCarryOnWaywardSonLoop();
      }
    }, Math.max(100, Math.floor(totalDuration * 1000) - 35));
  }

  private makeDistortionCurve(amount: number = 25): Float32Array {
    const k = amount;
    const n = 44100;
    const curve = new Float32Array(n);
    const deg = Math.PI / 180;
    for (let i = 0; i < n; ++i) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  private playOriginalRockTrack() {
    if (!this.bgmPlaying || this.isMuted || !this.bgmEnabled) return;

    if (this.originalAudio && this.originalAudio.src) {
      this.applyGains();
      const playPromise = this.originalAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.playStudioRockSynthesizerLoop();
        });
      }
      return;
    }

    this.playStudioRockSynthesizerLoop();
  }

  /**
   * High-definition Studio Rock Synthesizer version of Kansas - "Carry on Wayward Son".
   * Features overdriven electric guitar (WaveShaper overdrive + cabinet filter),
   * warm Hammond organ harmonies, solid bass guitar, and acoustic rock drums.
   * Completely distinct from the 8-bit chiptune sound!
   */
  private playStudioRockSynthesizerLoop() {
    if (!this.bgmPlaying || this.isMuted || !this.bgmEnabled || !this.ctx || !this.bgmGain) {
      this.bgmPlaying = false;
      this.notify();
      return;
    }

    const ctx = this.ctx;
    const now = ctx.currentTime + 0.05;
    this.bgmNodes = [];

    // Frequencies (Hz)
    const D2 = 73.42, F2 = 87.31, G2 = 98.00, A2 = 110.00, C3 = 130.81;
    const D3 = 146.83, F3 = 174.61, G3 = 196.00, A3 = 220.00, C4 = 261.63, Cs4 = 277.18;
    const D4 = 293.66, F4 = 349.23, G4 = 392.00, A4 = 440.00;
    const C5 = 523.25, D5 = 587.33;

    // Kansas - "Carry on Wayward Son" notes
    const melody: [number, number, number][] = [
      // Vocal Chorus Section
      [A4, 0.28, D2],
      [C5, 0.28, D2],
      [D5, 0.52, D2],
      [C5, 0.28, C3],
      [A4, 0.52, A2],

      [A4, 0.28, D2],
      [C5, 0.28, D2],
      [D5, 0.52, D2],
      [C5, 0.28, C3],
      [A4, 0.26, A2],
      [G4, 0.56, G2],

      [A4, 0.28, D2],
      [C5, 0.28, D2],
      [D5, 0.52, D2],
      [C5, 0.28, C3],
      [A4, 0.26, A2],
      [G4, 0.26, G2],
      [F4, 0.26, F2],
      [D4, 0.56, D2],

      [F4, 0.34, F2],
      [G4, 0.34, G2],
      [A4, 0.48, A2],
      [G4, 0.34, G2],
      [D4, 0.78, D2],

      // Legendary Hard-Rock Guitar Riff
      [D4, 0.17, D2], [D4, 0.17, D2], [F4, 0.24, F2], [D4, 0.17, D2],
      [G4, 0.26, G2], [D4, 0.17, D2], [F4, 0.24, F2], [D4, 0.17, D2],
      [C4, 0.24, C3], [A3, 0.38, A2],

      [D4, 0.17, D2], [D4, 0.17, D2], [F4, 0.24, F2], [D4, 0.17, D2],
      [G4, 0.26, G2], [D4, 0.17, D2], [F4, 0.24, F2], [D4, 0.17, D2],
      [C4, 0.22, C3], [Cs4, 0.22, A2], [D4, 0.52, D2],

      [D4, 0.17, D2], [D4, 0.17, D2], [F4, 0.24, F2], [D4, 0.17, D2],
      [G4, 0.26, G2], [D4, 0.17, D2], [F4, 0.24, F2], [D4, 0.17, D2],
      [C4, 0.24, C3], [A3, 0.38, A2],

      [D4, 0.17, D2], [D4, 0.17, D2], [F4, 0.24, F2], [D4, 0.17, D2],
      [G4, 0.26, G2], [A4, 0.26, A2], [C5, 0.32, C3], [D5, 0.68, D2],
    ];

    const distortionCurve = this.makeDistortionCurve(28);

    let t = now;
    melody.forEach(([freq, dur, bassFreq], idx) => {
      if (!ctx || !this.bgmGain) return;

      // 1. Electric Guitar with Overdrive & Speaker Cabinet Lowpass Filter
      const guitarOsc = ctx.createOscillator();
      const waveShaper = ctx.createWaveShaper();
      const cabFilter = ctx.createBiquadFilter();
      const guitarGain = ctx.createGain();

      guitarOsc.type = 'sawtooth';
      guitarOsc.frequency.setValueAtTime(freq, t);

      // Overdrive curve
      waveShaper.curve = distortionCurve as unknown as Float32Array<ArrayBuffer>;
      waveShaper.oversample = '4x';

      // Marshall style 4x12 cab lowpass
      cabFilter.type = 'lowpass';
      cabFilter.frequency.setValueAtTime(2400, t);
      cabFilter.Q.setValueAtTime(1.8, t);

      guitarGain.gain.setValueAtTime(0.065, t);
      guitarGain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.015);

      guitarOsc.connect(waveShaper);
      waveShaper.connect(cabFilter);
      cabFilter.connect(guitarGain);
      guitarGain.connect(this.bgmGain);

      guitarOsc.start(t);
      guitarOsc.stop(t + dur);

      // 2. Hammond Organ Pad Warmth (sine harmonics: fundamental + octave)
      const organOsc1 = ctx.createOscillator();
      const organOsc2 = ctx.createOscillator();
      const organGain = ctx.createGain();

      organOsc1.type = 'sine';
      organOsc1.frequency.setValueAtTime(freq, t);
      organOsc2.type = 'sine';
      organOsc2.frequency.setValueAtTime(freq * 0.5, t); // Sub harmonic

      organGain.gain.setValueAtTime(0.035, t);
      organGain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.02);

      organOsc1.connect(organGain);
      organOsc2.connect(organGain);
      organGain.connect(this.bgmGain);

      organOsc1.start(t);
      organOsc1.stop(t + dur);
      organOsc2.start(t);
      organOsc2.stop(t + dur);

      // 3. Fender Precision Bass (Deep warm low-end)
      const bassOsc = ctx.createOscillator();
      const bassFilter = ctx.createBiquadFilter();
      const bassGain = ctx.createGain();

      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassFreq, t);

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(220, t);

      bassGain.gain.setValueAtTime(0.12, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.02);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.bgmGain);

      bassOsc.start(t);
      bassOsc.stop(t + dur);

      // 4. Acoustic Rock Drums
      // Kick drum on beat 1
      if (idx % 2 === 0) {
        try {
          const kickOsc = ctx.createOscillator();
          const kickGain = ctx.createGain();
          kickOsc.type = 'sine';
          kickOsc.frequency.setValueAtTime(130, t);
          kickOsc.frequency.exponentialRampToValueAtTime(45, t + 0.08);

          kickGain.gain.setValueAtTime(0.16, t);
          kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

          kickOsc.connect(kickGain);
          kickGain.connect(this.bgmGain);
          kickOsc.start(t);
          kickOsc.stop(t + 0.12);
          this.bgmNodes.push({ osc: kickOsc, gain: kickGain });
        } catch {}
      }

      // Snare drum on beat 2
      if (idx % 2 === 1) {
        try {
          const snareOsc = ctx.createOscillator();
          const snareGain = ctx.createGain();
          snareOsc.type = 'triangle';
          snareOsc.frequency.setValueAtTime(180, t);
          snareOsc.frequency.exponentialRampToValueAtTime(80, t + 0.07);

          snareGain.gain.setValueAtTime(0.1, t);
          snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

          snareOsc.connect(snareGain);
          snareGain.connect(this.bgmGain);
          snareOsc.start(t);
          snareOsc.stop(t + 0.1);
          this.bgmNodes.push({ osc: snareOsc, gain: snareGain });
        } catch {}
      }

      this.bgmNodes.push(
        { osc: guitarOsc, gain: guitarGain },
        { osc: organOsc1, gain: organGain },
        { osc: organOsc2, gain: organGain },
        { osc: bassOsc, gain: bassGain }
      );

      t += dur;
    });

    const totalDuration = t - now;
    this.bgmTimer = window.setTimeout(() => {
      if (this.bgmPlaying && this.bgmMode === 'original') {
        this.playOriginalRockTrack();
      }
    }, Math.max(100, Math.floor(totalDuration * 1000) - 35));
  }
}

export const soundManager = new SoundManager();
