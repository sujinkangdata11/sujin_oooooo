
import React from 'react';

interface AudioPlayerProps {
  title: string;
  src: string;
}

export function AudioPlayer({ title, src }: AudioPlayerProps): React.ReactNode {
  return (
    <div className="bg-slate-700/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-slate-300 mb-3">{title}</h3>
      <audio controls src={src} className="w-full"></audio>
    </div>
  );
}
