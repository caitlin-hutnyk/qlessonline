import ClickTone from './assets/sounds/click-tone.wav'

export const SOUND_TYPES = {
    DIE_DROPPED: ClickTone
}

export default class Sound {
    static playSound(sound) {
        const audio = new Audio(sound)
        audio.play()
    }
}