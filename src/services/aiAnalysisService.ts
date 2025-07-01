
interface AnalysisConfig {
  pythonBackendUrl: string;
  model: 'yolov8n' | 'yolov8s' | 'yolov8m' | 'yolov5s';
  confidenceThreshold: number;
  maxDetections: number;
  gpuAcceleration: boolean;
}

interface PythonBackendResponse {
  success: boolean;
  data: {
    sperm_count: number;
    speed_avg: number;
    motility_percent: number;
    processing_time: number;
    detections: Array<{
      frame_number: number;
      bounding_boxes: Array<{
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        confidence: number;
        speed: number;
        trajectory: Array<{x: number; y: number}>;
      }>;
    }>;
    annotated_video_url?: string;
  };
  error?: string;
}

export class AIAnalysisService {
  private config: AnalysisConfig;

  constructor(config: AnalysisConfig) {
    this.config = config;
  }

  async analyzeVideo(file: File, onProgress?: (progress: number) => void): Promise<PythonBackendResponse> {
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('model', this.config.model);
      formData.append('confidence_threshold', this.config.confidenceThreshold.toString());
      formData.append('max_detections', this.config.maxDetections.toString());
      formData.append('gpu_acceleration', this.config.gpuAcceleration.toString());

      const response = await fetch(`${this.config.pythonBackendUrl}/api/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // إذا كانت الاستجابة عبارة عن stream للتقدم المباشر
      if (response.headers.get('content-type')?.includes('text/event-stream')) {
        return this.handleStreamResponse(response, onProgress);
      }

      const result: PythonBackendResponse = await response.json();
      return result;

    } catch (error) {
      console.error('Error in AI analysis:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: {
          sperm_count: 0,
          speed_avg: 0,
          motility_percent: 0,
          processing_time: 0,
          detections: []
        }
      };
    }
  }

  private async handleStreamResponse(
    response: Response, 
    onProgress?: (progress: number) => void
  ): Promise<PythonBackendResponse> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    let result: PythonBackendResponse | null = null;
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'progress' && onProgress) {
                onProgress(data.progress);
              } else if (data.type === 'result') {
                result = data;
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (!result) {
      throw new Error('No result received from stream');
    }

    return result;
  }

  async analyzeImage(file: File): Promise<PythonBackendResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('model', this.config.model);
      formData.append('confidence_threshold', this.config.confidenceThreshold.toString());

      const response = await fetch(`${this.config.pythonBackendUrl}/api/analyze-image`, {
        method: 'POST',
        body: formData,
      });

      const result: PythonBackendResponse = await response.json();
      return result;

    } catch (error) {
      console.error('Error in image analysis:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: {
          sperm_count: 0,
          speed_avg: 0,
          motility_percent: 0,
          processing_time: 0,
          detections: []
        }
      };
    }
  }

  updateConfig(newConfig: Partial<AnalysisConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// إعدادات افتراضية للتطبيق
export const defaultAnalysisConfig: AnalysisConfig = {
  pythonBackendUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000' 
    : 'https://your-railway-app.railway.app',
  model: 'yolov8n',
  confidenceThreshold: 0.5,
  maxDetections: 200,
  gpuAcceleration: true
};

export const aiAnalysisService = new AIAnalysisService(defaultAnalysisConfig);
