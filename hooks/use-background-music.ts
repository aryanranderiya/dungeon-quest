import { useEffect, useRef } from 'react';

export const useBackgroundMusic = (soundEnabled: boolean) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            if (soundEnabled) {
                audioRef.current
                    .play()
                    .catch((e) => console.log("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [soundEnabled]);

    return audioRef;
};
