// Screenshot Generator para App Store Assets
import html2canvas from 'html2canvas';

interface ScreenshotConfig {
  name: string;
  description: string;
  size: { width: number; height: number };
  selector: string;
  background?: string;
  overlay?: {
    title: string;
    subtitle: string;
    position: 'top' | 'bottom' | 'center';
  };
}

interface AppStoreAsset {
  platform: 'ios' | 'android' | 'web';
  type: 'screenshot' | 'icon' | 'banner';
  size: string;
  purpose: string;
  url: string;
}

// Configurações de screenshots para diferentes plataformas
const SCREENSHOT_CONFIGS: ScreenshotConfig[] = [
  // iOS App Store
  {
    name: 'ios-main-gameplay',
    description: 'Interface principal do jogo - iOS',
    size: { width: 1290, height: 2796 }, // iPhone 14 Pro Max
    selector: '#game-layout',
    overlay: {
      title: 'Equilibrium',
      subtitle: 'Domine a fisiologia jogando',
      position: 'top'
    }
  },
  {
    name: 'ios-dashboard',
    description: 'Dashboard de biomarcadores - iOS',
    size: { width: 1290, height: 2796 },
    selector: '#biomarker-dashboard',
    overlay: {
      title: 'Monitore em Tempo Real',
      subtitle: 'Acompanhe todos os biomarcadores',
      position: 'bottom'
    }
  },
  {
    name: 'ios-cards',
    description: 'Sistema de cartas - iOS',
    size: { width: 1290, height: 2796 },
    selector: '#card-interface',
    overlay: {
      title: 'Estratégia Médica',
      subtitle: 'Use cartas para equilibrar sistemas',
      position: 'center'
    }
  },
  {
    name: 'ios-tutorial',
    description: 'Tutorial interativo - iOS',
    size: { width: 1290, height: 2796 },
    selector: '#tutorial-overlay',
    overlay: {
      title: 'Aprenda Jogando',
      subtitle: 'Tutorial passo-a-passo',
      position: 'top'
    }
  },
  {
    name: 'ios-results',
    description: 'Tela de resultados - iOS',
    size: { width: 1290, height: 2796 },
    selector: '#results-screen',
    overlay: {
      title: 'Análise Completa',
      subtitle: 'Feedback educacional detalhado',
      position: 'bottom'
    }
  },

  // Google Play Store
  {
    name: 'android-main-gameplay',
    description: 'Interface principal do jogo - Android',
    size: { width: 1080, height: 1920 }, // Standard Android
    selector: '#game-layout',
    background: '#1e293b'
  },
  {
    name: 'android-dashboard',
    description: 'Dashboard de biomarcadores - Android',
    size: { width: 1080, height: 1920 },
    selector: '#biomarker-dashboard'
  },
  {
    name: 'android-tablet',
    description: 'Versão tablet - Android',
    size: { width: 2560, height: 1600 }, // Tablet landscape
    selector: '#game-layout'
  },

  // Web/Desktop
  {
    name: 'web-desktop-main',
    description: 'Interface desktop principal',
    size: { width: 1920, height: 1080 },
    selector: '#main-app',
    background: 'linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)'
  },
  {
    name: 'web-mobile-responsive',
    description: 'Versão mobile responsiva',
    size: { width: 390, height: 844 }, // iPhone 12 Pro
    selector: '#main-app'
  }
];

// Dados para assets de store
const APP_STORE_ASSETS: AppStoreAsset[] = [
  // iOS Screenshots
  {
    platform: 'ios',
    type: 'screenshot',
    size: '1290x2796',
    purpose: 'App Store screenshot - Main gameplay',
    url: '/screenshots/ios-main-gameplay.png'
  },
  {
    platform: 'ios', 
    type: 'screenshot',
    size: '1290x2796',
    purpose: 'App Store screenshot - Dashboard',
    url: '/screenshots/ios-dashboard.png'
  },

  // Android Screenshots
  {
    platform: 'android',
    type: 'screenshot', 
    size: '1080x1920',
    purpose: 'Play Store screenshot - Phone',
    url: '/screenshots/android-main-gameplay.png'
  },
  {
    platform: 'android',
    type: 'screenshot',
    size: '2560x1600', 
    purpose: 'Play Store screenshot - Tablet',
    url: '/screenshots/android-tablet.png'
  },

  // Icons
  {
    platform: 'ios',
    type: 'icon',
    size: '1024x1024',
    purpose: 'App Store icon',
    url: '/icons/ios-app-icon.png'
  },
  {
    platform: 'android',
    type: 'icon',
    size: '512x512',
    purpose: 'Play Store icon',
    url: '/icons/android-app-icon.png'
  }
];

class ScreenshotGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async generateScreenshot(config: ScreenshotConfig): Promise<string> {
    const element = document.querySelector(config.selector) as HTMLElement;
    
    if (!element) {
      throw new Error(`Element not found: ${config.selector}`);
    }

    // Configure canvas
    this.canvas.width = config.size.width;
    this.canvas.height = config.size.height;

    // Set background
    if (config.background) {
      this.ctx.fillStyle = config.background;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Capture element
    const screenshot = await html2canvas(element, {
      width: config.size.width,
      height: config.size.height,
      scale: 1,
      useCORS: true,
      backgroundColor: config.background || null,
      logging: false
    });

    // Draw screenshot to canvas
    this.ctx.drawImage(screenshot, 0, 0, this.canvas.width, this.canvas.height);

    // Add overlay if configured
    if (config.overlay) {
      this.addOverlay(config.overlay, config.size);
    }

    return this.canvas.toDataURL('image/png', 1.0);
  }

  private addOverlay(
    overlay: { title: string; subtitle: string; position: 'top' | 'bottom' | 'center' }, 
    size: { width: number; height: number }
  ): void {
    const ctx = this.ctx;
    
    // Configure text styles
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    
    let y: number;
    
    // Calculate position
    switch (overlay.position) {
      case 'top':
        y = 80;
        // Add background overlay
        ctx.fillRect(0, 0, size.width, 200);
        break;
      case 'bottom':
        y = size.height - 120;
        ctx.fillRect(0, size.height - 200, size.width, 200);
        break;
      case 'center':
        y = size.height / 2 - 40;
        ctx.fillRect(0, size.height / 2 - 100, size.width, 200);
        break;
    }

    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(overlay.title, size.width / 2, y);

    // Draw subtitle
    ctx.font = '32px Arial';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(overlay.subtitle, size.width / 2, y + 60);
  }

  async generateAllScreenshots(): Promise<{ [key: string]: string }> {
    const results: { [key: string]: string } = {};
    
    for (const config of SCREENSHOT_CONFIGS) {
      try {
        console.log(`Generating screenshot: ${config.name}`);
        results[config.name] = await this.generateScreenshot(config);
      } catch (error) {
        console.error(`Failed to generate ${config.name}:`, error);
      }
    }

    return results;
  }

  async generateAppIcon(size: number): Promise<string> {
    this.canvas.width = size;
    this.canvas.height = size;

    const ctx = this.ctx;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#7c3aed');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Add rounded corners (iOS style)
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Draw icon elements
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.15;

    // Medical cross
    ctx.fillStyle = 'white';
    ctx.fillRect(centerX - size * 0.02, centerY - radius, size * 0.04, radius * 2);
    ctx.fillRect(centerX - radius * 0.7, centerY - size * 0.02, radius * 1.4, size * 0.04);

    // Heart rate line
    ctx.strokeStyle = 'white';
    ctx.lineWidth = size * 0.01;
    ctx.beginPath();
    ctx.moveTo(size * 0.2, centerY + size * 0.1);
    ctx.lineTo(size * 0.35, centerY + size * 0.1);
    ctx.lineTo(size * 0.4, centerY - size * 0.05);
    ctx.lineTo(size * 0.45, centerY + size * 0.15);
    ctx.lineTo(size * 0.55, centerY - size * 0.1);
    ctx.lineTo(size * 0.6, centerY + size * 0.1);
    ctx.lineTo(size * 0.8, centerY + size * 0.1);
    ctx.stroke();

    return this.canvas.toDataURL('image/png', 1.0);
  }

  // Download screenshot
  downloadScreenshot(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  }

  // Generate marketing banner
  async generateMarketingBanner(): Promise<string> {
    const width = 1200;
    const height = 630; // Facebook/Twitter optimal size

    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.ctx;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(0.5, '#3b82f6');
    gradient.addColorStop(1, '#7c3aed');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Equilibrium', width / 2, height / 2 - 50);

    // Subtitle
    ctx.font = '36px Arial';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Jogo Educativo de Fisiologia', width / 2, height / 2 + 20);

    // Tagline
    ctx.font = '24px Arial';
    ctx.fillText('Domine os sistemas homeostáticos do corpo humano', width / 2, height / 2 + 80);

    return this.canvas.toDataURL('image/png', 1.0);
  }
}

