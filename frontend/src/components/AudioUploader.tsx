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

    // Clean up previous preview object URL
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
            border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '32px 20px',
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: isDragging ? 'rgba(2, 132, 199, 0.08)' : 'rgba(15, 23, 42, 0.6)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 12px',
            background: 'rgba(2, 132, 199, 0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)',
          }}>
            <Upload size={24} />
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
            Choose an audio file or drag & drop here
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Supports WAV, MP3, OGG, WebM, FLAC, M4A up to 25MB
          </p>
        </div>
      ) : (
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'rgba(16, 185, 129, 0.15)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-success)',
              }}>
                <Music size={18} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{selectedFile.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
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
            <audio controls src={previewUrl} style={{ width: '100%', height: '36px' }} />
          )}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-danger)', fontSize: '13px', marginTop: '8px' }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
