import React, { useState, useRef } from 'react';
import { Upload, Music, AlertCircle, X } from 'lucide-react';

interface AudioUploaderProps {
  onAudioSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

const SUPPORTED_EXTS = ['.wav', '.mp3', '.ogg', '.webm', '.flac', '.m4a', '.aac'];
const MAX_SIZE_MB = 25;

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onAudioSelected,
  selectedFile,
  onClear,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_EXTS.includes(ext) && !file.type.startsWith('audio/')) {
      setError(`Unsupported format. Please select: ${SUPPORTED_EXTS.join(', ')}`);
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_SIZE_MB}MB limit.`);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onAudioSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*,.wav,.mp3,.ogg,.webm,.flac,.m4a"
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {!selectedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-crimson)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '36px 20px',
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: isDragging ? 'rgba(74, 16, 27, 0.25)' : 'var(--color-rich-black)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 12px',
            background: 'var(--color-charcoal)',
            border: '1px solid var(--color-border)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-white)',
          }}>
            <Upload size={22} />
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
            Choose an audio file or drag & drop here
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--color-muted-grey)' }}>
            Supports WAV, MP3, OGG, WebM, FLAC, M4A up to 25MB
          </p>
        </div>
      ) : (
        <div style={{
          background: 'var(--color-rich-black)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                background: 'var(--accent-burgundy)',
                border: '1px solid var(--accent-wine)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}>
                <Music size={18} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{selectedFile.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-muted-grey)' }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'audio file'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClear}
              className="btn btn-secondary btn-sm"
              disabled={disabled}
              title="Remove file"
            >
              <X size={14} /> Remove
            </button>
          </div>

          {previewUrl && (
            <div className="audio-player-container">
              <audio controls src={previewUrl} />
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-crimson)', fontSize: '13px', marginTop: '10px' }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
