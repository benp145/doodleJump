document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('img')
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let score = 0
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let platformTimerId



    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodler.src = './images/frog2.png'
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 600 / platformCount
            let newPlatBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 250) {
            platforms.forEach(platform => {
                if (doodlerBottomSpace >= 400) {
                    platform.bottom += 400 - doodlerBottomSpace

                }
                    
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'
            

                if (platform.bottom < 10) {
                    score++
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        let t = -80
        upTimerId = setInterval(function () {
            t++
            doodlerBottomSpace -= t / 10
            if (doodlerBottomSpace < 400) {
                doodler.style.bottom = doodlerBottomSpace + 'px'
            } else {
                platforms.forEach(platform => {
                    platform.bottom += t / 10

                    let visual = platform.visual
                    visual.style.bottom = platform.bottom + 'px'

                    if (platform.bottom < 5) {
                        score++
                        let firstPlatform = platforms[0].visual
                        firstPlatform.classList.remove('platform')
                        platforms.shift()
                        let newPlatform = new Platform(600)
                        platforms.push(newPlatform)
                    }
                })
            }
    
            console.log(t)
            if (t === 0) {
                fall()
            }
        }, 10)
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        let t = 0
        downTimerId = setInterval(function () {
            t++
            if (doodlerBottomSpace > 400) {
                doodlerBottomSpace = 400
            }
            doodlerBottomSpace -= t / 10
            
            doodler.style.bottom = doodlerBottomSpace + 'px'
            
        
            

            // console.log(t)
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                }
                 
            })
        }, 10)
    }

    function gameOver() {
        console.log('game over')
        isGameOver = true
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
    }

    function control(e) {
        if (e.key === "ArrowLeft") {
            moveLeft()
        } else if (e.key === "ArrowRight") {
            moveRight()
        } else if (e.key === "ArrowUp") {
            moveStraight()
        }
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        if (!isGoingLeft) {
            isGoingLeft = true
            leftTimerId = setInterval(function () {
                if (doodlerLeftSpace >= -20) {
                    doodlerLeftSpace -= 5
                    doodler.style.left = doodlerLeftSpace + 'px'
                } else {
                    doodlerLeftSpace = 360
                    doodler.style.left = doodlerLeftSpace + 'px'
                }
            },20)
        }
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        if (!isGoingRight) {
            isGoingRight = true
            rightTimerId = setInterval(function () {
                if (doodlerLeftSpace <= 360) {
                    doodlerLeftSpace += 5
                    doodler.style.left = doodlerLeftSpace + 'px'
                } else {
                    doodlerLeftSpace = -20
                    doodler.style.left = doodlerLeftSpace + 'px'
                }
            }, 20)
        }
    }

    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            jump()
            document.addEventListener('keyup',control)
        }
    }
    // attach to button
    start()



})