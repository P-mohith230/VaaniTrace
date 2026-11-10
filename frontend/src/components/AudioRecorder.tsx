import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Check, AlertCircle } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  disabled?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopTracks();
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setRecordedBlob(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/wav',
      ];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const recorder = new MediaRecorder(stream, selectedMime ? { mimeType: selectedMime } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setRecordedBlob(finalBlob);
        const url = URL.createObjectURL(finalBlob);
        setPreviewUrl(url);
        stopTracks();
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error starting audio recording:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission was denied. Please allow microphone access in browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone hardware detected.');
      } else {
        setError(`Unable to record audio: ${err.message || 'Unknown error'}`);
      }
      stopTracks();
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUseRecording = () => {
    if (!recordedBlob) return;
    const file = new File([recordedBlob], `mic_record_${Date.now()}.webm`, {
      type: recordedBlob.type || 'audio/webm',
    });
    onRecordingComplete(file);
  };

  const handleDiscard = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setRecordedBlob(null);
    setRecordSeconds(0);
    setError(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: 'var(--color-rich-black)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      textAlign: 'center',
      marginBottom: '16px',
    }}>
      {!isRecording && !recordedBlob && (
        <div>
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            className="btn btn-primary"
            style={{ padding: '13px 26px', fontSize: '15px' }}
          >
            <Mic size={18} /> Record from Microphone
          </button>
          <p style={{ fontSize: '12px', color: 'var(--color-muted-grey)', marginTop: '10px' }}>
            Click to capture live multilingual speech via browser audio
          </p>
        </div>
      )}

      {isRecording && (
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(74, 16, 27, 0.4)',
            border: '1px solid var(--accent-wine)',
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            marginBottom: '18px',
          }}>
            <div
              className="recording-pulse"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'var(--accent-crimson)',
              }}
            />
            <span>Recording Live: {formatTime(recordSeconds)}</span>
          </div>

          <div>
            <button
              type="button"
              onClick={stopRecording}
              className="btn btn-burgundy-outline"
              style={{ padding: '10px 22px' }}
            >
              <Square size={16} /> Stop Recording
            </button>
          </div>
        </div>
      )}

      {recordedBlob && previewUrl && !isRecording && (
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: '#fff' }}>
            Recording Ready ({formatTime(recordSeconds)})
          </h4>
          <div className="audio-player-container" style={{ maxWidth: '420px', margin: '0 auto 16px' }}>
            <audio controls src={previewUrl} />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleUseRecording}
              className="btn btn-primary"
              disabled={disabled}
            >
              <Check size={16} /> Use This Recording
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="btn btn-secondary"
              disabled={disabled}
            >
              <Trash2 size={16} /> Discard
            </button>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'var(--accent-crimson)',
          fontSize: '13px',
          marginTop: '14px',
        }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
