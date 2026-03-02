import pygame
import random
import sys

# Initialize
pygame.init()
WIDTH, HEIGHT = 480, 640
WIN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("NOSO-Launch Mini-game: Space Shooter")
CLOCK = pygame.time.Clock()
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
SHIP_COLOR = (0, 200, 255)
BULLET_COLOR = (255, 255, 0)
ASTEROID_COLOR = (180, 80, 80)

# Spaceship
SHIP_WIDTH, SHIP_HEIGHT = 50, 30
ship_x, ship_y = 40, HEIGHT//2
ship_speed = 5

# Bullets
bullets = []
BULLET_WIDTH, BULLET_HEIGHT = 10, 4
bullet_speed = 10

# Obstacles
asteroids = []
ASTEROID_WIDTH, ASTEROID_HEIGHT = 40, 40
asteroid_speed = 5
OBSTACLE_SPAWN_RATE = 40  # lower=faster

score = 0
font = pygame.font.SysFont(None, 32)

def draw_window():
    WIN.fill(BLACK)
    # Draw ship
    pygame.draw.rect(WIN, SHIP_COLOR, (ship_x, ship_y, SHIP_WIDTH, SHIP_HEIGHT))
    # Draw bullets
    for b in bullets:
        pygame.draw.rect(WIN, BULLET_COLOR, b)
    # Draw obstacles
    for a in asteroids:
        pygame.draw.rect(WIN, ASTEROID_COLOR, a)
    # Score
    text = font.render(f"Score: {score}", True, WHITE)
    WIN.blit(text, (10, 10))
    pygame.display.update()

def main():
    global ship_y, score, bullets, asteroids
    run = True
    spawn_timer = 0
    while run:
        CLOCK.tick(FPS)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                pygame.quit()
                sys.exit()

        # Key presses
        keys = pygame.key.get_pressed()
        if keys[pygame.K_w] or keys[pygame.K_UP]:
            ship_y -= ship_speed
        if keys[pygame.K_s] or keys[pygame.K_DOWN]:
            ship_y += ship_speed
        # Stay on screen
        ship_y = max(0, min(HEIGHT - SHIP_HEIGHT, ship_y))

        # Shooting
        if keys[pygame.K_SPACE]:
            if len(bullets) < 5 or bullets[-1][0] > ship_x + SHIP_WIDTH + 20:
                bullets.append(pygame.Rect(ship_x + SHIP_WIDTH, ship_y + SHIP_HEIGHT//2 - BULLET_HEIGHT//2, BULLET_WIDTH, BULLET_HEIGHT))

        # Move bullets
        for b in bullets:
            b.x += bullet_speed
        bullets = [b for b in bullets if b.x < WIDTH]

        # Spawn obstacles
        spawn_timer += 1
        if spawn_timer >= OBSTACLE_SPAWN_RATE:
            spawn_timer = 0
            y = random.randint(0, HEIGHT - ASTEROID_HEIGHT)
            asteroids.append(pygame.Rect(WIDTH, y, ASTEROID_WIDTH, ASTEROID_HEIGHT))

        # Move asteroids
        for a in asteroids:
            a.x -= asteroid_speed
        asteroids = [a for a in asteroids if a.x + ASTEROID_WIDTH > 0]

        # Collisions: bullets vs asteroids
        to_remove_bullets, to_remove_asteroids = [], []
        for i, a in enumerate(asteroids):
            for j, b in enumerate(bullets):
                if a.colliderect(b):
                    to_remove_asteroids.append(i)
                    to_remove_bullets.append(j)
                    score += 1
        # Remove destroyed
        bullets = [b for j, b in enumerate(bullets) if j not in to_remove_bullets]
        asteroids = [a for i, a in enumerate(asteroids) if i not in to_remove_asteroids]

        # Collisions: ship vs asteroid
        for a in asteroids:
            if pygame.Rect(ship_x, ship_y, SHIP_WIDTH, SHIP_HEIGHT).colliderect(a):
                print("Game Over! Final Score:", score)
                pygame.time.delay(2000)
                return

        draw_window()

if __name__ == "__main__":
    main()