import { useState, useEffect, useRef, useCallback } from 'react';

// Augmented Window interface for Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export const useSpeechToText = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Ref to store the recognition instance
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
        const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

        if (!SpeechRecognitionConstructor) {
            setError('Speech recognition not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setTranscript((prev) => prev + ' ' + finalTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setError(event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                setTranscript(''); // Reset on new session? Or keep? Let's reset for fresh start.
                recognitionRef.current.start();
                setIsListening(true);
                setError(null);
            } catch (err) {
                console.error(err);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        error,
        isSupported: typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    };
};
