// ===== File: frontend/src/components/Visualizations.tsx (Extract) =====
import { useEffect, useRef, useState, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ForceGraph2D from 'react-force-graph-2d';

// ... (Keep DynamicChart as is)

export function DynamicGraph({ code }: { code: string }) {
  const fgRef = useRef<any>();
  const [graphData, setGraphData] = useState<any>({ nodes: [], links:[] });

  useEffect(() => {
    try {
      const data = JSON.parse(code);
      // Give nodes dynamic values based on connections if not provided
      const linkCounts: Record<string, number> = {};
      data.links.forEach((l: any) => {
        linkCounts[l.source] = (linkCounts[l.source] || 0) + 1;
        linkCounts[l.target] = (linkCounts[l.target] || 0) + 1;
      });
      data.nodes = data.nodes.map((n: any) => ({
        ...n,
        val: linkCounts[n.id] || 1, // Size based on connections
        color: n.group === 1 ? '#ec4899' : n.group === 2 ? '#14b8a6' : '#6366f1'
      }));
      setGraphData(data);
    } catch (e) {
      console.error("Graph parsing failed", e);
    }
  }, [code]);

  // Center the graph on load
  const handleEngineStop = useCallback(() => {
    if (fgRef.current) fgRef.current.zoomToFit(400, 50);
  },[]);

  if (!graphData.nodes.length) {
    return (
      <div className="my-6 p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-xl flex items-center gap-3 animate-pulse">
        <div className="w-4 h-4 rounded-full bg-purple-400"></div>
        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Mapping Knowledge Graph Entities...</span>
      </div>
    );
  }

  return (
    <div className="my-8 overflow-hidden bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm relative h-[450px]">
      <div className="absolute top-4 left-4 z-10 text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/80 dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">
        Entity Knowledge Graph
      </div>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={800}
        height={450}
        nodeLabel={() => ''} // Disable default tooltip
        nodeRelSize={6}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkWidth={1.5}
        linkColor={() => 'rgba(156, 163, 175, 0.4)'} // gray-400 with opacity
        backgroundColor="transparent"
        onEngineStop={handleEngineStop}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
          
          const radius = Math.max(4, Math.sqrt(node.val || 1) * 3);

          // Draw Node Glow
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color || '#6366f1';
          ctx.shadowColor = node.color || '#6366f1';
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0; // Reset

          // Draw Node Label Background Pill
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions =[textWidth, fontSize].map(n => n + fontSize * 0.4);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; // Light pill
          ctx.beginPath();
          // Use standard rect for wider compatibility, or roundRect if modern
          if (ctx.roundRect) {
            ctx.roundRect(node.x - bckgDimensions[0] / 2, node.y + radius + 4, bckgDimensions[0], bckgDimensions[1], 4 / globalScale);
          } else {
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + radius + 4, bckgDimensions[0], bckgDimensions[1]);
          }
          ctx.fill();

          // Draw Node Text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#1e293b'; // slate-800
          ctx.fillText(label, node.x, node.y + radius + 4 + bckgDimensions[1] / 2);
        }}
        // Custom link text drawing
        linkCanvasObjectMode={() => 'after'}
        linkCanvasObject={(link: any, ctx, globalScale) => {
          if (!link.label) return;
          const MAX_FONT_SIZE = 4;
          const LABEL_NODE_MARGIN = 15;
          const start = link.source;
          const end = link.target;
          // ignore unbound links
          if (typeof start !== 'object' || typeof end !== 'object') return;

          const textPos = Object.assign(...['x', 'y'].map(c => ({
            [c]: start[c] + (end[c] - start[c]) / 2 
          })));
          
          const fontSize = 10 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = 'rgba(107, 114, 128, 0.8)'; // gray-500
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(link.label, textPos.x, textPos.y);
        }}
      />
    </div>
  );
}