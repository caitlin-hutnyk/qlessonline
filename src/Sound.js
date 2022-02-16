import ClickTone from './assets/sounds/click-tone.wav'
import Win from './assets/sounds/win.mp3'
import Trumpet from './assets/sounds/win_trumpet.mp3'


export const SOUND_TYPES = {
    DIE_DROPPED: ClickTone,
    TRUMPET: Trumpet,
    WIN: Win
}
export default class Sound {
    static playSound(sound) {
        const audio = new Audio(sound)
        audio.play()
    }
}