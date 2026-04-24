// src/pages/Dashboard.jsx
import StatBar from '../components/StatsBar.jsx';
import AlertFeed from '../components/AlertFeed.jsx';
import EventTimeline from '../components/EventTimeline.jsx';
import ReroutePanel from '../components/ReroutePanel.jsx';

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col bg-zinc-900 overflow-hidden">

      {/* Top nav */}
      <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-zinc-300">
            Supply chain monitor
          </h1>
          <p className="text-xs text-gray-400">
            Real-time disruption detection and rerouting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </header>

      {/* Stat bar */}
      <StatBar />

      {/* Three panel layout */}
      <div className="flex-1 grid grid-cols-3 gap-0 overflow-hidden">

        {/* Left — alert feed */}
        <div className="border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <AlertFeed />
        </div>

        {/* Middle — event timeline */}
        <div className="border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <EventTimeline />
        </div>

        {/* Right — reroute panel */}
        <div className="bg-white overflow-hidden flex flex-col">
          <ReroutePanel />
        </div>

      </div>
    </div>
  );
}