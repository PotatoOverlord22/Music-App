import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Upload, FileAudio, X } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

interface AudioUploaderProps {
  onFileUpload: (file: File) => void;
  currentFile: File | null;
}

function AudioUploader({ onFileUpload, currentFile }: AudioUploaderProps) {
  const theme = useTheme();
  
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'],
    },
    maxFiles: 1,
  });

  const handleRemoveFile = () => {
    onFileUpload(null as unknown as File);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {!currentFile ? (
        <Paper
          {...getRootProps()}
          sx={{
            p: 4,
            borderRadius: 2,
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: isDragActive
              ? theme.palette.primary.main
              : theme.palette.divider,
            bgcolor: isDragActive
              ? alpha(theme.palette.primary.main, 0.05)
              : 'background.default',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: theme.palette.primary.light,
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <input {...getInputProps()} />
          <Upload
            size={40}
            color={
              isDragActive
                ? theme.palette.primary.main
                : theme.palette.text.secondary
            }
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {isDragActive
              ? 'Drop your audio file here'
              : 'Drag & drop an audio file here'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Or click to browse
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
            Supports MP3, WAV, OGG, FLAC, AAC, M4A
          </Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <FileAudio
            size={24}
            color={theme.palette.primary.main}
            style={{ flexShrink: 0 }}
          />
          <Box sx={{ ml: 2, flexGrow: 1, overflow: 'hidden' }}>
            <Typography variant="body1" noWrap>
              {currentFile.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatFileSize(currentFile.size)}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleRemoveFile}
            sx={{ ml: 1, flexShrink: 0 }}
          >
            <X size={18} />
          </IconButton>
        </Paper>
      )}
    </Box>
  );
}

// Utility function to format file size
function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility function to create alpha colors
function alpha(color: string, opacity: number) {
  // Simple alpha function for demo purposes
  // In a real app, you might want to use a more robust solution
  return color + Math.round(opacity * 255).toString(16).padStart(2, '0');
}

export default AudioUploader;