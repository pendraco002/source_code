import React, { useState } from 'react';
import { Download, Image, FileText, Video, Share2, Copy, Check } from 'lucide-react';

interface AssetItem {
  name: string;
  type: 'image' | 'video' | 'document' | 'logo';
  size: string;
  format: string;
  url: string;
  description?: string;
}

interface SocialPost {
  platform: string;
  content: string;
  hashtags: string[];
  image?: string;
}

export const PressKit: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string>('');

  const assets: AssetItem[] = [
    {
      name: 'Logo Principal',
      type: 'logo',
      size: '1024x1024',
      format: 'PNG',
      url: '/assets/logo-main.png',
      description: 'Logo principal em alta resolução com fundo transparente'
    },
    {
      name: 'Screenshot - Gameplay',
      type: 'image',
      size: '1920x1080',
      format: 'PNG',
      url: '/assets/screenshot-gameplay.png',
      description: 'Captura de tela mostrando a interface principal do jogo'
    },
    {
      name: 'Screenshot - Dashboard',
      type: 'image',
      size: '1920x1080',
      format: 'PNG',
      url: '/assets/screenshot-dashboard.png',
      description: 'Dashboard de biomarcadores em ação'
    },
    {
      name: 'Screenshot - Cards',
      type: 'image',
      size: '1920x1080',
      format: 'PNG',
      url: '/assets/screenshot-cards.png',
      description: 'Sistema de cartas e interface de jogo'
    },
    {
      name: 'Video Demo',
      type: 'video',
      size: '1920x1080',
      format: 'MP4',
      url: '/assets/demo-video.mp4',
      description: 'Demonstração completa do gameplay (2 min)'
    },
    {
      name: 'Fact Sheet',
      type: 'document',
      size: '2 páginas',
      format: 'PDF',
      url: '/assets/equilibrium-factsheet.pdf',
      description: 'Informações técnicas e educacionais do projeto'
    }
  ];

  const factSheet = {
    title: "Equilibrium - Jogo Educativo de Fisiologia",
    tagline: "O futuro do ensino de fisiologia",
    description: "Equilibrium é uma aplicação web educativa revolucionária que ensina conceitos de fisiologia através de gamificação. Os estudantes aprendem sobre sistemas homeostáticos do corpo humano de forma interativa e envolvente.",
    keyFeatures: [
      "Simulação realista de sistemas fisiológicos",
      "Interface intuitiva com feedback em tempo real",
      "Conteúdo educacional validado cientificamente",
      "Sistema de progressão e conquistas",
      "Suporte a múltiplos dispositivos (PWA)",
      "Analytics detalhado para educadores"
    ],
    targetAudience: [
      "Estudantes de Medicina",
      "Estudantes de Enfermagem",
      "Profissionais da Saúde em formação continuada",
      "Educadores em Ciências da Saúde",
      "Instituições de Ensino Superior"
    ],
    technicalSpecs: {
      platform: "Web App (PWA)",
      technology: "React + TypeScript",
      compatibility: "Chrome, Firefox, Safari, Edge",
      offline: "Funcionalidade offline disponível",
      responsive: "Totalmente responsivo (mobile/tablet/desktop)"
    },
    educationalContent: {
      systems: ["Sistema Glicêmico", "Sistema Ácido-Base", "Sistema Térmico"],
      levels: ["Iniciante", "Intermediário", "Avançado"],
      duration: "20-45 minutos por sessão",
      assessment: "Avaliação contínua integrada"
    },
    contact: {
      email: "contato@equilibrium-edu.com",
      website: "https://equilibrium-edu.com",
      social: "@EquilibriumEdu"
    }
  };

  const socialPosts: SocialPost[] = [
    {
      platform: "LinkedIn",
      content: "🔬 Revolucionando o ensino de fisiologia! O Equilibrium transforma conceitos complexos em gameplay envolvente. Perfeito para estudantes de medicina e profissionais da saúde. #EducaçãoMédica #Fisiologia #Gamificação",
      hashtags: ["EducaçãoMédica", "Fisiologia", "Gamificação", "Medicina", "Tecnologia"],
      image: "/assets/social-linkedin.png"
    },
    {
      platform: "Twitter/X",
      content: "🎮 Aprenda fisiologia jogando! Equilibrium torna o ensino de homeostase divertido e eficaz. Ideal para estudantes e educadores. 🧠⚕️",
      hashtags: ["EdTech", "Medicina", "Fisiologia", "Gamificação", "Educação"],
      image: "/assets/social-twitter.png"
    },
    {
      platform: "Instagram",
      content: "📚✨ Transforme seu aprendizado em fisiologia! Com o Equilibrium, você domina conceitos de homeostase de forma visual e interativa. Perfeito para estudantes de medicina! 🎯🔬",
      hashtags: ["medicina", "fisiologia", "estudante", "gamificação", "educação", "saúde"],
      image: "/assets/social-instagram.png"
    },
    {
      platform: "Facebook",
      content: "Educadores e estudantes da área da saúde! Conheçam o Equilibrium - uma ferramenta inovadora que transforma o ensino de fisiologia. Simulações realistas, feedback imediato e aprendizado baseado em evidências científicas. 🎓⚕️",
      hashtags: ["EducaçãoMédica", "Fisiologia", "Tecnologia", "Ensino"],
      image: "/assets/social-facebook.png"
    }
  ];

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const AssetCard: React.FC<{ asset: AssetItem }> = ({ asset }) => {
    const getIcon = (type: string) => {
      switch (type) {
        case 'image':
        case 'logo':
          return <Image className="w-6 h-6" />;
        case 'video':
          return <Video className="w-6 h-6" />;
        case 'document':
          return <FileText className="w-6 h-6" />;
        default:
          return <FileText className="w-6 h-6" />;
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-4">
          <div className="text-blue-600 mr-3">
            {getIcon(asset.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{asset.name}</h3>
            <p className="text-sm text-gray-500">{asset.size} • {asset.format}</p>
          </div>
        </div>
        
        {asset.description && (
          <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
        )}
        
        <button
          onClick={() => handleDownload(asset.url, asset.name)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    );
  };

  const SocialPostCard: React.FC<{ post: SocialPost }> = ({ post }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-blue-600" />
        {post.platform}
      </h3>
      
      <div className="bg-gray-50 rounded-md p-4 mb-4">
        <p className="text-gray-700 mb-2">{post.content}</p>
        <div className="flex flex-wrap gap-1">
          {post.hashtags.map((tag, index) => (
            <span key={index} className="text-blue-600 text-sm">#{tag}</span>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => handleCopy(post.content + '\n\n' + post.hashtags.map(tag => `#${tag}`).join(' '), post.platform)}
        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
      >
        {copiedText === post.platform ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copiedText === post.platform ? 'Copiado!' : 'Copiar Texto'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Press Kit - Equilibrium</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Materiais promocionais e informações para imprensa sobre o jogo educativo de fisiologia
          </p>
        </div>

        {/* Fact Sheet */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações do Produto</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Sobre o Equilibrium</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">{factSheet.description}</p>
                
                <h4 className="font-semibold mb-2">Principais Recursos:</h4>
                <ul className="space-y-1 text-gray-700">
                  {factSheet.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Público-Alvo:</h4>
                <ul className="space-y-1 text-gray-700 mb-4">
                  {factSheet.targetAudience.map((audience, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      {audience}
                    </li>
                  ))}
                </ul>

                <h4 className="font-semibold mb-2">Especificações Técnicas:</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-medium">Plataforma:</span> {factSheet.technicalSpecs.platform}</p>
                  <p><span className="font-medium">Tecnologia:</span> {factSheet.technicalSpecs.technology}</p>
                  <p><span className="font-medium">Compatibilidade:</span> {factSheet.technicalSpecs.compatibility}</p>
                  <p><span className="font-medium">Offline:</span> {factSheet.technicalSpecs.offline}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div><span className="font-medium">Email:</span> {factSheet.contact.email}</div>
                <div><span className="font-medium">Website:</span> {factSheet.contact.website}</div>
                <div><span className="font-medium">Redes Sociais:</span> {factSheet.contact.social}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Assets */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Assets para Download</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset, index) => (
              <AssetCard key={index} asset={asset} />
            ))}
          </div>
        </section>

        {/* Social Media Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts para Redes Sociais</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {socialPosts.map((post, index) => (
              <SocialPostCard key={index} post={post} />
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Contato para Imprensa</h2>
          <p className="text-blue-100 mb-6">
            Para mais informações, interviews ou demonstrações personalizadas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`mailto:${factSheet.contact.email}`}
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Enviar Email
            </a>
            <button
              onClick={() => handleCopy(factSheet.contact.email, 'email')}
              className="border border-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              {copiedText === 'email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copiar Email
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PressKit;