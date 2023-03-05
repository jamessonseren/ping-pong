const canvasEl = document.querySelector('canvas'),
canvasCtx = canvasEl.getContext('2d')

const lineWidth = 15
const gapX = 10

const mouse = { x: 0, y: 0}

const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function(){
        canvasCtx.fillRect(0, 0, this.w, this.h)

    }
}

const line = {
    w: 15,
    h: field.h,
    draw: function(){
        canvasCtx.fillStyle = "#ffff"
        canvasCtx.fillRect(
        field.w / 2 - this.w / 2,
        0,
        this.w,
        this.h
    )
    }
}


const leftPaddle = {
    x: gapX,
    y: 5,
    w: line.w,
    h:200,
    _move: function(){
        this.y = mouse.y - this.h / 2  
    },
    draw: function(){
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        leftPaddle._move()
    }
    

}

const rightPaddle = {
    x: field.w - line.w - gapX,
    y: leftPaddle.y,
    w: line.w,
    h: leftPaddle.h,
    speed: 5,
    _move: function(){
        if(this.y + this.h / 2 < ball.y + ball.r){
            this.y += this.speed
        }else{
            this.y -= this.speed
        }
    },
    speedUp: function(){
        this.speed += 2
    },
    draw: function(){
        canvasCtx.fillRect(this.x, this.y, this.w, this.h) 
        this._move()

    }
    
}

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function(){
        this.human++
    },
    increaseComputer: function(){
        this.computer++
    },
    draw: function(){
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#01341D"
        canvasCtx.fillText(this.human, field.w / 4, 50)
        canvasCtx.fillText(this.computer, field.w / 4 + window.innerWidth / 2, 50)
    
    }
}
const ball = {
    x: 0,
    y: 0, 
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _reverseX: function(){
        this.directionX *= -1
    },
    _reverseY: function(){
        this.directionY *= -1
    },
    _speedUp: function(){
        this.speed+=3
    },
    _scoreUp: function(){   
        this._speedUp()
        rightPaddle.speedUp()
        this.x = field.w / 2
        this.y = field.h / 2
    },
    _move: function(){
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    _calcPosition: function(){
        //check if Player 1 scored
        if(this.x > field.w - this.r - rightPaddle.w - gapX){
            //check if right paddle and the ball are at same position
            if(
                this.y + this.r > rightPaddle.y &&
                this.y - this.r < rightPaddle.y + rightPaddle.h
                ){
                    //the ball bounces changing the position
                this._reverseX()
            }else {
                //player 1 scores 
                score.increaseHuman()
                this._scoreUp()
            }
        }

        //check if player 2 scores
        if(this.x < this.r + gapX){
            //check if left paddle and the ball at same position
            if(this.y + this.r> leftPaddle.y &&
                this.y - this.r< leftPaddle.y + leftPaddle.h){
                    //ball bounces on left paddle changing its signal
                    this._reverseX()
                }else{
                    //player 2 scores
                    score.increaseComputer()
                    this._scoreUp()
                }
        }
        
        if((this.y > field.h - this.r && this.directionY > 0) || (this.y < 0 + this.r && this.directionY < 0))  {
            this._reverseY()
        }
    },
    draw: function() {
    canvasCtx.fillStyle = "#ffff"
    canvasCtx.beginPath()
    canvasCtx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false)
    canvasCtx.fill()
    this._calcPosition()
    this._move()
    
    }
}
 function setup(){
    canvasEl.width = canvasCtx.width = field.w 
    canvasEl.height = canvasCtx.height = field.h

 }

 function draw(){
    //Field drawing
    canvasCtx.fillStyle ="#286047" 
    field.draw()
    line.draw()
    leftPaddle.draw()
    rightPaddle.draw()
    score.draw()
    ball.draw()
    
}

 window.animateFrame = (function(){
    return(
        window.requestAnimationFrame ||
        window.webKitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback){
            return window.setTimeout(callback, 1000 / 60)
        }
    )
 })()

 function main(){
    animateFrame(main)
    draw()
 }
 setup()
 main()

 canvasEl.addEventListener("mousemove", (e) =>{
    mouse.x = e.pageX
    mouse.y = e.pageY
    console.log(mouse) })