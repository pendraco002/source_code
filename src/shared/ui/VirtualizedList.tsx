import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useVirtualList } from '../hooks/usePerformance';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  keyExtractor?: (item: T, index: number) => string | number;
}

function VirtualizedListComponent<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  keyExtractor = (_, index) => index
}: VirtualizedListProps<T>) {
  const { visibleItems, totalHeight, offsetY, handleScroll } = useVirtualList(
    items,
    containerHeight,
    itemHeight,
    overscan
  );

  const memoizedItems = useMemo(() => 
    visibleItems.map(({ item, index }) => (
      <motion.div
        key={keyExtractor(item, index)}
        style={{
          position: 'absolute',
          top: index * itemHeight,
          height: itemHeight,
          width: '100%'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.02 }}
      >
        {renderItem(item, index)}
      </motion.div>
    )), 
    [visibleItems, itemHeight, renderItem, keyExtractor]
  );

  return (
    <div
      className={`relative overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {memoizedItems}
        </div>
      </div>
    </div>
  );
}

export const VirtualizedList = memo(VirtualizedListComponent) as typeof VirtualizedListComponent;

interface GridVirtualizedListProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  gap?: number;
}

function GridVirtualizedListComponent<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  renderItem,
  className = '',
  gap = 8
}: GridVirtualizedListProps<T>) {
  const columnsPerRow = Math.floor(containerWidth / (itemWidth + gap));
  const rowHeight = itemHeight + gap;
  
  const gridItems = useMemo(() => {
    const rows: T[][] = [];
    for (let i = 0; i < items.length; i += columnsPerRow) {
      rows.push(items.slice(i, i + columnsPerRow));
    }
    return rows;
  }, [items, columnsPerRow]);

  const { visibleItems: visibleRows, totalHeight, offsetY, handleScroll } = useVirtualList(
    gridItems,
    containerHeight,
    rowHeight
  );

  return (
    <div
      className={`relative overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleRows.map(({ item: row, index: rowIndex }) => (
            <div
              key={rowIndex}
              style={{
                position: 'absolute',
                top: rowIndex * rowHeight,
                height: itemHeight,
                width: '100%',
                display: 'flex',
                gap: gap
              }}
            >
              {row.map((item, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  style={{ width: itemWidth, height: itemHeight }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: (rowIndex * columnsPerRow + colIndex) * 0.02 
                  }}
                >
                  {renderItem(item, rowIndex * columnsPerRow + colIndex)}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const GridVirtualizedList = memo(GridVirtualizedListComponent) as typeof GridVirtualizedListComponent;

interface InfiniteScrollListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  className?: string;
  loadingComponent?: React.ReactNode;
}

export function InfiniteScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  hasNextPage,
  isLoading,
  onLoadMore,
  className = '',
  loadingComponent
}: InfiniteScrollListProps<T>) {
  const { visibleItems, totalHeight, offsetY, handleScroll } = useVirtualList(
    items,
    containerHeight,
    itemHeight
  );

  const handleScrollWithInfinite = (e: React.UIEvent<HTMLDivElement>) => {
    handleScroll(e);
    
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Carregar mais quando próximo do final (80% scrolled)
    if (scrollTop + clientHeight >= scrollHeight * 0.8 && hasNextPage && !isLoading) {
      onLoadMore();
    }
  };

  return (
    <div
      className={`relative overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScrollWithInfinite}
    >
      <div style={{ height: totalHeight + (hasNextPage ? 100 : 0), position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <motion.div
              key={index}
              style={{
                position: 'absolute',
                top: index * itemHeight,
                height: itemHeight,
                width: '100%'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.01 }}
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div 
            style={{ 
              position: 'absolute', 
              top: totalHeight,
              width: '100%',
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {loadingComponent || (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600" />
                <span>Carregando...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualizedList;