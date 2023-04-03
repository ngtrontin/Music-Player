const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const pauseBtn = $('.even-icon.pause')
const playBtn = $('.even-icon.play')
const prevBtn = $('.even-icon.prev')
const nextBtn = $('.even-icon.next')
const repeatBtn = $('.options-icon.repeat')
const randomBtn = $('.options-icon.random')
const settingBtn = $('.options-icon.setting')

const songBlock = $('.song-list')
const audioCurrentTime = $('.current-time')
const audioDurationTime = $('.audio-duration')

const volumeBar = $('#volume-bar')
const audio = $('#audio')
const audioProgress = $('#audio-bar')

const app = {
    currentIndex: 0,
    isRepeat: false,
    isRandom: false,
    isSetting: false,
    isPause: false,
    songs: [
        {
            name: "11 giờ 11 phút",
            singer: "MiiNa x Rin9 x Dreamer",
            path: "./assets/songs/song1.mp3",
            image: "./assets/thumbs/song1.jpg"
        },
        {
            name: "Đi Đâu Chẳng Thấy",
            singer: "Summer Vee",
            path: "./assets/songs/song2.mp3",
            image: "./assets/thumbs/song2.jpg"
        },
        {
            name: "Nước mắt em lau bằng tình yêu mới",
            singer: "Da Lab",
            path: "./assets/songs/song3.mp3",
            image: "./assets/thumbs/song3.jpg"
        },
        {
            name: "Chuyện đôi ta",
            singer: "DaLab ft Muộii",
            path: "./assets/songs/song4.mp3",
            image: "./assets/thumbs/song4.jpg"
        },
        {
            name: "Là Em",
            singer: "Huy Vac",
            path: "./assets/songs/song5.mp3",
            image: "./assets/thumbs/song5.jpg"
        },
        {
            name: "Yêu thương hay là nhớ",
            singer: "Various Artists",
            path: "./assets/songs/song6.mp3",
            image: "./assets/thumbs/song6.jpg"
        },
        {
            name: "Yêu thì sao",
            singer: "Dee Trần",
            path: "./assets/songs/song7.mp3",
            image: "./assets/thumbs/song7.jpg"
        },
    ],
    /** functions work when turn on app */
    render: function() {
        const htmls = this.songs.map( function(song, index) {
            return `
            <div class="song ${index == app.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="song-thumb" style="background-image: url(${song.image})"></div>
                <div class="in4">
                    <h3 class="song-name">${song.name}</h3>
                    <p class="song-singer">${song.singer}</p>
                </div>
            </div>`
        })
        songBlock.innerHTML = htmls.join('') 
    },
    defineProperties: function () {
        Object.defineProperty( this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            },
        })
    },
    loadCurrentSong: function () {
        const title = $('.song-intro .name')
        const headerThumb = $('.song-intro .header-thumb')

        title.textContent = this.currentSong.name
        headerThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    loadTime: function (curTime, durTime) {
        let curmin = Math.floor(curTime / 60)
            if (curmin < 10) {
                curmin = '0' + curmin
            }

        let cursec = Math.floor(curTime % 60)
            if (cursec < 10) {
                cursec = '0'+ cursec
            }
        audioCurrentTime.textContent = `${curmin}:${cursec}`

        let durmin = Math.floor(durTime / 60)
            if (durmin < 10) {
                durmin = '0' + durmin
            }

        let dursec = Math.floor(durTime % 60)
            if (dursec < 10) {
                dursec = '0'+ dursec
            }
        audioDurationTime.textContent = `${durmin}:${dursec}`
    },

    /** functions work when click btn */
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function () {
        let nextIndex
        do {
            nextIndex = Math.floor(Math.random() * this.songs.length)
        } while (nextIndex === this.currentIndex)
        this.currentIndex = nextIndex
        this.loadCurrentSong()
    },
    scrollActiveSong: function () {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        })
    },

    handleEvent: function () {
        const _this =  this 
        /** play & pause song  */
        pauseBtn.onclick = function () {
            audio.play()
            pauseBtn.style.display = 'none'
            playBtn.style.display = `block`
        }
        playBtn.onclick = function () {
            audio.pause()
            playBtn.style.display = `none`
            pauseBtn.style.display = 'block'
        }
        /** get audio current time */
        audio.ontimeupdate = function () {
            if (audio.duration) {
                var progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
                audioProgress.value = progressPercent
                audioProgress.style.backgroundSize = progressPercent + '% 100%'
                _this.loadTime(audio.currentTime, audio.duration)
            }
        }
        /** seek time  */
        audioProgress.onchange = function (e) {
            const seektime = audio.duration  / 100 * e.target.value
            audio.currentTime = seektime
        }
        /** next & prev song */
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            _this.render()
            _this.scrollActiveSong()
            pauseBtn.style.display = 'none'
            playBtn.style.display = `block`
            audio.play()
        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            _this.render()
            _this.scrollActiveSong()
            audio.play()
        }
        /** options btn */
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        settingBtn.onclick = function () {
            _this.isSetting = !_this.isSetting
            settingBtn.classList.toggle('active', _this.isSetting)
        }
        /** repeat or next when song ended */
        audio.onended =  function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        /** Change song when click */
        songBlock.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
                if (_this.isPause = !_this.isPause) {
                    pauseBtn.style.display = 'none'
                    playBtn.style.display = `block`
                }
            }
        }
        /** volume setting */
        volumeBar.onchange = function () {
            audio.volume = volumeBar.value / 100
        }
    },
    start: function () {
        this.defineProperties()

        this.handleEvent()

        this.loadCurrentSong()

        this.render()
    }
} 

app.start()

/** audio backgroundSize */
const rangeInputs = $$('input[type="range"]')
function handleInputChange(e) {
    const target = e.target
    const min = target.min
    const max = target.max
    const val = target.value
    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
}
rangeInputs.forEach(input => {
    input.addEventListener('input' , handleInputChange)
})
