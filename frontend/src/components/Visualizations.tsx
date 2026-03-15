// ===== File: frontend/src/components/Visualizations.tsx =====
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ForceGraph2D from 'react-force-graph-2d';

const COLORS =['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];

export function DynamicChart({ code }: { code: string }) {
  try {
    const config = JSON.parse(code);
    const data = config.data ||[];

    return (
      <div className="my-8 p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
        <h4 className="text-center font-bold text-gray-800 dark:text-gray-200 mb-6">{config.title || "Data Visualization"}</h4>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            {config.type === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : config.type === 'pie' ? (
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {data.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
              </PieChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  } catch (e) {
    return (
      <div className="my-6 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl flex items-center gap-3 animate-pulse">
        <div className="w-4 h-4 rounded-full bg-indigo-400"></div>
        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Synthesizing Chart Data...</span>
      </div>
    );
  }
}

export function DynamicGraph({ code }: { code: string }) {
  try {
    const data = JSON.parse(code);
    return (
      <div className="my-8 overflow-hidden bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm relative h-[400px]">
        <div className="absolute top-4 left-4 z-10 text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/80 dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">
          Entity Knowledge Graph
        </div>
        <div className="absolute top-4 right-4 z-10 text-[10px] text-gray-400">
          Scroll to zoom • Drag to pan
        </div>
        <ForceGraph2D
          graphData={data}
          width={800} // Increased bounds for complex graphs
          height={400}
          backgroundColor="transparent"
          // Custom node rendering for a clean, minimal, professional look
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.id || '';
            const fontSize = 11 / globalScale;
            
            // Draw Node Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#6366f1'; // Indigo primary
            ctx.fill();

            // Draw Node Text Label
            ctx.font = `500 ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            // Determine text color (adaptive gray based on perceived environment)
            ctx.fillStyle = '#6b7280'; // Clean slate gray
            ctx.fillText(label, node.x, node.y + 6); // Offset label below the node
          }}
          // Link aesthetics
          linkColor={() => 'rgba(156, 163, 175, 0.3)'} // Subtle transparent gray links
          linkWidth={1.5}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkDirectionalArrowColor={() => '#9ca3af'}
          // Physics tuning for better spacing
          d3VelocityDecay={0.3}
        />
      </div>
    );
  } catch (e) {
    return (
      <div className="my-6 p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-xl flex items-center gap-3 animate-pulse">
        <div className="w-4 h-4 rounded-full bg-purple-400"></div>
        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Mapping Knowledge Graph Entities...</span>
      </div>
    );
  }
}