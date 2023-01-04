const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillStyle = 'grey'
c.fillRect(0,0, canvas.width, canvas.height)

const map = new Image()
map.src = './img/Poke Map.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

class Sprite {
    constructor({position, image, velocity}) {
        this.position = position,
        this.image = image
    }

    draw() {
        c.drawImage(this.image, -950, -570)
    }
}

const background = new Sprite({
    position: {
        x: -950,
        y: -570
    },
    image: map
})

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    c.drawImage(
        playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height, 
        canvas.width / 2, 
        canvas.height / 2,
        playerImage.width / 4,
        playerImage.height, 
    )
}
animate()

window.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'a':
            console.log('Pressed a')
            break;
        case 'd':
            console.log('Pressed d')
            break;
        case 's':
            console.log('Pressed s')
            break;
        case 'w':
            console.log('Pressed w')
            break;        
    }
})
//window.addEventListener('keyup', () => {

//})

