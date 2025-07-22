import { Video } from 'lucide-react';
import React from 'react';

interface ApplicationVideoProps {
  application: any;
}

const ApplicationVideo: React.FC<ApplicationVideoProps> = ({ application }) => {
  const videoUrl = application?.videoUrl;
  const videoFileName = application?.videoFileName;

  if (!videoUrl) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No se ha subido ningún video de presentación para este proyecto.
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Video de Presentación</h2>
            </div>
        </div>

        <div className="w-full flex flex-col items-center gap-4">
            <video
                src={videoUrl}
                controls
                className="w-full max-w-2xl rounded-lg border shadow"
                poster={undefined}
            >
                Tu navegador no soporta la reproducción de video.
            </video>
            {videoFileName && (
            <div className="text-xs text-muted-foreground mt-2">Archivo: {videoFileName}</div>
            )}
        </div>

    </div>
    
  );
};

export default ApplicationVideo;
