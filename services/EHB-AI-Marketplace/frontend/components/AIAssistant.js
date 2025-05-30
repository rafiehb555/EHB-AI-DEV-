import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, StopCircle, Play, DownloadCloud, Clock, AlertCircle } from 'react-feather';
import { toast } from 'react-toastify';
import { sendTextToAI, sendAudioToAI } from '../utils/api';

export default function AIAssistant({ user }) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef(null);
  const chatContainerRef = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversations]);

  // Clean up timer and recorder on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage = { type: 'user', content: inputValue.trim(), timestamp: new Date() };
    setConversations([...conversations, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendTextToAI(inputValue.trim(), user?.role);
      
      setConversations(prev => [
        ...prev,
        { type: 'assistant', content: response.message, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      toast({ title: 'Failed to get a response from the AI assistant. Please try again.', status: "error" });
      
      setConversations(prev => [
        ...prev,
        { 
          type: 'error', 
          content: 'Sorry, I encountered an error processing your request. Please try again.', 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      chunks.current = [];
      
      recorder.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        if (chunks.current.length > 0 && recorder.state === 'inactive') {
          await handleAudioSubmit(audioBlob);
        }
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      // Start timer for recording duration
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microptoast({ title: 'Could not access your microphone. Please check your browser permissions.', status: "error" })browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();

      // Stop all audio tracks to turn off the microphone
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleAudioSubmit = async (audioBlob) => {
    setIsLoading(true);
    
    const userMessage = { 
      type: 'user', 
      content: 'Voice message', 
      audio: audioURL,
      timestamp: new Date() 
    };
    
    setConversations([...conversations, userMessage]);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('userRole', user?.role || 'user');
      
      const response = await sendAudioToAI(formData);
      
      setConversations(prev => [
        ...prev,
        { 
          type: 'assistant', 
          content: response.message,
          transcription: response.transcription, 
          timestamp: new Date() 
        }
      ]);
    } catch (error) {
      console.error(toast({ title: 'Failed to process your voice message. Please try again.', status: "error" })cess your voice message. Please try again.');
      
      setConversations(prev => [
        ...prev,
        { 
          type: 'error', 
          content: 'Sorry, I encountered an error processing your voice message. Please try again.', 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsLoading(false);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const playAudio = (url) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-200px)]">
      <div className="bg-primary text-white p-4">
        <h2 className="text-lg font-medium">AI Assistant</h2>
        <p className="text-sm opacity-80">Ask questions or give commands - I'm here to help!</p>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="bg-primary bg-opacity-10 p-4 rounded-full mb-4">
              <Mic className="h-8 w-8 text-primary" /></Mic>
            </div>
            <h3 className="text-lg font-medium text-gray-700">Welcome to your AI Assistant</h3>
            <p className="mt-2 max-w-md">
              Ask questions about your dashboard, get insights on your data, or request help with any task.
              You can type your message or use voice input.
            </p>
          </div>
        ) : (
          (conversations || []).map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-primary text-white' 
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                {message.audio && (
                  <div className="mb-2 flex items-center space-x-2">
                    <button 
                      onClick={() => playAudio(message.audio)} 
                      className="p-1 bg-white rounded-full text-primary"
                    >
                <Play className="h-4 w-4" /></Play>-4" />
                    </button>
                    <span className="text-xs text-white opacity-80">Voice message</span>
                  </div>
                )}
                
                {message.transcription && (
                  <div className="italic text-sm mb-2 text-gray-600">
                    "{message.transcription}"
                  </div>
                )}
                
                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>
                
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Audio playback element (hidden) */}
      <audio ref={audioRef} className="hidden" controls />
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="bg-red-50 border-t border-red-100 p-2 flex justify-center items-center">
          <div className="mr-2 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-600 mr-2">Recording {formatTime(recordingTime)}</span>
          <button
            onClick={stopRecording}
            className="p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
          ><StopCircle className="h-4 w-4" /></StopCircle>="h-4 w-4" />
          </button>
        </div>
      )}
      
      {audioURL && !isRecording && !isLoading && (
        <div className="bg-blue-50 border-t border-blue-100 p-2 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => playAudio(audioURL)}
              className="p-1 bg-primary rounded-full text-white hover:bg-primary-dark mr-2"
  <Play className="h-4 w-4" /></Play>lay className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600">Audio recording ready</span>
          </div>
          <div>
            <button
              onClick={() => setAudioURL('')}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`p-2 rounded-full ${
              isRecording 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
      <MicOff className="h-5 w-5" /></MicOff> ? <MicOff className="h-5 w-5" /></MicOff> : <Mic className="h-5 w-5" /></Mic>}
          </button>
          
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isLoading || isRecording}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          
          <button
            type="submit"
            disabled={isLoading || isRecording || inputValue.trim() === ''}
            className={`p-2 rounded-full ${
              isLoading || isRecording || inputValue.trim() === '' 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-primary text-white hover:bg-primary-dark<Send className="h-5 w-5" /></Send>>
   <Send className="h-5 w-5" /></Send>5 w-5" />
          </button>
        </form>
        
        <div className="flex justify-center mt-2">
          <p className="text-xs text-gray-500">
            AI Assistant can help with dashboard analytics, reporting, and business insights
          </p>
        </div>
      </div>
    </div>
  );
}
