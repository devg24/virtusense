import React, { useState, useEffect } from 'react';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';
import { FFmpeg } from '@ffmpeg/ffmpeg';

const backendUrl = "http://localhost:2000";

const questions = [
  { question: "Do you believe in destiny?", answer: null },
  { question: "Is honesty always the best policy?", answer: null },
  { question: "Do you think money can buy happiness?", answer: null },
  {question: "Is it possible for humans to live on another planet?", answer: null },
  {question: "Should genetic engineering be used to enhance human abilities?", answer: null },
  {question: "Can artificial intelligence ever surpass human intelligence?", answer: null },
  {question: "Is time travel theoretically possible?", answer: null },
  {question: "Should animals have the same rights as humans?", answer: null },
  {question: "Can morality exist without religion?", answer: null },
  {question: "Is there intelligent life elsewhere in the universe?", answer: null },
  {question: "Should society prioritize renewable energy sources over fossil fuels?", answer: null },
  {question: "Can true equality ever be achieved?", answer: null },
  {question: "Should governments have access to individuals private data for security purposes?", answer: null }
];

const ffmpeg = new FFmpeg();

const MovingBufferSpinner = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length >= 3) {
          return '';
        }
        return prevDots + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="moving-buffer-spinner">
      running inference{dots}
    </div>
  );
};

const ThoughtProvokingQuestion = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [gesture, setGesture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    // Reset state when moving to the next question
    setRecording(false);
    setVideoBlob(null);
    setMediaRecorder(null);
    setStream(null);
    setGesture(null);
  }, [currentQuestionIndex]);


  const startRecording = async () => {
    setLoading(true);
    let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    let rec = new RecordRTCPromisesHandler(stream, {
        type: 'video/webm;codecs=vp8,opus'
    });
    rec.startRecording();
    setRecorder(rec);
    setRecording(true);
    setMediaRecorder(recorder);
    setStream(stream);
    setLoading(false);
  };

  const stopRecording = () => {
    recorder.stopRecording().then(async () => {
      let blob = await recorder.getBlob();
      setVideoBlob(blob);
      stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Convert video blob to MP4 using FFmpeg
      await ffmpeg.load();
      
      // Write the video blob to a temporary file
      const inputFileName = 'recorded_video.webm';
      const outputFileName = 'recorded_video.mp4';
      const arrayBuffer = await new Response(videoBlob).arrayBuffer();

      await ffmpeg.writeFile(inputFileName, new Uint8Array(arrayBuffer));
      
      // Run FFmpeg command to convert the video format
      await ffmpeg.exec(['-i', inputFileName, outputFileName]);
      
      // Read the converted MP4 file from FFmpeg memory
      const data = await ffmpeg.readFile(outputFileName);
      
      // Create a Blob from the MP4 data
      const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });

      // Send the MP4 data to the server
      const formData = new FormData();
      formData.append('mp4Data', mp4Blob, 'recorded_video.mp4');
      
      const response = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Video saved successfully.');
        await evaluateGesture();
      } else {
        console.error('Failed to save video.');
      }
      setLoading(false);

      
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const evaluateGesture = async () => {
    try {
      const response = await fetch(`${backendUrl}/nodding-pigeon`);
      if (!response.ok) {
        throw new Error('Failed to fetch gesture data');
      }
      const data = await response.json();
      const detectedGesture = data.gesture;
      setGesture(detectedGesture);
    } catch (error) {
      console.error('Error evaluating gesture:', error);
    }
  };
  
  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  const handleRerecord = () => {
    setVideoBlob(null);
    setGesture(null);
  };

  return (
    <div>

    { (
      <div style={{ textAlign: 'center' }}>
        <h2>Directions:</h2>
        <p>1. Click "Start Recording" to begin recording your response.</p>
        <p>2. Answer the thought-provoking question by nodding or shaking your head.</p>
        <p>3. Press "Stop Recording" as soon as you finish gesturing.</p>
        <p>4. Review your response by playing the recorded video.</p>
        <p>5. Click "Save Video" to save your response and proceed to the next question.</p>
      </div>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap:'2vh' }}>
    <h1>{questions[currentQuestionIndex].question}</h1>
      <div>

        {!recording ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '10px' }}>
       <button onClick={startRecording} style={{ padding: '10px 20px', fontSize: '1.2em' }}>Start Recording</button>
          </div>
        ) : (
        <button onClick={stopRecording}style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1.2em' }}>Stop Recording</button>
        )}
        {videoBlob && (
          <div>
            <video src={URL.createObjectURL(videoBlob)} controls autoPlay />
            {gesture ? (
              <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
                <p style={{ fontSize: '1.2em' }}>
  You {gesture === 'nodding' ? 'agree' : (gesture === 'turning' ? 'disagree' : 'are neutral')} with the statement.
  {gesture === undefined && ' Gesture not identified'}
</p>

                <button onClick={handleRerecord} style={{ padding: '10px 20px', fontSize: '1.2em', marginRight: '10px' }}>Rerecord</button>
                <button onClick={handleNextQuestion} style={{ padding: '10px 20px', fontSize: '1.2em' }}>Next Question</button>
            </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              {loading && <MovingBufferSpinner />} {!loading && <button onClick={handleSave} style={{ padding: '10px 20px', fontSize: '1.2em' }}> Run Inference </button>}
            </div>           )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};



export default ThoughtProvokingQuestion;





