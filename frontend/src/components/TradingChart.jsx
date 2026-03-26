import React, { useEffect, useRef } from 'react';
import * as LightweightCharts from 'lightweight-charts';

export const TradingChart = ({ symbol, timeframe, openTrades, livePrice }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const priceLinesRef = useRef(new Map());

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const handleResize = () => {
      if (chartRef.current && container) {
        chartRef.current.applyOptions({ width: container.clientWidth });
      }
    };

    const chart = LightweightCharts.createChart(container, {
      layout: {
        background: { type: LightweightCharts.ColorType.Solid, color: '#0a0a0a' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      width: container.clientWidth,
      height: container.clientHeight || 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addSeries(LightweightCharts.CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    seriesRef.current = candlestickSeries;

    // Mock data generation for demo
    const generateInitialData = () => {
      const data = [];
      const timeframeSeconds = {
        '5m': 5 * 60,
        '15m': 15 * 60,
        '1h': 60 * 60,
        '4h': 4 * 60 * 60,
        '1d': 24 * 60 * 60,
      }[timeframe] || 86400;

      let time = Math.floor(Date.now() / 1000) - 100 * timeframeSeconds;
      let lastClose = symbol === 'BTCUSD' ? 65000 : symbol === 'ETHUSD' ? 3500 : symbol === 'XAUUSD' ? 2300 : 100;
      
      for (let i = 0; i < 100; i++) {
        const open = lastClose;
        const close = open + (Math.random() - 0.5) * (open * 0.005);
        const high = Math.max(open, close) + Math.random() * (open * 0.002);
        const low = Math.min(open, close) - Math.random() * (open * 0.002);
        
        data.push({
          time: time,
          open,
          high,
          low,
          close,
        });
        
        time += timeframeSeconds;
        lastClose = close;
      }
      return data;
    };

    const initialData = generateInitialData();
    candlestickSeries.setData(initialData);

    // Real-time updates simulation
    let lastBar = initialData[initialData.length - 1];
    const interval = setInterval(() => {
      if (!seriesRef.current) return;

      const change = (Math.random() - 0.5) * (lastBar.close * 0.0005);
      const newClose = lastBar.close + change;
      
      const updatedBar = {
        ...lastBar,
        close: newClose,
        high: Math.max(lastBar.high, newClose),
        low: Math.min(lastBar.low, newClose),
      };

      seriesRef.current.update(updatedBar);
      lastBar = updatedBar;
    }, 1000);

    chartRef.current = chart;
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      chart.remove();
    };
  }, [symbol, timeframe]);

  // Update trade lines
  useEffect(() => {
    if (!seriesRef.current) return;

    const currentTrades = openTrades.filter(t => t.symbol === symbol);
    const tradeIds = new Set(currentTrades.map(t => t.id || t._id));

    // Remove lines for closed trades
    priceLinesRef.current.forEach((line, id) => {
      if (!tradeIds.has(id)) {
        seriesRef.current?.removePriceLine(line);
        priceLinesRef.current.delete(id);
      }
    });

    // Add or update lines for open trades
    currentTrades.forEach(trade => {
      const id = trade.id || trade._id;
      const existingLine = priceLinesRef.current.get(id);

      // Calculate current real-time PNL for the label
      const currentPnl = trade.type === 'buy' 
        ? (livePrice - trade.entryPrice) * trade.lots * 10 
        : (trade.entryPrice - livePrice) * trade.lots * 10;
        
      const pnlLabel = ` (${currentPnl >= 0 ? '+' : ''}${currentPnl.toFixed(2)})`;
      const label = `${trade.type.toUpperCase()} ${trade.lots} @ ${trade.entryPrice}${pnlLabel}`;

      if (existingLine) {
        seriesRef.current?.removePriceLine(existingLine);
      }

      const newLine = seriesRef.current.createPriceLine({
        price: trade.entryPrice,
        color: trade.type === 'buy' ? '#10b981' : '#ef4444',
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: label,
      });

      priceLinesRef.current.set(id, newLine);
    });
  }, [openTrades, symbol, livePrice]);

  return (
    <div className="w-full h-full bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 flex flex-col">
      <div ref={chartContainerRef} className="flex-grow w-full" />
    </div>
  );
};
