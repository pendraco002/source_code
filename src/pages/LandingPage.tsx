import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Users, Trophy, Star, ArrowRight, Download, Gamepad2 } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
  >
    <div className="text-blue-400 mb-4 flex justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 text-center">{title}</h3>
    <p className="text-gray-300 text-center leading-relaxed">{description}</p>
  </motion.div>
);

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, role, content, rating }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
    <div className="flex mb-3">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
        />
      ))}
    </div>
    <p className="text-gray-300 mb-4 italic">"{content}"</p>
    <div>
      <p className="text-white font-semibold">{name}</p>
      <p className="text-gray-400 text-sm">{role}</p>
    </div>
  </div>
);

interface StatsProps {
  number: string;
  label: string;
}

const StatItem: React.FC<StatsProps> = ({ number, label }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-white mb-2">{number}</div>
    <div className="text-gray-400">{label}</div>
  </div>
);

export const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Analytics: Track landing page view
    if (typeof window !== 'undefined') {
      const analytics = JSON.parse(localStorage.getItem('equilibrium-analytics') || '{}');
      analytics.landingPageViews = (analytics.landingPageViews || 0) + 1;
      analytics.lastVisit = new Date().toISOString();
      localStorage.setItem('equilibrium-analytics', JSON.stringify(analytics));
    }
  }, []);

  const handleGetStarted = () => {
    // Analytics: Track CTA clicks
    const analytics = JSON.parse(localStorage.getItem('equilibrium-analytics') || '{}');
    analytics.ctaClicks = (analytics.ctaClicks || 0) + 1;
    localStorage.setItem('equilibrium-analytics', JSON.stringify(analytics));
    
    // Navigate to game (this would be handled by router in full implementation)
    window.location.hash = '#/game';
  };

  const features = [
    {
      icon: <BookOpen size={48} />,
      title: "Aprendizado Interativo",
      description: "Domine conceitos de fisiologia através de gameplay envolvente e educativo."
    },
    {
      icon: <Gamepad2 size={48} />,
      title: "Simulação Realista",
      description: "Experimente cenários médicos baseados em casos reais com feedback em tempo real."
    },
    {
      icon: <Users size={48} />,
      title: "Para Estudantes",
      description: "Ferramenta ideal para estudantes de medicina, enfermagem e profissionais da saúde."
    },
    {
      icon: <Trophy size={48} />,
      title: "Sistema de Conquistas",
      description: "Acompanhe seu progresso e desbloqueie conquistas conforme domina novos sistemas."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Ana Silva",
      role: "Professora de Fisiologia, USP",
      content: "Revolucionou a forma como ensino homeostase. Os alunos estão mais engajados e retêm melhor o conhecimento.",
      rating: 5
    },
    {
      name: "Pedro Santos",
      role: "Estudante de Medicina, 3º ano",
      content: "Finalmente consegui entender o equilibrio ácido-base de forma intuitiva. O jogo torna complexo em simples!",
      rating: 5
    },
    {
      name: "Enfª Maria Costa",
      role: "Enfermeira Especialista",
      content: "Uso para treinamento da equipe. É incrível ver como todos melhoram sua compreensão dos sinais vitais.",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mb-6">
              <BookOpen size={40} className="text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Equilibrium
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
            O futuro do ensino de fisiologia
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Domine os sistemas homeostáticos do corpo humano através de um jogo educativo 
            revolucionário. Aprenda fisiologia de forma prática, interativa e divertida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                       px-8 py-4 rounded-full text-lg font-semibold flex items-center justify-center gap-2 
                       transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Play size={20} />
              Jogar Agora
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-full text-lg 
                       font-semibold flex items-center justify-center gap-2 transition-all duration-300 
                       hover:bg-white/10"
            >
              <Download size={20} />
              Download
            </motion.button>
          </div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-16 h-16 bg-blue-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"
        />
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem number="10K+" label="Estudantes Ativos" />
            <StatItem number="95%" label="Taxa de Aprovação" />
            <StatItem number="4.8/5" label="Avaliação Média" />
            <StatItem number="3" label="Sistemas Disponíveis" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Por que escolher o <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Equilibrium</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Uma nova abordagem para o ensino de fisiologia que combina ciência, tecnologia e gamificação.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Como Funciona</h2>
            <p className="text-xl text-gray-300">Três passos simples para dominar a fisiologia</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Escolha um Sistema</h3>
              <p className="text-gray-300">Selecione entre Sistema Glicêmico, Ácido-Base ou Térmico para focar seu aprendizado.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Jogue e Aprenda</h3>
              <p className="text-gray-300">Use cartas estratégicas para manter o equilíbrio dos biomarcadores em cenários realistas.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Domine os Conceitos</h3>
              <p className="text-gray-300">Receba feedback educacional imediato e aplique o conhecimento em situações complexas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">O que dizem sobre o Equilibrium</h2>
            <p className="text-xl text-gray-300">Depoimentos de educadores e estudantes</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Testimonial {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para revolucionar seu aprendizado?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a milhares de estudantes que já transformaram sua compreensão da fisiologia.
            </p>
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                       px-12 py-4 rounded-full text-xl font-semibold flex items-center justify-center gap-3 
                       mx-auto transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Começar Agora
              <ArrowRight size={24} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-black/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Equilibrium. Desenvolvido com ❤️ para educação médica.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;