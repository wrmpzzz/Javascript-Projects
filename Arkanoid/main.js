  const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Configuración general
    const CONFIG = {
      ballRadius: 5,
      paddle: {
        width: 60,
        height: 10,
        sensitivity: 7
      },
      bricks: {
        rows: 5,
        cols: 13,
        width: 32,
        height: 16,
        padding: 2,
        offsetTop: 60,
        offsetLeft: 10
      },
      colors: ["#f00", "#ff0", "#0f0", "#0ff", "#00f", "#f0f", "#fff", "#aaa"],
      status: {
        FRESH: 1,
        DESTROYED: 0
      }
    };

    const $score = document.getElementById("score");
    const $lives = document.getElementById("lives");
    const $level = document.getElementById("level");
    const $gameOver = document.getElementById("game-over");

    // Estado del juego
    const state = {
      ball: {
        x: canvas.width / 2,
        y: canvas.height - 40,
        dx: 4,
        dy: -4
      },
      paddle: {
        x: (canvas.width - CONFIG.paddle.width) / 2,
        y: canvas.height - CONFIG.paddle.height - 10
      },
      rightPressed: false,
      leftPressed: false,
      bricks: [],
      score: 0,
      lives: 3,
      level: 1,
      isGameOver: false
    };

    // Crear ladrillos
    function initBricks() {
      state.bricks = [];
      for (let c = 0; c < CONFIG.bricks.cols; c++) {
        state.bricks[c] = [];
        for (let r = 0; r < CONFIG.bricks.rows; r++) {
          const brickX = c * (CONFIG.bricks.width + CONFIG.bricks.padding) + CONFIG.bricks.offsetLeft;
          const brickY = r * (CONFIG.bricks.height + CONFIG.bricks.padding) + CONFIG.bricks.offsetTop;
          const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
          state.bricks[c][r] = {
            x: brickX,
            y: brickY,
            status: CONFIG.status.FRESH,
            color
          };
        }
      }
    }

    initBricks();

    // Dibujo
    function drawBall() {
      ctx.beginPath();
      ctx.arc(state.ball.x, state.ball.y, CONFIG.ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.fillStyle = "#fff";
      ctx.fillRect(state.paddle.x, state.paddle.y, CONFIG.paddle.width, CONFIG.paddle.height);
    }

    function drawBricks() {
      for (let c = 0; c < CONFIG.bricks.cols; c++) {
        for (let r = 0; r < CONFIG.bricks.rows; r++) {
          const b = state.bricks[c][r];
          if (b.status === CONFIG.status.FRESH) {
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, CONFIG.bricks.width, CONFIG.bricks.height);
          }
        }
      }
    }

    function draw() {
      if (state.isGameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPaddle();
      drawBricks();
      moveBall();
      movePaddle();
      handleCollisions();

      requestAnimationFrame(draw);
    }

    // Movimiento
    function moveBall() {
      const b = state.ball;

      // Rebotar en paredes
      if (b.x + b.dx < CONFIG.ballRadius || b.x + b.dx > canvas.width - CONFIG.ballRadius) {
        b.dx *= -1;
      }
      if (b.y + b.dy < CONFIG.ballRadius) {
        b.dy *= -1;
      }

      // Rebotar con la paleta
      if (
        b.y + CONFIG.ballRadius > state.paddle.y &&
        b.x > state.paddle.x &&
        b.x < state.paddle.x + CONFIG.paddle.width
      ) {
        b.dy *= -1;
      } else if (b.y + b.dy > canvas.height - CONFIG.ballRadius) {
        state.lives--;
        $lives.textContent = state.lives;

        if (state.lives <= 0) {
          state.isGameOver = true;
          $gameOver.style.display = "block";
        } else {
          // Reset bola y paleta
          b.x = canvas.width / 2;
          b.y = canvas.height - 40;
          b.dx = 4;
          b.dy = -4;
          state.paddle.x = (canvas.width - CONFIG.paddle.width) / 2;
        }
      }

      b.x += b.dx;
      b.y += b.dy;
    }

    function movePaddle() {
      if (state.rightPressed && state.paddle.x < canvas.width - CONFIG.paddle.width) {
        state.paddle.x += CONFIG.paddle.sensitivity;
      } else if (state.leftPressed && state.paddle.x > 0) {
        state.paddle.x -= CONFIG.paddle.sensitivity;
      }
    }

    // Colisiones con ladrillos
    function handleCollisions() {
      for (let c = 0; c < CONFIG.bricks.cols; c++) {
        for (let r = 0; r < CONFIG.bricks.rows; r++) {
          const brick = state.bricks[c][r];
          if (brick.status === CONFIG.status.DESTROYED) continue;

          const b = state.ball;
          const hitX = b.x > brick.x && b.x < brick.x + CONFIG.bricks.width;
          const hitY = b.y > brick.y && b.y < brick.y + CONFIG.bricks.height;

          if (hitX && hitY) {
            b.dy *= -1;
            brick.status = CONFIG.status.DESTROYED;
            state.score += 10;
            $score.textContent = state.score;

            checkLevelCompletion();
          }
        }
      }
    }

    function checkLevelCompletion() {
      const bricksLeft = state.bricks.flat().some(b => b.status === CONFIG.status.FRESH);
      if (!bricksLeft) {
        state.level++;
        $level.textContent = state.level;

        // Subir dificultad
        state.ball.dx *= 1.1;
        state.ball.dy *= 1.1;

        initBricks();
      }
    }

    // Eventos de teclado
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") state.rightPressed = true;
      if (e.key === "ArrowLeft") state.leftPressed = true;
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight") state.rightPressed = false;
      if (e.key === "ArrowLeft") state.leftPressed = false;
    });

    draw(); // Inicia el juego