import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Eye, 
  Gamepad, 
  User, 
  Info,
  Download,
  RotateCcw,
  Palette,
  Languages,
  HelpCircle,
  Shield,
  Moon,
  Sun
} from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
}

interface GameSettings {
  // Audio & Video
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  voiceVolume: number;
  hapticFeedback: boolean;
  
  // Gameplay
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  autoEndTurn: boolean;
  showHints: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  
  // Accessibility
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  colorBlindSupport: boolean;
  screenReader: boolean;
  
  // Appearance
  theme: 'dark' | 'light' | 'auto';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  
  // Account (future)
  syncData: boolean;
  notifications: boolean;
  analytics: boolean;
}

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<GameSettings>({
    masterVolume: 80,
    sfxVolume: 100,
    musicVolume: 70,
    voiceVolume: 90,
    hapticFeedback: true,
    difficulty: 'intermediate',
    autoEndTurn: false,
    showHints: true,
    animationSpeed: 'normal',
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    colorBlindSupport: false,
    screenReader: false,
    theme: 'dark',
    language: 'pt-BR',
    syncData: true,
    notifications: true,
    analytics: true
  });

  const [activeSection, setActiveSection] = useState<string>('audio');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('equilibrium-settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('equilibrium-settings', JSON.stringify(updated));
  };

  const resetSettings = () => {
    const defaultSettings: GameSettings = {
      masterVolume: 80,
      sfxVolume: 100,
      musicVolume: 70,
      voiceVolume: 90,
      hapticFeedback: true,
      difficulty: 'intermediate',
      autoEndTurn: false,
      showHints: true,
      animationSpeed: 'normal',
      highContrast: false,
      largeText: false,
      reduceMotion: false,
      colorBlindSupport: false,
      screenReader: false,
      theme: 'dark',
      language: 'pt-BR',
      syncData: true,
      notifications: true,
      analytics: true
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('equilibrium-settings', JSON.stringify(defaultSettings));
    setShowResetConfirm(false);
  };

  const sections: SettingSection[] = [
    {
      id: 'audio',
      title: 'Áudio e Vídeo',
      icon: <Volume2 size={20} />,
      description: 'Som, música e vibração'
    },
    {
      id: 'gameplay',
      title: 'Gameplay',
      icon: <Gamepad size={20} />,
      description: 'Dificuldade, dicas e automação'
    },
    {
      id: 'accessibility',
      title: 'Acessibilidade',
      icon: <Eye size={20} />,
      description: 'Recursos de inclusão'
    },
    {
      id: 'appearance',
      title: 'Aparência',
      icon: <Palette size={20} />,
      description: 'Tema e idioma'
    },
    {
      id: 'account',
      title: 'Conta',
      icon: <User size={20} />,
      description: 'Sincronização e privacidade'
    },
    {
      id: 'about',
      title: 'Sobre',
      icon: <Info size={20} />,
      description: 'Versão e informações'
    }
  ];

  const SliderSetting: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }> = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = '%' }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-white font-medium">{label}</label>
        <span className="text-blue-400">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  const ToggleSetting: React.FC<{
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg mb-4">
      <div>
        <div className="text-white font-medium">{label}</div>
        {description && (
          <div className="text-gray-400 text-sm mt-1">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-500' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SelectSetting: React.FC<{
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }> = ({ label, value, options, onChange }) => (
    <div className="mb-6">
      <label className="text-white font-medium mb-2 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-800">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'audio':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Áudio e Vídeo</h3>
            
            <SliderSetting
              label="Volume Geral"
              value={settings.masterVolume}
              onChange={(value) => saveSettings({ masterVolume: value })}
            />
            
            <SliderSetting
              label="Efeitos Sonoros"
              value={settings.sfxVolume}
              onChange={(value) => saveSettings({ sfxVolume: value })}
            />
            
            <SliderSetting
              label="Música de Fundo"
              value={settings.musicVolume}
              onChange={(value) => saveSettings({ musicVolume: value })}
            />
            
            <SliderSetting
              label="Narração"
              value={settings.voiceVolume}
              onChange={(value) => saveSettings({ voiceVolume: value })}
            />
            
            <ToggleSetting
              label="Vibração Háptica"
              description="Feedback tátil durante o jogo"
              checked={settings.hapticFeedback}
              onChange={(checked) => saveSettings({ hapticFeedback: checked })}
            />
          </div>
        );

      case 'gameplay':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Configurações de Gameplay</h3>
            
            <SelectSetting
              label="Nível de Dificuldade"
              value={settings.difficulty}
              options={[
                { value: 'beginner', label: 'Iniciante' },
                { value: 'intermediate', label: 'Intermediário' },
                { value: 'advanced', label: 'Avançado' }
              ]}
              onChange={(value) => saveSettings({ difficulty: value as any })}
            />
            
            <SelectSetting
              label="Velocidade das Animações"
              value={settings.animationSpeed}
              options={[
                { value: 'slow', label: 'Lenta' },
                { value: 'normal', label: 'Normal' },
                { value: 'fast', label: 'Rápida' }
              ]}
              onChange={(value) => saveSettings({ animationSpeed: value as any })}
            />
            
            <ToggleSetting
              label="Finalizar Turno Automaticamente"
              description="Avança automaticamente após jogar uma carta"
              checked={settings.autoEndTurn}
              onChange={(checked) => saveSettings({ autoEndTurn: checked })}
            />
            
            <ToggleSetting
              label="Mostrar Dicas"
              description="Exibe sugestões durante o jogo"
              checked={settings.showHints}
              onChange={(checked) => saveSettings({ showHints: checked })}
            />
          </div>
        );

      case 'accessibility':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Acessibilidade</h3>
            
            <ToggleSetting
              label="Alto Contraste"
              description="Aumenta o contraste para melhor visibilidade"
              checked={settings.highContrast}
              onChange={(checked) => saveSettings({ highContrast: checked })}
            />
            
            <ToggleSetting
              label="Texto Grande"
              description="Aumenta o tamanho da fonte"
              checked={settings.largeText}
              onChange={(checked) => saveSettings({ largeText: checked })}
            />
            
            <ToggleSetting
              label="Reduzir Movimentos"
              description="Minimiza animações que podem causar desconforto"
              checked={settings.reduceMotion}
              onChange={(checked) => saveSettings({ reduceMotion: checked })}
            />
            
            <ToggleSetting
              label="Suporte para Daltonismo"
              description="Ajusta cores para pessoas com daltonismo"
              checked={settings.colorBlindSupport}
              onChange={(checked) => saveSettings({ colorBlindSupport: checked })}
            />
            
            <ToggleSetting
              label="Compatibilidade com Leitor de Tela"
              description="Otimiza a interface para leitores de tela"
              checked={settings.screenReader}
              onChange={(checked) => saveSettings({ screenReader: checked })}
            />
          </div>
        );

      case 'appearance':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Aparência</h3>
            
            <SelectSetting
              label="Tema"
              value={settings.theme}
              options={[
                { value: 'dark', label: 'Escuro' },
                { value: 'light', label: 'Claro' },
                { value: 'auto', label: 'Automático' }
              ]}
              onChange={(value) => saveSettings({ theme: value as any })}
            />
            
            <SelectSetting
              label="Idioma"
              value={settings.language}
              options={[
                { value: 'pt-BR', label: 'Português (Brasil)' },
                { value: 'en-US', label: 'English (US)' },
                { value: 'es-ES', label: 'Español' }
              ]}
              onChange={(value) => saveSettings({ language: value as any })}
            />
          </div>
        );

      case 'account':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Conta e Privacidade</h3>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-blue-400 font-medium">Recursos Futuros</span>
              </div>
              <p className="text-gray-300 text-sm">
                Funcionalidades de conta estarão disponíveis em uma atualização futura.
              </p>
            </div>
            
            <ToggleSetting
              label="Sincronização de Dados"
              description="Salva progresso na nuvem (Em Breve)"
              checked={settings.syncData}
              onChange={(checked) => saveSettings({ syncData: checked })}
            />
            
            <ToggleSetting
              label="Notificações"
              description="Receber alertas e lembretes (Em Breve)"
              checked={settings.notifications}
              onChange={(checked) => saveSettings({ notifications: checked })}
            />
            
            <ToggleSetting
              label="Compartilhar Dados de Uso"
              description="Ajuda a melhorar o jogo compartilhando estatísticas anônimas"
              checked={settings.analytics}
              onChange={(checked) => saveSettings({ analytics: checked })}
            />
          </div>
        );

      case 'about':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Sobre o Equilibrium</h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white font-medium">Versão</div>
                <div className="text-gray-400">1.0.0 (Build 2024.01)</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white font-medium">Desenvolvido por</div>
                <div className="text-gray-400">Equipe de Educação Médica</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white font-medium">Tecnologia</div>
                <div className="text-gray-400">React + TypeScript + PWA</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white font-medium">Licenças</div>
                <div className="text-gray-400">Open source components</div>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                <HelpCircle size={16} />
                Centro de Ajuda
              </button>
              
              <button className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                <Download size={16} />
                Exportar Dados
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Configurações</h1>
              <p className="text-gray-400">Personalize sua experiência de jogo</p>
            </div>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
            <span>Restaurar Padrões</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full p-4 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-500/20 border-blue-500/50 border text-blue-400'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-1">
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                  </div>
                  <div className="text-sm text-gray-400 ml-8">
                    {section.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              {renderSectionContent()}
            </div>
          </div>
        </div>

        {/* Reset confirmation modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full mx-4 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Restaurar Configurações</h3>
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja restaurar todas as configurações para os valores padrão? 
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={resetSettings}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Restaurar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};