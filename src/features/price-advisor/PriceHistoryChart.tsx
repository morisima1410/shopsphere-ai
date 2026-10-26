// ==============================================================================
// ShopSphere AI — Price History Chart & Timeline Component
// Visualizes price snapshots recorded strictly since tracking began.
// Never fabricates historical data. Clearly displays when history is limited.
// Theme: Emerald Green (#059669) + White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { PriceSnapshot } from '@/types/priceAdvisor';
import { formatCurrency } from '@/lib/utils';
import { getPriceStatistics } from '@/services/priceAdvisorService';

interface PriceHistoryChartProps {
  productTitle: string;
  snapshots: PriceSnapshot[];
  trackedAt: number;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  productTitle,
  snapshots,
  trackedAt,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const stats = getPriceStatistics(snapshots);
  const trackedDateStr = new Date(trackedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (!stats || snapshots.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
        <AlertCircle className="mx-auto h-6 w-6 text-gray-400 mb-2" />
        <p className="text-sm font-semibold text-gray-700">No price records available</p>
        <p className="text-xs text-gray-500 mt-1">
          Tracking began on {trackedDateStr}.
        </p>
      </div>
    );
  }

  // When only 1 snapshot exists (just enabled tracking):
  if (snapshots.length < 2) {
    const singleSnapshot = snapshots[0];
    const singleDate = new Date(singleSnapshot.timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Tracking Active
            </span>
          </div>
          <span className="text-xs font-medium text-emerald-700">1 Snapshot Recorded</span>
        </div>

        <div className="rounded-xl border border-emerald-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Initial Tracked Price
              </p>
              <p className="text-2xl font-black text-[#1F2937]">
                {formatCurrency(singleSnapshot.price)}
              </p>
            </div>
            <span className="text-xs text-gray-500">{singleDate}</span>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-600 border border-gray-100">
            <AlertCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-gray-800">Historical data not yet available.</strong> Price monitoring was initiated on {trackedDateStr}. Price snapshots will plot on this timeline automatically as subsequent price updates occur.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Multiple snapshots exist — generate SVG coordinate plot
  const validPrices = snapshots.map((s) => s.price);
  const minPrice = stats.lowest;
  const maxPrice = stats.highest;
  const priceRange = maxPrice === minPrice ? 1 : maxPrice - minPrice;

  // Chart dimensions
  const svgWidth = 500;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 25;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  // Map snapshots to points
  const points = snapshots.map((s, index) => {
    const x = paddingX + (index / (snapshots.length - 1)) * plotWidth;
    // Lower price = higher y in SVG (inverted)
    const normalizedPrice = (s.price - minPrice) / priceRange;
    const y = svgHeight - paddingY - normalizedPrice * plotHeight;
    return { x, y, snapshot: s, index };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Fill area under the curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4 shadow-sm">
      {/* Header with Title & Stats Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Recorded Price Snapshots</span>
          </div>
          <h4 className="text-sm font-bold text-[#1F2937] truncate max-w-sm mt-0.5">
            {productTitle}
          </h4>
        </div>

        {/* Min / Max / Current Quick Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800 border border-emerald-200/60 font-semibold">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Lowest:</span>
            <span>{formatCurrency(stats.lowest)}</span>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-gray-700 border border-gray-200 font-semibold">
            <span className="text-[10px] uppercase font-bold text-gray-500">Highest:</span>
            <span>{formatCurrency(stats.highest)}</span>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-white font-bold shadow-xs">
            <span className="text-[10px] uppercase font-medium text-emerald-100">Current:</span>
            <span>{formatCurrency(stats.current)}</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Visualization */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-44 overflow-visible"
          aria-label={`Price trend chart for ${productTitle}`}
        >
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={svgWidth - paddingX}
            y2={paddingY}
            stroke="#E5E7EB"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={svgHeight - paddingY}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingY}
            stroke="#E5E7EB"
            strokeDasharray="3 3"
          />

          {/* Price Labels on Y Axis */}
          <text
            x={paddingX - 8}
            y={paddingY + 4}
            textAnchor="end"
            fontSize="10"
            fill="#6B7280"
            fontWeight="600"
          >
            {formatCurrency(maxPrice)}
          </text>
          <text
            x={paddingX - 8}
            y={svgHeight - paddingY + 4}
            textAnchor="end"
            fontSize="10"
            fill="#6B7280"
            fontWeight="600"
          >
            {formatCurrency(minPrice)}
          </text>

          {/* Shaded Area under Curve */}
          <path d={areaD} fill="url(#emeraldGradient)" />

          {/* Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p) => {
            const isHovered = hoveredIndex === p.index;
            const isLowest = p.snapshot.price === minPrice;
            const isLatest = p.index === points.length - 1;

            return (
              <g
                key={p.index}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(p.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                tabIndex={0}
                role="button"
                aria-label={`Snapshot ${p.index + 1}: ${formatCurrency(p.snapshot.price)} on ${new Date(p.snapshot.timestamp).toLocaleDateString()}`}
              >
                {/* Target touch zone */}
                <circle cx={p.x} cy={p.y} r="12" fill="transparent" />

                {/* Point ring */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : isLatest || isLowest ? 4.5 : 3.5}
                  fill={isHovered ? '#047857' : isLowest ? '#059669' : '#1F2937'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all"
                />
              </g>
            );
          })}
        </svg>

        {/* Hovered Tooltip Card */}
        {hoveredPoint && (
          <div
            className="absolute z-10 pointer-events-none rounded-lg bg-gray-900/95 text-white px-3 py-2 text-xs shadow-lg transform -translate-x-1/2 -translate-y-full transition-all"
            style={{
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100 - 8}%`,
            }}
          >
            <p className="font-bold text-emerald-400">
              {formatCurrency(hoveredPoint.snapshot.price)}
            </p>
            <p className="text-[10px] text-gray-300">
              {new Date(hoveredPoint.snapshot.timestamp).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {hoveredPoint.snapshot.reason && (
              <p className="text-[10px] text-gray-400 italic mt-0.5">
                {hoveredPoint.snapshot.reason}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Snapshot History Log List */}
      <div className="pt-2">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Snapshot Timeline ({snapshots.length} recorded)
        </p>
        <div className="max-h-36 overflow-y-auto space-y-1.5 divide-y divide-gray-100 pr-1">
          {snapshots.map((s, idx) => {
            const isCurrent = idx === snapshots.length - 1;
            const prev = idx > 0 ? snapshots[idx - 1] : undefined;
            const priceDropped = prev ? s.price < prev.price : false;
            const priceIncreased = prev ? s.price > prev.price : false;

            return (
              <div
                key={idx}
                className="pt-1.5 flex items-center justify-between text-xs text-gray-600 hover:bg-gray-50 px-2 py-1 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-gray-400 w-4">#{idx + 1}</span>
                  <span className="text-gray-500">
                    {new Date(s.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    {new Date(s.timestamp).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {s.reason && (
                    <span className="text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5 hidden sm:inline">
                      {s.reason}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-semibold">
                  {priceDropped && (
                    <span className="flex items-center text-emerald-600 text-[11px]">
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                      Drop
                    </span>
                  )}
                  {priceIncreased && (
                    <span className="flex items-center text-amber-600 text-[11px]">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      Rise
                    </span>
                  )}
                  <span
                    className={
                      isCurrent
                        ? 'font-bold text-[#1F2937]'
                        : 'text-gray-700'
                    }
                  >
                    {formatCurrency(s.price)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
