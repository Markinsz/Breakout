import { Actor, CollisionType, Text, Color, Engine, vec, Font, Label, FontUnit, Input, SoundEvents, Sound, Loader } from "excalibur"
import { vector } from "excalibur/build/dist/Util/DrawUtil"

//  1 - Criar uma instancia de engine que representa o jogo
const game = new Engine({
  width: 800,
  height: 600
})

// Adicionando sons
  const som = new Sound('./src/sounds/Src_sounds_match.mp3')
  const carregar = new Loader([som])
  await game.start(carregar)

// 2 - Criar barra do player
const barra = new Actor({
  x: 150,
  y: game.drawHeight - 40,
  width: 200,
  height: 20,
  color: Color.Chartreuse,
  name: "BarraJogador"
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

bolinha.body.collisionType = CollisionType.Passive

// 5 - Física da bolinha

const VeloBol = vec(500, 500)

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
  Color.Red,
  Color.Orange,
  Color.Yellow
]

// Os dois "larguraBloco" dão o mesmo result:
// const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

// Renderização dos blocos
// Renderizar 3 linhas
for (let j = 0; j < linhas; j++) {
  // Renderiza 5 blocos
  for(let i = 0; i < colunas; i++) {
    listaBlocos.push(
      new Actor({
        x: xoffset + i * (larguraBloco + padding) + padding,
        y: yoffset + j * (alturaBloco + padding) + padding,
        width: larguraBloco,
        height: alturaBloco,
        color: corBloco[j]
      })
    )
  }
}


listaBlocos.forEach(bloco => {
  // Define o tipo de colisor de cada bloco
  bloco.body.collisionType = CollisionType.Active

  // Adiciona os blocos no game
  game.add(bloco)
})

// Adicionando pontuação
let pontos = 0

// const textopontos = new Text({
//   text: "Hello World",
//   font: new Font({ size: 20 })
// })
// const objetoTexto = new Actor({
//   x: game.drawWidth - 50,
//   y: game.drawHeight - 50
// })

// Label = Text + Actor

const textopontos = new Label({
  text: pontos.toString(),
  font: new Font({
    size: 40,
    color: Color.White,
    strokeColor: Color.Black,
    unit: FontUnit.Px
  }),
  pos: vec(600, 500)
})

game.add(textopontos)

let colidindo: boolean = false

  

bolinha.on("collisionstart", async (event) => {
  
  
  // Verificando se colidiu com blocos destrutiveis
  if (listaBlocos.includes(event.other)) {
    
    // Destruindo bloco
    event.other.kill()
    
    // Adiciona os pontos
    pontos++
    
    // Atualiza placar
    textopontos.text = pontos.toString()
  }
  // Rebater a bolinha - Inverter 
  let interseccao = event.contact.mtv.normalize() //mtv = "minimum translation vector" é um vetor "normalizado()"
  
  // !colidindo -> se não estiver colidindo
  
  if (!colidindo){
    colidindo = true
    // Adicionando Som
    som.play(1);
      
      // intersecção.x e intersecção.y
      //  O maior representa o eixo onde houve contato
      if (Math.abs(interseccao.x) > Math.abs(interseccao.y)) {
        bolinha.vel.x = -bolinha.vel.x
      } else {
        bolinha.vel.y = -bolinha.vel.y
      }
    }
  })

  bolinha.on("collisionend", () => {
    colidindo = false
  })

  // Perdendo
  bolinha.on("exitviewport", () => {
    alert("F no chat")
    window.location.reload()
  })

  if(pontos === 15) {
    alert("Ganhou!")
  }

// Inicia o game
game.start()