
const player = document.querySelector(".player");
const playArea = document.querySelector("#main-play-area");
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
const aliensImg = ['img/monster-1.png','img/monster-2.png', 'img/monster-3.png'];
let alienInterval;

//ações do jogador
function playerActions(event){
    if(event.key === 'ArrowUp'){
        event.preventDefault();
        moveUp();
    }
    else if(event.key === 'ArrowDown'){
        event.preventDefault();
        moveDown();
    }
    else if(event.key === ' '){
        event.preventDefault();
        fireLaser();
    }
}
//mover para cima
function moveUp(){
    let topPosition = getComputedStyle(player).getPropertyValue('top');
    if(topPosition === '0px'){
        return
    }
    else{
        let position = parseInt(topPosition);
        position -= 20;
        player.style.top = position+'px';
    }
}
//mover para baixo
function moveDown(){
    let topPosition = getComputedStyle(player).getPropertyValue('top');
    if(topPosition === '500px'){
        return
    }
    else{
        let position = parseInt(topPosition);
        position += 20;
        player.style.top = position+'px';
    }
}

//funcao para atirar
function fireLaser(){
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(player).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = './img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = xPosition+'px';
    newLaser.style.top = yPosition - 10+'px';
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada alien foi atingido, se sim, troca o src da imagem
            if(checkLaserCollision(laser, alien)) {
                alien.src = './img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('alien-dead');
            }
        })

        if(xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = xPosition + 8 +'px';
        }
    }, 10);
}

//função para criar inimigos aleatórios
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = (Math.floor(Math.random() * 330) + 30)+'px';
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//função para movimentar os inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 30) {
            if(Array.from(alien.classList).includes('alien-dead')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = (xPosition - 3)+'px';
        }
    }, 50);
}

//função para  colisão
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 30;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 60;
    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop && laserBottom >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}




//iniciar jogo
startButton.addEventListener('click', (event) => {
    playGame();
});

function playGame(){
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', playerActions);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

//função para o game over
function gameOver() {
    window.removeEventListener('keydown', playerActions);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('game over!');
        player.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    },1000);
}