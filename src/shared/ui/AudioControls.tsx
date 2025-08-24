import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Headphones, Vibrate } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

interface AudioControlsProps {
  className?: string;
  compact?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({ className = '', compact = false }) => {
  const { 
    volumes, 
    isAudioEnabled, 
    setMasterVolume, 
    setSfxVolume, 
    setMusicVolume, 
    toggleAudio,
    startAmbientMusic,
    stopAmbientMusic
  } = useAudio();
  
  const [showControls, setShowControls] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleToggleAudio = () => {
    const newState = !isAudioEnabled;
    toggleAudio(newState);
    if (!newState && isMusicPlaying) {
      stopAmbientMusic();
      setIsMusicPlaying(false);
    }
  };

  const handleToggleMusic = () => {
    if (!isAudioEnabled) return;
    
    if (isMusicPlaying) {
      stopAmbientMusic();
      setIsMusicPlaying(false);
    } else {
      startAmbientMusic();
      setIsMusicPlaying(true);
    }
  };

  const VolumeSlider: React.FC<{
    icon: React.ReactNode;
    value: number;
    onChange: (value: number) => void;
    label: string;
    disabled?: boolean;
  }> = ({ icon, value, onChange, label, disabled = false }) => (
    <div className="flex items-center gap-2 py-2">
      <div className="w-6 h-6 flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled || !isAudioEnabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   slider:bg-blue-500 slider:rounded-lg slider:appearance-none slider:h-2"
        />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">
        {Math.round(value * 100)}
      </span>
    </div>
  );

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={handleToggleAudio}
          className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 
                   hover:bg-white/20 transition-colors duration-200"
          title={isAudioEnabled ? "Desativar áudio" : "Ativar áudio"}
        >
          {isAudioEnabled ? (
            <Volume2 className="w-5 h-5 text-white" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Botão principal */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="flex items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm 
                 border border-white/20 hover:bg-white/20 transition-colors duration-200"
      >
        {isAudioEnabled ? (
          <Volume2 className="w-5 h-5 text-white" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-400" />
        )}
        <span className="text-white text-sm hidden sm:inline">
          {isAudioEnabled ? 'Áudio Ativo' : 'Áudio Desativado'}
        </span>
      </button>

      {/* Painel de controles expandido */}
      {showControls && (
        <div className="absolute top-full mt-2 right-0 w-80 p-4 bg-white/90 backdrop-blur-md 
                      rounded-xl border border-white/30 shadow-xl z-50">
          <div className="space-y-4">
            {/* Header com controles principais */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-800">Controles de Áudio</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleToggleMusic}
                  disabled={!isAudioEnabled}
                  className={`p-2 rounded-lg transition-colors duration-200 
                           ${isMusicPlaying && isAudioEnabled
                             ? 'bg-blue-500 text-white' 
                             : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                           } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isMusicPlaying ? "Parar música" : "Tocar música ambiente"}
                >
                  <Music className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToggleAudio}
                  className={`p-2 rounded-lg transition-colors duration-200 
                           ${isAudioEnabled
                             ? 'bg-green-500 text-white' 
                             : 'bg-red-500 text-white'
                           }`}
                  title={isAudioEnabled ? "Desativar áudio" : "Ativar áudio"}
                >
                  {isAudioEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sliders de volume */}
            <div className="space-y-3">
              <VolumeSlider
                icon={<Volume2 className="w-4 h-4" />}
                value={volumes.master}
                onChange={setMasterVolume}
                label="Volume Geral"
                disabled={!isAudioEnabled}
              />
              
              <VolumeSlider
                icon={<Headphones className="w-4 h-4" />}
                value={volumes.sfx}
                onChange={setSfxVolume}
                label="Efeitos Sonoros"
                disabled={!isAudioEnabled}
              />
              
              <VolumeSlider
                icon={<Music className="w-4 h-4" />}
                value={volumes.music}
                onChange={setMusicVolume}
                label="Música Ambiente"
                disabled={!isAudioEnabled}
              />
            </div>

            {/* Informações sobre vibração */}
            {('vibrate' in navigator) && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Vibrate className="w-4 h-4" />
                  <span>Feedback tátil disponível</span>
                </div>
              </div>
            )}

            {/* Botão para fechar */}
            <button
              onClick={() => setShowControls(false)}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 
                       transition-colors duration-200"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioControls;