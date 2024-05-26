import random
import time
import curses


def main(stdscr):
    curses.curs_set(0)  # Hide the cursor
    stdscr.nodelay(1)   # Make `getch` non-blocking
    stdscr.timeout(100)  # Refresh rate (adjust for difficulty)

    curses.start_color()
    curses.init_pair(1, curses.COLOR_GREEN, curses.COLOR_BLACK)  # Snake color
    curses.init_pair(2, curses.COLOR_RED, curses.COLOR_BLACK)   # Food color
    curses.init_pair(3, curses.COLOR_YELLOW, curses.COLOR_BLACK)  # Score color

    sh, sw = stdscr.getmaxyx()
    snake = [[sh//2, sw//2], [sh//2, sw//2-1], [sh//2, sw//2-2]]
    food = [sh//2, sw//2+2]

    score = 0
    direction = curses.KEY_RIGHT

    while True:
        key = stdscr.getch()
        if key in [curses.KEY_UP, curses.KEY_DOWN, curses.KEY_LEFT, curses.KEY_RIGHT]:
            if (key == curses.KEY_UP and direction != curses.KEY_DOWN) or \
               (key == curses.KEY_DOWN and direction != curses.KEY_UP) or \
               (key == curses.KEY_LEFT and direction != curses.KEY_RIGHT) or \
               (key == curses.KEY_RIGHT and direction != curses.KEY_LEFT):
                direction = key

        head = snake[0]
        if direction == curses.KEY_UP:
            head = [head[0]-1, head[1]]
        if direction == curses.KEY_DOWN:
            head = [head[0]+1, head[1]]
        if direction == curses.KEY_LEFT:
            head = [head[0], head[1]-1]
        if direction == curses.KEY_RIGHT:
            head = [head[0], head[1]+1]

        snake.insert(0, head)
        if head == food:
            score += 1
            food = None
            while food is None:
                new_food = [random.randint(1, sh-2), random.randint(1, sw-2)]
                food = new_food if new_food not in snake else None
        else:
            snake.pop()

        if snake[0][0] in [0, sh] or snake[0][1] in [0, sw] or snake[0] in snake[1:]:
            break

        stdscr.clear()
        stdscr.addstr(0, 2, f"Score: {score}",
                      curses.color_pair(3))  # Yellow score
        for y, x in snake:
            stdscr.addstr(y, x, "#", curses.color_pair(1))  # Green snake
        stdscr.addstr(food[0], food[1], "*", curses.color_pair(2))  # Red food
        stdscr.refresh()

    stdscr.addstr(sh//2, sw//2-4, "Game Over!")
    stdscr.getch()


curses.wrapper(main)
