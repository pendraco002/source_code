import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  Star, 
  Zap, 
  Shield,
  X,
  ArrowLeft,
  Share,
  Info
} from 'lucide-react';
import { Card, CardRarity, CardType } from '../../core/domain/card.model';
import { initialCards } from '../../core/data/card-data';

interface CardCollectionProps {
  onBack: () => void;
  onCardSelect?: (card: Card) => void;
}

interface CardDetailModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite: (cardId: string) => void;
  onShare: (card: Card) => void;
  isFavorited: boolean;
}

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | CardType;
type SortType = 'name' | 'rarity' | 'type' | 'favorites';

const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  onFavorite,
  onShare,
  isFavorited
}) => {
  if (!card) return null;

  const getRarityColor = (rarity: CardRarity): string => {
    switch (rarity) {
      case CardRarity.COMMON: return 'from-gray-400 to-gray-600';
      case CardRarity.UNCOMMON: return 'from-green-400 to-green-600';
      case CardRarity.RARE: return 'from-blue-400 to-blue-600';
      case CardRarity.EPIC: return 'from-purple-400 to-purple-600';
      case CardRarity.LEGENDARY: return 'from-yellow-400 to-orange-600';
    }
  };

  const getTypeIcon = (type: CardType) => {
    switch (type) {
      case CardType.ACTION: return <Zap className="w-5 h-5" />;
      case CardType.EVENT: return <Star className="w-5 h-5" />;
      case CardType.ORGAN: return <Shield className="w-5 h-5" />;
      case CardType.HORMONE: return <Heart className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 pb-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Card image placeholder */}
              <div className={`w-32 h-40 mx-auto mb-6 bg-gradient-to-br ${getRarityColor(card.rarity)} rounded-xl flex items-center justify-center shadow-2xl`}>
                <div className="text-white text-4xl">
                  {getTypeIcon(card.type)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Title and rarity */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{card.name}</h2>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(card.rarity)}`}>
                    {card.rarity}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-gray-300 bg-gray-700">
                    {card.type}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Descrição</h3>
                <p className="text-gray-300 leading-relaxed">{card.description}</p>
              </div>

              {/* Educational note */}
              {card.educationalNote && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">💡 Conhecimento</h3>
                  <p className="text-gray-300 leading-relaxed">{card.educationalNote}</p>
                </div>
              )}

              {/* Effects */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Efeitos</h3>
                <div className="space-y-2">
                  {card.effects.map((effect, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">
                        {effect.targetSystem === 'glucose' && '🩸 Sistema Glicêmico'}
                        {effect.targetSystem === 'ph' && '⚗️ Sistema Ácido-Base'}
                        {effect.targetSystem === 'temperature' && '🌡️ Sistema Térmico'}
                      </span>
                      <span className={`font-bold ${effect.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {effect.value > 0 ? '+' : ''}{effect.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flavor text */}
              {card.flavorText && (
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border-l-4 border-purple-500">
                  <p className="text-gray-400 italic">{card.flavorText}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">{card.cost}</div>
                  <div className="text-sm text-gray-400">Custo de Energia</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white">{card.cooldown || 0}</div>
                  <div className="text-sm text-gray-400">Recarga (turnos)</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  onClick={() => onFavorite(card.id)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isFavorited 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
                  {isFavorited ? 'Favoritada' : 'Favoritar'}
                </motion.button>

                <motion.button
                  onClick={() => onShare(card)}
                  className="py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share size={16} />
                  Compartilhar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const CardCollection: React.FC<CardCollectionProps> = ({
  onBack,
  onCardSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    let filtered = initialCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || card.type === filterType;
      return matchesSearch && matchesFilter;
    });

    // Sort cards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { COMMON: 1, UNCOMMON: 2, RARE: 3, EPIC: 4, LEGENDARY: 5 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'type':
          return a.type.localeCompare(b.type);
        case 'favorites':
          return favorites.has(b.id) ? 1 : -1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, filterType, sortBy, favorites]);

  const getRarityColor = (rarity: CardRarity): string => {
    switch (rarity) {
      case CardRarity.COMMON: return 'from-gray-400 to-gray-600';
      case CardRarity.UNCOMMON: return 'from-green-400 to-green-600';
      case CardRarity.RARE: return 'from-blue-400 to-blue-600';
      case CardRarity.EPIC: return 'from-purple-400 to-purple-600';
      case CardRarity.LEGENDARY: return 'from-yellow-400 to-orange-600';
    }
  };

  const getTypeIcon = (type: CardType) => {
    switch (type) {
      case CardType.ACTION: return <Zap className="w-4 h-4" />;
      case CardType.EVENT: return <Star className="w-4 h-4" />;
      case CardType.ORGAN: return <Shield className="w-4 h-4" />;
      case CardType.HORMONE: return <Heart className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    if (onCardSelect) {
      onCardSelect(card);
    }
  };

  const handleFavorite = (cardId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(cardId)) {
      newFavorites.delete(cardId);
    } else {
      newFavorites.add(cardId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('equilibrium-favorites', JSON.stringify([...newFavorites]));
  };

  const handleShare = (card: Card) => {
    if (navigator.share) {
      navigator.share({
        title: `Carta: ${card.name}`,
        text: card.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`🃏 ${card.name}\n\n${card.description}\n\n🎮 Equilibrium - Jogo Educativo de Fisiologia`);
    }
  };

  // Load favorites on mount
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('equilibrium-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
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
              <h1 className="text-3xl font-bold text-white">Coleção de Cartas</h1>
              <p className="text-gray-400">{filteredAndSortedCards.length} cartas encontradas</p>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Filters and search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar cartas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Tipos</option>
            <option value={CardType.ACTION}>Ação</option>
            <option value={CardType.EVENT}>Evento</option>
            <option value={CardType.ORGAN}>Órgão</option>
            <option value={CardType.HORMONE}>Hormônio</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Nome</option>
            <option value="rarity">Raridade</option>
            <option value="type">Tipo</option>
            <option value="favorites">Favoritas</option>
          </select>

          {/* Stats */}
          <div className="flex items-center justify-center bg-white/5 rounded-lg px-4 py-3">
            <Heart className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-white">{favorites.size} favoritas</span>
          </div>
        </div>

        {/* Cards grid/list */}
        <motion.div
          layout
          className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          <AnimatePresence>
            {filteredAndSortedCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative cursor-pointer group
                  ${viewMode === 'grid' ? 'aspect-[3/4]' : 'aspect-[4/1]'}
                `}
                onClick={() => handleCardClick(card)}
              >
                <div className={`
                  h-full p-4 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300
                  bg-gradient-to-br ${getRarityColor(card.rarity)}
                  group-hover:shadow-xl group-hover:border-white/30
                  ${viewMode === 'list' ? 'flex items-center space-x-4' : 'flex flex-col'}
                `}>
                  {/* Favorite indicator */}
                  {favorites.has(card.id) && (
                    <div className="absolute top-2 right-2 text-red-400">
                      <Heart size={16} className="fill-current" />
                    </div>
                  )}

                  {/* Icon/Image area */}
                  <div className={`
                    ${viewMode === 'grid' ? 'flex-1 flex items-center justify-center mb-4' : 'w-16 h-16 flex items-center justify-center'}
                    text-white text-2xl
                  `}>
                    {getTypeIcon(card.type)}
                  </div>

                  {/* Content */}
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <h3 className="font-bold text-white text-lg mb-2 group-hover:text-yellow-200 transition-colors">
                      {card.name}
                    </h3>
                    
                    {viewMode === 'grid' ? (
                      <>
                        <p className="text-white/80 text-sm mb-3 line-clamp-3">
                          {card.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-white/60 uppercase tracking-wide">
                            {card.type}
                          </span>
                          <span className="text-xs text-white/60">
                            ⚡ {card.cost}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-white/80 text-sm flex-1 mr-4">
                          {card.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-white/60">
                          <span>{card.type}</span>
                          <span>⚡ {card.cost}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredAndSortedCards.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma carta encontrada</h3>
              <p>Tente ajustar seus filtros de busca</p>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Card detail modal */}
      <CardDetailModal
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onFavorite={handleFavorite}
        onShare={handleShare}
        isFavorited={selectedCard ? favorites.has(selectedCard.id) : false}
      />
    </div>
  );
};