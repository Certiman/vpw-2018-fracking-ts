export class Terrain {
    private matrix: string[][];
    private cycles: number;
    private visited: boolean[][] | null = null;
    private visitedPath: boolean[][] | null = null;

    constructor(input: string[]) {
        // Validate all rows have same length
        const firstRowLength = input[0].length;
        if (!input.every((row) => row.length === firstRowLength)) {
            throw new Error('All rows must have the same length');
        }

        // Convert strings to character arrays and validate
        const processedInput = input.map((row) => row.split(''));
        if (!processedInput.every((row) => row.every((cell) => cell === '*' || cell === '.'))) {
            throw new Error('Invalid matrix content');
        }
        this.matrix = processedInput;
        this.cycles = 0;
        // this.visited = Array(input.length)
        //     .fill(false)
        //     .map(() => Array(input[0].length).fill(false));
        this.resetVisited();
        this.setVisitedPath();
    }

    nextDay(): void {
        const newMatrix = this.matrix.map((row) => [...row]);

        // Traverse each row of the matrix
        for (let i = 0; i < this.matrix.length; i++) {
            // For each cell in the current row
            for (let j = 0; j < this.matrix[i].length; j++) {
                // Only process solid cells ('*')
                if (this.matrix[i][j] === '*') {
                    // Check if this cell has any empty neighbors ('.')
                    // Can be: left (j>0), right (j<width-1), above (i>0), or below (i<height-1)
                    if (
                        (j > 0 && this.matrix[i][j - 1] === '.') ||
                        (j < this.matrix[i].length - 1 && this.matrix[i][j + 1] === '.') ||
                        (i > 0 && this.matrix[i - 1][j] === '.') ||
                        (i < this.matrix.length - 1 && this.matrix[i + 1][j] === '.')
                    ) {
                        // If cell has empty neighbor(s), it becomes empty too
                        newMatrix[i][j] = '.';
                    }
                }
            }
        }

        this.matrix = newMatrix;
        this.cycles++;
    }

    /**
     * Performs depth-first search to find a connected path of '*' cells from current position to bottom row
     * @param row Current row position in matrix
     * @param col Current column position in matrix
     * @returns true if path exists to bottom row, false otherwise
     */
    private isConnected(row: number, col: number): boolean {
        if (
            row < 0 ||
            row >= this.matrix.length ||
            col < 0 ||
            col >= this.matrix[0].length ||
            this.visited![row][col] ||
            this.matrix[row][col] === '.'
        ) {
            return false;
        }

        this.visited![row][col] = true;

        if (row === this.matrix.length - 1) {
            return true;
        }

        return (
            this.isConnected(row + 1, col) ||
            this.isConnected(row - 1, col) ||
            this.isConnected(row, col + 1) ||
            this.isConnected(row, col - 1)
        );
    }

    /**
     * Stores current visited matrix as last valid state
     * Called when no collapsing path is found to preserve visualization
     */
    private setVisitedPath(): void {
        this.visitedPath = this.visited!.map((row) => [...row]);
    }

    /**
     * Resets visited matrix to track new path finding attempt
     * Called at start of isCollapsing check
     */
    private resetVisited(): void {
        this.visited = Array(this.matrix.length)
            .fill(false)
            .map(() => Array(this.matrix[0].length).fill(false));
    }

    get storedVisited(): boolean[][] {
        return this.visitedPath!.map((row) => [...row]);
    }

    // set visitedPath(value: (boolean)[][]) {
    //     this.visitedPath = value.map((row) => [...row]);
    // }

    get isCollapsing(): boolean {
        this.resetVisited();
        let pathFound = false;
        let bestVisited: boolean[][] | null = null;

        for (let col = 0; col < this.matrix[0].length; col++) {
            if (this.matrix[0][col] === '*' && this.isConnected(0, col)) {
                if (!pathFound) bestVisited = this.visited!.map(row => [...row]);
                pathFound = true;
                this.resetVisited();  // Reset for next column check
            }
        }

        if (bestVisited) {
            this.visitedPath = bestVisited;
        } else {
            this.visitedPath = this.visited;
        }

        return !pathFound;
    }

    get cycleCount(): number {
        return this.cycles;
    }

    predictCollapse(): number | null {
        // Create a copy of current terrain
        const simulatedMatrix = this.matrix.map((row) => [...row]);
        const simulatedTerrain = new Terrain(simulatedMatrix.map((row) => row.join('')));

        // Run simulation until collapse or max cycles (100)
        const MAX_CYCLES = 100;
        while (!simulatedTerrain.isCollapsing && simulatedTerrain.cycleCount < MAX_CYCLES) {
            simulatedTerrain.nextDay();
        }

        return simulatedTerrain.isCollapsing ? simulatedTerrain.cycleCount : null;
    }

    get asTable(): string {
        const baseStyle = 'border: 1px solid black; width: 20px; height: 20px; text-align: center;';
        const visited = this.visitedPath;
        const rows = this.matrix
            .map((row, i) => {
                const cells = row
                    .map((cell, j) => {
                        const bgColor = visited![i][j] ? 'background-color: lightgreen;' : '';
                        const style = `style="${baseStyle}${bgColor}"`;
                        return `<td ${style}>${cell}</td>`;
                    })
                    .join('');
                return `<tr>${cells}</tr>`;
            })
            .join('');

        return `<table style="border-collapse: collapse;">${rows}</table>`;
    }

    toString(matrix?: (string | boolean)[][]): string {
        const targetMatrix = matrix ?? this.matrix;
        return targetMatrix
            .map((row) =>
                row.map((cell) => (typeof cell === 'boolean' ? (cell ? 'T' : 'F') : cell)).join('')
            )
            .join('\n');
    }
}
