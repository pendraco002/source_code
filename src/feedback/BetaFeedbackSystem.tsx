import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Bug, Lightbulb, ThumbsUp, Send, X } from 'lucide-react';
import { useAnalytics } from '../shared/analytics/AnalyticsManager';

interface FeedbackItem {
  id: string;
  type: 'bug' | 'feature' | 'general' | 'rating';
  rating?: number;
  title: string;
  description: string;
  screenshot?: string;
  userAgent: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

interface BetaUser {
  id: string;
  email: string;
  role: string;
  joinDate: string;
  feedbackCount: number;
  lastActive: string;
}

export const BetaFeedbackSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general' | 'rating'>('general');
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);

  const { trackFeedback } = useAnalytics();

  useEffect(() => {
    loadFeedbackHistory();
  }, []);

  const loadFeedbackHistory = () => {
    const stored = localStorage.getItem('equilibrium-feedback-history');
    if (stored) {
      setFeedbackHistory(JSON.parse(stored));
    }
  };

  const saveFeedback = (feedback: FeedbackItem) => {
    const updated = [...feedbackHistory, feedback];
    setFeedbackHistory(updated);
    localStorage.setItem('equilibrium-feedback-history', JSON.stringify(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const feedback: FeedbackItem = {
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: feedbackType,
        rating: feedbackType === 'rating' ? rating : undefined,
        title: title || getFeedbackTypeLabel(feedbackType),
        description,
        screenshot,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        status: 'pending',
        priority: determinePriority(feedbackType, rating)
      };

      // Save locally
      saveFeedback(feedback);

      // Track analytics
      trackFeedback(rating || 5, description, feedbackType);

      // Simulate API call (in real implementation, would send to backend)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitted(true);
      resetForm();
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setRating(0);
    setScreenshot('');
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
    }, 2000);
  };

  const getFeedbackTypeLabel = (type: string) => {
    switch (type) {
      case 'bug': return 'Relatório de Bug';
      case 'feature': return 'Sugestão de Funcionalidade';
      case 'rating': return 'Avaliação Geral';
      default: return 'Feedback Geral';
    }
  };

  const determinePriority = (type: string, rating?: number): 'low' | 'medium' | 'high' => {
    if (type === 'bug') return 'high';
    if (type === 'rating' && rating && rating < 3) return 'high';
    if (type === 'feature') return 'medium';
    return 'low';
  };

  const takeScreenshot = async () => {
    try {
      // Use html2canvas ou similar para capturar screenshot
      // Por ora, vamos simular
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#374151';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Screenshot simulado', canvas.width / 2, canvas.height / 2);
        
        const dataUrl = canvas.toDataURL('image/png');
        setScreenshot(dataUrl);
      }
    } catch (error) {
      console.error('Erro ao capturar screenshot:', error);
    }
  };

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-5 h-5" />
          <div>
            <h4 className="font-semibold">Feedback Enviado!</h4>
            <p className="text-sm text-green-100">Obrigado por ajudar a melhorar o Equilibrium.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-50 group"
        title="Enviar Feedback"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute bottom-full right-0 bg-gray-800 text-white text-xs py-1 px-2 rounded mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Feedback Beta
        </span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Beta Feedback</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Feedback
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFeedbackType('bug')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        feedbackType === 'bug' 
                          ? 'border-red-300 bg-red-50 text-red-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Bug className="w-5 h-5 mb-1" />
                      <div className="font-medium">Bug Report</div>
                      <div className="text-xs text-gray-500">Relatar problema</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFeedbackType('feature')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        feedbackType === 'feature' 
                          ? 'border-blue-300 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Lightbulb className="w-5 h-5 mb-1" />
                      <div className="font-medium">Nova Funcionalidade</div>
                      <div className="text-xs text-gray-500">Sugerir melhoria</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFeedbackType('rating')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        feedbackType === 'rating' 
                          ? 'border-yellow-300 bg-yellow-50 text-yellow-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Star className="w-5 h-5 mb-1" />
                      <div className="font-medium">Avaliação</div>
                      <div className="text-xs text-gray-500">Avaliar experiência</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFeedbackType('general')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        feedbackType === 'general' 
                          ? 'border-green-300 bg-green-50 text-green-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5 mb-1" />
                      <div className="font-medium">Geral</div>
                      <div className="text-xs text-gray-500">Comentário livre</div>
                    </button>
                  </div>
                </div>

                {/* Rating (only for rating type) */}
                {feedbackType === 'rating' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Como você avalia sua experiência? *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 rounded transition-colors ${
                            rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        >
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {rating} de 5 estrelas
                      </p>
                    )}
                  </div>
                )}

                {/* Title */}
                {feedbackType !== 'rating' && (
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Título (opcional)
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Descreva brevemente ${feedbackType === 'bug' ? 'o problema' : 'a sugestão'}`}
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={
                      feedbackType === 'bug' 
                        ? 'Descreva o problema detalhadamente. Como reproduzir? O que esperava que acontecesse?'
                        : feedbackType === 'feature'
                        ? 'Descreva sua sugestão. Como isso melhoraria sua experiência?'
                        : feedbackType === 'rating'
                        ? 'Compartilhe sua experiência com o Equilibrium. O que mais gostou? O que pode melhorar?'
                        : 'Compartilhe seus pensamentos, sugestões ou comentários...'
                    }
                  />
                </div>

                {/* Screenshot */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Screenshot (opcional)
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={takeScreenshot}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                    >
                      📷 Capturar Tela
                    </button>
                    {screenshot && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <span>✓ Screenshot capturada</span>
                        <button
                          type="button"
                          onClick={() => setScreenshot('')}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !description.trim() || (feedbackType === 'rating' && rating === 0)}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Admin Panel for Beta Management
export const BetaManagementPanel: React.FC = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'type'>('date');

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    const stored = localStorage.getItem('equilibrium-feedback-history');
    if (stored) {
      setFeedbackItems(JSON.parse(stored));
    }
  };

  const filteredAndSortedFeedback = feedbackItems
    .filter(item => filter === 'all' || item.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800';
      case 'feature': return 'bg-blue-100 text-blue-800';
      case 'rating': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel de Feedback Beta</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="reviewed">Revisado</option>
            <option value="resolved">Resolvido</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="date">Data</option>
            <option value="priority">Prioridade</option>
            <option value="type">Tipo</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          {filteredAndSortedFeedback.length} itens de feedback
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredAndSortedFeedback.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(item.priority)}`} />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                  {getFeedbackTypeLabel(item.type)}
                </span>
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{item.rating}/5</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(item.timestamp).toLocaleString('pt-BR')}
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-700 mb-4">{item.description}</p>

            {item.screenshot && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Screenshot anexada:</p>
                <img
                  src={item.screenshot}
                  alt="Screenshot do feedback"
                  className="max-w-sm rounded border"
                />
              </div>
            )}

            <div className="text-xs text-gray-500">
              User Agent: {item.userAgent}
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedFeedback.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum feedback encontrado com os filtros selecionados.
        </div>
      )}
    </div>
  );

  function getFeedbackTypeLabel(type: string) {
    switch (type) {
      case 'bug': return 'Bug Report';
      case 'feature': return 'Feature';
      case 'rating': return 'Rating';
      default: return 'Geral';
    }
  }
};

export default BetaFeedbackSystem;