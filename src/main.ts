import { Actor, CollisionType, Color, Engine, vec } from "excalibur"
import { vector } from "excalibur/build/dist/Util/DrawUtil"

//  1 - Criar uma instancia de engine que representa o jogo
const game = new Engine({
  width: 800,
  height: 600
})

// 2 - Criar barra do player
const barra = new Actor({
  x: 150,
  y: game.drawHeight - 40,
  width: 200,
  height: 20,
  color: Color.Chartreuse
})

// Define o tipo de colisão de barra
// collisionType.Fixed = Define o tipo de colisão, nesse caso, detecta colisão mas se mantém no lugar
barra.body.collisionType = CollisionType.Fixed

// Adicionar o Actor barra - player, no game
game.add(barra)

// 3 - movimentar a barra de acordo com o ponteiro do mouse
game.input.pointers.primary.on("move", (event) => {
  barra.pos.x = event.worldPos.x
})

// 4 - Criar actor bolinha
const bolinha = new Actor({
  x: 100,
  y: 300,
  radius: 10,
  color: Color.Red
})

bolinha.body.collisionType = CollisionType.Active

// 5 - Física da bolinha

const VeloBol = vec(250, 250)

// Após 1 segundo (1000ms), define a velocidade da bolinha em x = 100 e y = 100 
setTimeout(() => {
  bolinha.vel = VeloBol
}, 1000);

bolinha.on("postupdate", () => {
  // Se a bolinha colidir com o lado direito
  if (bolinha.pos.x < bolinha.width / 2) {
    bolinha.vel.x = VeloBol.x
  }
  // Se a bolinha colidir com o lado esquerdo
  if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
    bolinha.vel.x = VeloBol.x * -1
  }

  // Se a bolinha colidir com o parte superior
  if (bolinha.pos.y < bolinha.height / 2) {
    bolinha.vel.y = VeloBol.y
  }

  // Se a bolinha colidir com o parte inferior
  // if (bolinha.pos.y + bolinha.height/2 > game.drawHeight) {
  //   bolinha.vel.y = -VeloBol.y
  // }
})

// Insere a bolinha no game
game.add(bolinha)

// 6 - Criar os bloco
// Configuração de tamanho e espaçamento dos blocos
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [
  Color.Violet,
  Color.Orange,
  Color.Yellow
]

// Os dois "larguraBloco" dão o mesmo result:
// const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

// Inicia o game
game.start()