// Store descriptions for different platforms
export const STORE_DESCRIPTIONS = {
  ios: {
    subtitle: 'Jogo Educativo de Fisiologia',
    description: `Transforme seu aprendizado em fisiologia com o Equilibrium! 

🎮 APRENDA JOGANDO
• Domine conceitos de homeostase de forma interativa
• Simulações baseadas em casos reais
• Feedback educacional em tempo real

🏥 SISTEMAS MÉDICOS
• Sistema Glicêmico (controle da glicose)
• Sistema Ácido-Base (equilíbrio do pH)
• Sistema Térmico (termorregulação)

📚 PARA ESTUDANTES
• Medicina, Enfermagem e Ciências da Saúde
• Tutorial interativo incluso
• Progressão gamificada

✨ RECURSOS PRINCIPAIS
• Interface intuitiva e moderna
• Modo offline disponível
• Conquistas e estatísticas
• Conteúdo validado cientificamente

Perfeito para estudantes de medicina, enfermagem e profissionais da saúde que desejam dominar os conceitos de fisiologia de forma divertida e eficaz!`,
    
    keywords: 'medicina,fisiologia,educação,saúde,enfermagem,biomedicina,homeostase,glicemia,pH,temperatura',
    
    whatsNew: `• Interface redesenhada para melhor experiência
• Novo sistema de tutorial interativo
• Melhorias na performance e responsividade
• Correções de bugs e otimizações`
  },

  android: {
    shortDescription: 'Domine fisiologia através de gameplay educativo e interativo',
    
    fullDescription: `🔬 REVOLUCIONE SEU APRENDIZADO EM FISIOLOGIA

O Equilibrium transforma conceitos complexos de fisiologia em uma experiência de jogo envolvente e educativa. Ideal para estudantes de medicina, enfermagem e profissionais da saúde.

🎯 CARACTERÍSTICAS PRINCIPAIS:

🎮 GAMIFICAÇÃO EDUCATIVA
• Simulações realistas de sistemas fisiológicos
• Feedback em tempo real sobre suas decisões
• Mecânicas de jogo que tornam o aprendizado divertido

🏥 SISTEMAS MÉDICOS COMPLETOS
• Sistema Glicêmico: Controle da glicose sanguínea
• Sistema Ácido-Base: Equilíbrio do pH corporal  
• Sistema Térmico: Mecanismos de termorregulação

📚 CONTEÚDO EDUCACIONAL
• Baseado em evidências científicas atuais
• Casos clínicos reais adaptados para gameplay
• Tutorial interativo para iniciantes
• Material de apoio integrado

🏆 PROGRESSÃO E CONQUISTAS
• Sistema de níveis e dificuldade progressiva
• Conquistas desbloqueáveis
• Estatísticas detalhadas de progresso
• Comparação com outros estudantes

💻 TECNOLOGIA AVANÇADA
• Interface moderna e intuitiva
• Funciona offline após download inicial
• Otimizado para smartphones e tablets
• Atualizações regulares de conteúdo

👨‍⚕️ DESENVOLVIDO POR ESPECIALISTAS
• Conteúdo revisado por professores de fisiologia
• Metodologia pedagógica comprovada
• Alinhado com currículos acadêmicos

Transforme seu smartphone em uma ferramenta poderosa de aprendizado médico. Baixe o Equilibrium e descubra uma nova forma de dominar a fisiologia!`,

    tags: ['Educação', 'Medicina', 'Saúde', 'Ciência', 'Jogos Educativos', 'Fisiologia', 'Estudos']
  },

  web: {
    metaDescription: 'Equilibrium - Jogo educativo de fisiologia. Domine os sistemas homeostáticos através de gameplay interativo. Ideal para estudantes de medicina e saúde.',
    
    openGraph: {
      title: 'Equilibrium - Jogo Educativo de Fisiologia',
      description: 'Transforme seu aprendizado em fisiologia com simulações interativas e feedback em tempo real.',
      image: '/marketing/og-image.png',
      url: 'https://equilibrium-edu.com'
    },

    features: [
      'Simulação realista de sistemas fisiológicos',
      'Feedback educacional em tempo real',
      'Interface moderna e intuitiva',
      'Conteúdo validado cientificamente',
      'Progressão gamificada',
      'Funciona offline (PWA)',
      'Otimizado para todos os dispositivos'
    ]
  }
};

export { ScreenshotGenerator, SCREENSHOT_CONFIGS, APP_STORE_ASSETS };