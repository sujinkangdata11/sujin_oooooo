
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { AudioPlayer } from './components/AudioPlayer';
import { Slider } from './components/Slider';
import { Spinner } from './components/Spinner';
import { DownloadIcon, MusicNoteIcon } from './components/icons';
import { processAudio } from './services/audioProcessor';
import type { AudioProcessingResult } from './types';

function App(): React.ReactNode {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [silenceThreshold, setSilenceThreshold] = useState<number>(-50);
  const [audioResult, setAudioResult] = useState<AudioProcessingResult | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    setAudioFile(file);
    setProcessingState('idle');
    setAudioResult(null);
    setErrorMessage('');
  }, []);

  const handleProcessClick = async () => {
    if (!audioFile) return;

    setProcessingState('processing');
    setErrorMessage('');
    setAudioResult(null);

    try {
      const result = await processAudio(audioFile, silenceThreshold);
      setAudioResult(result);
      setProcessingState('done');
    } catch (error) {
      console.error("Audio processing failed:", error);
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      setProcessingState('error');
    }
  };
  
  const resetState = () => {
    setAudioFile(null);
    setProcessingState('idle');
    setAudioResult(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            오디오 무음 구간 제거기
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            오디오 파일에서 자동으로 무음 구간을 잘라내어 깔끔하게 만듭니다.
          </p>
        </header>

        <main className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8 border border-slate-700">
          {!audioFile ? (
            <FileUpload onFileChange={handleFileChange} />
          ) : (
            <div>
              <div className="flex justify-between items-center bg-slate-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <MusicNoteIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                    <span className="font-medium truncate" title={audioFile.name}>{audioFile.name}</span>
                    <span className="text-slate-400 text-sm flex-shrink-0">({(audioFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button 
                  onClick={resetState}
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200"
                >
                  파일 변경
                </button>
              </div>

              <div className="mb-6">
                <Slider
                  label="무음 감지 레벨 (dB)"
                  min={-100}
                  max={0}
                  step={1}
                  value={silenceThreshold}
                  onChange={(e) => setSilenceThreshold(Number(e.target.value))}
                  disabled={processingState === 'processing'}
                />
                <p className="text-sm text-slate-400 mt-2">
                  값을 높이면(0에 가깝게) 더 많은 구간이 무음으로 처리됩니다. 배경 소음이 있다면 값을 높여보세요.
                </p>
              </div>

              <button
                onClick={handleProcessClick}
                disabled={processingState === 'processing'}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
              >
                {processingState === 'processing' ? <Spinner /> : '처리 시작'}
              </button>
            </div>
          )}

          {processingState === 'processing' && (
            <div className="text-center mt-6 text-sky-300">
              <p>오디오를 분석하고 있습니다. 파일 크기에 따라 시간이 걸릴 수 있습니다...</p>
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
              {errorMessage}
            </div>
          )}

          {processingState === 'done' && audioResult && (
            <div className="mt-8 space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AudioPlayer title="원본 오디오" src={audioResult.originalUrl} />
                <AudioPlayer title="처리된 오디오" src={audioResult.processedUrl} />
              </div>
              <a
                href={audioResult.processedUrl}
                download={`processed_${audioFile?.name?.replace(/\.[^/.]+$/, "") ?? ""}.wav`}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg space-x-2"
              >
                <DownloadIcon className="w-6 h-6" />
                <span>처리된 파일 다운로드 (.wav)</span>
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;