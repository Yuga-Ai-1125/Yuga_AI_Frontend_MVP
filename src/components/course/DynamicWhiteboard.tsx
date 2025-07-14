import React, { useState, useEffect, useRef } from 'react';
import { Download, Trash2, Edit3, Type, Circle, Square, Minus, Save, RefreshCw, FileText } from 'lucide-react';

interface DynamicWhiteboardProps {
  content: string[];
  lessonTitle: string;
  currentSegment: string;
  isActive: boolean;
}

const DynamicWhiteboard: React.FC<DynamicWhiteboardProps> = ({
  content,
  lessonTitle,
  currentSegment,
  isActive
}) => {
  const [notes, setNotes] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'pen' | 'text' | 'shape'>('pen');
  const [currentColor, setCurrentColor] = useState('#2563eb');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawings, setDrawings] = useState<any[]>([]);
  const [animationIndex, setAnimationIndex] = useState(0);

  useEffect(() => {
    if (content && content.length > 0) {
      setNotes(content);
      setAnimationIndex(0);
      
      // Animate points appearing one by one
      if (isActive) {
        content.forEach((_, index) => {
          setTimeout(() => {
            setAnimationIndex(index + 1);
          }, index * 500);
        });
      } else {
        setAnimationIndex(content.length);
      }
    }
  }, [content, isActive]);

  const exportNotes = () => {
    const timestamp = new Date().toLocaleString();
    const allNotes = [
      `YUGA AI - Lesson Notes`,
      `Generated on: ${timestamp}`,
      ``,
      `Course: ${lessonTitle}`,
      `Section: ${currentSegment}`,
      ``,
      `=== KEY POINTS ===`,
      ...notes.map((note, index) => `${index + 1}. ${note}`),
      ``,
      `=== PERSONAL NOTES ===`,
      userNotes || 'No personal notes added.',
      ``,
      `=== SUMMARY ===`,
      `This lesson covered ${notes.length} key concepts in ${currentSegment}.`,
      `Continue practicing these concepts for better understanding.`
    ].join('\n');

    const blob = new Blob([allNotes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonTitle.replace(/\s+/g, '_')}_${currentSegment.replace(/\s+/g, '_')}_notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearWhiteboard = () => {
    setNotes([]);
    setUserNotes('');
    setDrawings([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (drawingMode !== 'pen') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || drawingMode !== 'pen') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Whiteboard Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center">
              {currentSegment}
              {isActive && (
                <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </h3>
            <p className="text-xs text-gray-500">Auto-synced with lesson</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportNotes}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Export Notes"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={clearWhiteboard}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear All"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Drawing Tools */}
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setDrawingMode('pen')}
            className={`p-2 rounded-lg transition-colors ${
              drawingMode === 'pen' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDrawingMode('text')}
            className={`p-2 rounded-lg transition-colors ${
              drawingMode === 'text' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Type className="w-4 h-4" />
          </button>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-8 h-8 rounded border border-gray-300"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Auto-generated Key Points */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            Key Points
            {isActive && (
              <div className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Live Update
              </div>
            )}
          </h4>
          <div className="space-y-3">
            {notes.map((note, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 ${
                  index < animationIndex ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-cyan-50 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">{note}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {notes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Key points will appear here as the lesson progresses</p>
              </div>
            )}
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Visual Notes & Sketches
          </h4>
          <canvas
            ref={canvasRef}
            width={320}
            height={200}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair bg-white hover:border-purple-300 transition-colors"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <p className="text-xs text-gray-500 mt-2">Click and drag to draw, or use the tools above</p>
        </div>

        {/* Personal Notes */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Personal Notes
          </h4>
          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Add your own notes, questions, or insights here..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              {userNotes.length} characters
            </p>
            <p className="text-xs text-gray-500">
              Auto-saved
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>Auto-sync: {isActive ? 'ON' : 'OFF'}</span>
          </div>
          <button
            onClick={exportNotes}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Export Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicWhiteboard;