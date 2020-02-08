import random
from statistics import median

def generate_grid(width, height):

    grid = []

    if (width % 2) == 0:
        width -= 1
    if (height % 2) == 0:
        height -= 1

    full_row = []
    empty_row = []

    for column in range(0, width):
        full_row.append('#')
        if (column % 2) == 0:
            empty_row.append('#')
        else:
            empty_row.append('-')

    for row in range(0, height):
        if (row % 2) == 0:
            grid.append(full_row[:])
        else:
            grid.append(empty_row[:])

    return grid

def search_in_grid(grid, search):
    for row_number, row in enumerate(grid):
        for column_number, case in enumerate(row):
            if case == search:
                return [row_number, column_number]
    return None

def generate_maze(width, height):

    if (width % 2) == 0:
        width -= 1
    if (height % 2) == 0:
        height -= 1

    grid = generate_grid(width, height)

    history = []

    position = [1,1]

    while search_in_grid(grid, '-'):

        grid[position[0]][position[1]] = ' '

        possibilities = []
        walls = []

        try:
            if grid[position[0]-2][position[1]] == '-':
                possibilities.append([position[0]-2,position[1]])
        except:
            pass

        try:
            if grid[position[0]][position[1]+2] == '-':
                possibilities.append([position[0],position[1]+2])
        except:
            pass

        try:
            if grid[position[0]+2][position[1]] == '-':
                possibilities.append([position[0]+2,position[1]])
        except:
            pass
        
        try:
            if grid[position[0]][position[1]-2] == '-':
                possibilities.append([position[0],position[1]-2])
        except:
            pass

        if len(possibilities) > 0:
            history.append(position)
            next_position = random.choice(possibilities)
            wall_row = round(median([position[0],next_position[0]]))
            wall_column = round(median([position[1],next_position[1]]))
            grid[wall_row][wall_column] = ' '
            position = next_position
        else:
            position = history.pop()

    return grid

def open_maze(maze, step=4):
    for row in range(1,len(maze)-1, step):
        for column in range(1,len(maze[0])-1):
            maze[row][column] = ' '
    for row in range(1,len(maze)-1):
        for column in range(1,len(maze[0])-1, step):
            maze[row][column] = ' '
    return maze