const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i+=70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+=70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const boundaries = []
const offset = {
    x: -950,
    y: -580
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(new Boundary({position: { 
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
        }}))
    })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            battleZones.push(new Boundary({position: { 
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
        }}))
    })
})

const map = new Image()
map.src = './img/Poke Map.png'

const foregroundImg = new Image()
foregroundImg.src = './img/foregroundObj.png'

const playerUp = new Image()
playerUp.src = './img/playerUp.png'

const playerDown = new Image()
playerDown.src = './img/playerDown.png'

const playerLeft = new Image()
playerLeft.src = './img/playerLeft.png'

const playerRight = new Image()
playerRight.src = './img/playerRight.png'

//canvas.width / 2, 
//canvas.height / 2,

const player = new Sprite({
    position: {
        x: canvas.width / 2,
        y: canvas.height / 2
    },
    image: playerDown,
    frames: {
        max: 4,
        hold: 15
    },
    sprites: {
        up: playerUp,
        down: playerDown,
        left: playerLeft,
        right: playerRight,
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: map
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImg
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    s: {
        pressed: false
    },
    w: {
        pressed: false
    }
}

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({rectangle1, rectangle2}) {
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const battle =  {
    initiated: false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
        
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    if (battle.initiated) return

    //activate battle
    if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = (Math.min(player.position.x + 
                player.width, battleZone.position.x + battleZone.width) - 
                Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
                Math.max(player.position.y, battleZone.position.y))
            //detect collisions
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2 
                && Math.random() < 0.01
            ) { 
                    console.log('start battle')
                    //deactivate animation loop
                    window.cancelAnimationFrame(animationId)

                    battle.initiated = true
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        repeat: 3,
                        yoyo: true,
                        duration: 0.4,
                        onComplete() {
                            gsap.to('#overlappingDiv', {
                                opacity: 1,
                                duration: 0.4,
                                onComplete() {
                                    //new animation loop
                                    animateBattle()
                                    gsap.to('#overlappingDiv', {
                                        opacity: 0,
                                        duration: 0.4,
                                    })
                                }
                            })
                        }
                    })
                    break
                }
            }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up
        
        for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        //detect collisions
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }}
            })
        ) { 
                moving = false
                break
            }
        }
        
        if (moving) movables.forEach(movable => {movable.position.y += 3})
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            //detect collisions
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }}
                })
            ) { 
                    moving = false
                    break
                }
            }
            if (moving) movables.forEach(movable => {movable.position.y -= 3})
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            //detect collisions
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }}
                })
            ) { 
                    moving = false
                    break
                }
            }
            if (moving) movables.forEach(movable => {movable.position.x += 3})
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            //detect collisions
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }}
                })
            ) { 
                    moving = false
                    break
                }
            }
            if (moving) movables.forEach(movable => {movable.position.x -= 3})
    }
}
//animate()

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

const draggleImage = new Image()
draggleImage.src = './img/draggleSprite.png'
const draggle = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    image: draggleImage,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true,
    isEnemy: true
})
const embyImage = new Image()
embyImage.src = './img/embySprite.png'
const emby = new Sprite({
    position: {
        x: 280,
        y: 325
    },
    image: embyImage,
    frames: {
        max: 4,
        hold: 30
    },
    animate: true 
})

function animateBattle() {
    window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    draggle.draw()
    emby.draw()
}

animateBattle()

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        emby.attack({ attack: {
            name: 'Tackle',
            damage: 10,
            type: 'Normal'
        },
        recipient: draggle
     })
    })
})

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break;

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break;

        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break;

        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break;        
    }
})
window.addEventListener('keyup', (e) => {
    switch(e.key){
        case 'a':
            keys.a.pressed = false
            break;

        case 'd':
            keys.d.pressed = false
            break;

        case 's':
            keys.s.pressed = false
            break;

        case 'w':
            keys.w.pressed = false
            break;        
    }
})

