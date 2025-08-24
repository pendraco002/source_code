export enum SoundType {
  SUCCESS = 'success',
  ERROR = 'error',
  CARD_FLIP = 'card-flip',
  CARD_PLACE = 'card-place',
  BUTTON_CLICK = 'button-click',
  BIOMARKER_CHANGE = 'biomarker-change',
  LEVEL_COMPLETE = 'level-complete',
  GAME_OVER = 'game-over',
  AMBIENT_MUSIC = 'ambient-music',
  CRITICAL_EVENT = 'critical-event'
}

interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  enabled: boolean;
}

class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<SoundType, AudioBuffer> = new Map();
  private musicAudio: HTMLAudioElement | null = null;
  private settings: AudioSettings = {
    masterVolume: 0.7,
    sfxVolume: 0.8,
    musicVolume: 0.4,
    enabled: true
  };

  private constructor() {
    this.initializeAudioContext();
    this.loadSettings();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API não suportada:', error);
    }
  }

  private loadSettings(): void {
    const stored = localStorage.getItem('equilibrium-audio-settings');
    if (stored) {
      this.settings = { ...this.settings, ...JSON.parse(stored) };
    }
  }

  private saveSettings(): void {
    localStorage.setItem('equilibrium-audio-settings', JSON.stringify(this.settings));
  }

  // Gerar tons sintéticos para feedback básico
  private generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext || !this.settings.enabled) {
        resolve();
        return;
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;

      const volume = this.settings.masterVolume * this.settings.sfxVolume;
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.1, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);

      oscillator.onended = () => resolve();
    });
  }

  // Reproduzir sons de feedback específicos
  public async playSound(type: SoundType): Promise<void> {
    if (!this.settings.enabled) return;

    try {
      switch (type) {
        case SoundType.SUCCESS:
          // Tom ascendente de sucesso
          await this.generateTone(523.25, 0.15); // C5
          await this.generateTone(659.25, 0.15); // E5
          await this.generateTone(783.99, 0.2);  // G5
          break;

        case SoundType.ERROR:
          // Tom descendente de erro
          await this.generateTone(415.30, 0.1);  // G#4
          await this.generateTone(369.99, 0.1);  // F#4
          await this.generateTone(311.13, 0.2);  // D#4
          break;

        case SoundType.CARD_FLIP:
          // Som de carta virando
          await this.generateTone(880, 0.05, 'square');
          await this.generateTone(1108, 0.05, 'square');
          break;

        case SoundType.CARD_PLACE:
          // Som suave de carta sendo colocada
          await this.generateTone(523.25, 0.1, 'triangle');
          break;

        case SoundType.BUTTON_CLICK:
          // Click simples
          await this.generateTone(800, 0.05, 'square');
          break;

        case SoundType.BIOMARKER_CHANGE:
          // Tom neutro para mudança de biomarcador
          await this.generateTone(440, 0.1, 'sine');
          break;

        case SoundType.LEVEL_COMPLETE:
          // Fanfarra de conclusão
          await this.generateTone(523.25, 0.1); // C5
          await this.generateTone(659.25, 0.1); // E5
          await this.generateTone(783.99, 0.1); // G5
          await this.generateTone(1046.50, 0.3); // C6
          break;

        case SoundType.GAME_OVER:
          // Tom triste de game over
          await this.generateTone(329.63, 0.2); // E4
          await this.generateTone(293.66, 0.2); // D4
          await this.generateTone(261.63, 0.4); // C4
          break;

        case SoundType.CRITICAL_EVENT:
          // Som de alerta
          for (let i = 0; i < 3; i++) {
            await this.generateTone(1000, 0.1, 'sawtooth');
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          break;

        default:
          console.warn('Tipo de som não reconhecido:', type);
      }
    } catch (error) {
      console.warn('Erro ao reproduzir som:', error);
    }
  }

  // Música ambiente usando oscilador
  public startAmbientMusic(): void {
    if (!this.settings.enabled || this.musicAudio) return;

    try {
      // Criar música ambiente simples usando Web Audio API
      this.createAmbientLoop();
    } catch (error) {
      console.warn('Erro ao iniciar música ambiente:', error);
    }
  }

  private createAmbientLoop(): void {
    if (!this.audioContext) return;

    const playAmbientChord = async () => {
      const chords = [
        [261.63, 329.63, 392.00], // C Major
        [293.66, 369.99, 440.00], // D Minor
        [329.63, 415.30, 493.88], // E Minor
        [349.23, 440.00, 523.25], // F Major
      ];

      let currentChord = 0;

      const playChord = () => {
        if (!this.settings.enabled || !this.audioContext) return;

        const chord = chords[currentChord];
        const duration = 4; // 4 segundos por acorde

        chord.forEach(frequency => {
          const oscillator = this.audioContext!.createOscillator();
          const gainNode = this.audioContext!.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext!.destination);

          oscillator.frequency.setValueAtTime(frequency, this.audioContext!.currentTime);
          oscillator.type = 'sine';

          const volume = this.settings.masterVolume * this.settings.musicVolume * 0.05; // Muito sutil
          gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, this.audioContext!.currentTime + 0.5);
          gainNode.gain.linearRampToValueAtTime(volume, this.audioContext!.currentTime + duration - 0.5);
          gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + duration);

          oscillator.start(this.audioContext!.currentTime);
          oscillator.stop(this.audioContext!.currentTime + duration);
        });

        currentChord = (currentChord + 1) % chords.length;
        
        if (this.settings.enabled) {
          setTimeout(playChord, duration * 1000);
        }
      };

      playChord();
    };

    playAmbientChord();
  }

  public stopAmbientMusic(): void {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio = null;
    }
  }

  // Vibração para dispositivos móveis
  public vibrate(pattern: number | number[]): void {
    if ('vibrate' in navigator && this.settings.enabled) {
      navigator.vibrate(pattern);
    }
  }

  // Configurações de áudio
  public updateSettings(newSettings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  public setMasterVolume(volume: number): void {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  public setSfxVolume(volume: number): void {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  public setMusicVolume(volume: number): void {
    this.settings.musicVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  public toggleAudio(enabled: boolean): void {
    this.settings.enabled = enabled;
    if (!enabled) {
      this.stopAmbientMusic();
    }
    this.saveSettings();
  }

  // Método para inicializar o contexto de áudio (necessário após interação do usuário)
  public async initializeAfterUserInteraction(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Erro ao retomar contexto de áudio:', error);
      }
    }
  }
}

export default AudioManager;