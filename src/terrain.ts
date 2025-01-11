export class Terrain {
    private matrix: string[][];
    private cycles: number;

    constructor(input: string[]) {
        // Validate all rows have same length
        const firstRowLength = input[0].length;
        if (!input.every(row => row.length === firstRowLength)) {
            throw new Error('All rows must have the same length');
        }

        // Convert strings to character arrays and validate
        const processedInput = input.map(row => row.split(''));
        if (!processedInput.every(row => row.every(cell => cell === '*' || cell === '.'))) {
            throw new Error('Invalid matrix content');
        }
        this.matrix = processedInput;
        this.cycles = 0;
    }

    nextDay(): void {
        const newMatrix = this.matrix.map(row => [...row]);
        
        // Traverse each row of the matrix
        for (let i = 0; i < this.matrix.length; i++) {
            // For each cell in the current row
            for (let j = 0; j < this.matrix[i].length; j++) {
                // Only process solid cells ('*')
                if (this.matrix[i][j] === '*') {
                    // Check if this cell has any empty neighbors ('.')
                    // Can be: left (j>0), right (j<width-1), above (i>0), or below (i<height-1)
                    if ((j > 0 && this.matrix[i][j-1] === '.') || 
                        (j < this.matrix[i].length-1 && this.matrix[i][j+1] === '.') ||
                        (i > 0 && this.matrix[i-1][j] === '.') ||
                        (i < this.matrix.length-1 && this.matrix[i+1][j] === '.')) {
                        // If cell has empty neighbor(s), it becomes empty too
                        newMatrix[i][j] = '.';
                    }
                }
            }
        }
        
        this.matrix = newMatrix;
        this.cycles++;
    }

    private isConnected(row: number, col: number, visited: boolean[][]): boolean {
        // Out of bounds or already visited or not a '*'
        if (row < 0 || row >= this.matrix.length || 
            col < 0 || col >= this.matrix[0].length || 
            visited[row][col] || 
            this.matrix[row][col] === '.') {
            return false;
        }

        visited[row][col] = true;

        // If we reached bottom row, we found a path
        if (row === this.matrix.length - 1) {
            return true;
        }

        // Check all adjacent cells (up, down, left, right)
        return this.isConnected(row + 1, col, visited) || // down
               this.isConnected(row - 1, col, visited) || // up
               this.isConnected(row, col + 1, visited) || // right
               this.isConnected(row, col - 1, visited);   // left
    }

    get isCollapsing(): boolean {
        // Create visited array
        const visited: boolean[][] = Array(this.matrix.length)
            .fill(false)
            .map(() => Array(this.matrix[0].length).fill(false));

        // Check each cell in top row
        for (let col = 0; col < this.matrix[0].length; col++) {
            if (this.matrix[0][col] === '*' && this.isConnected(0, col, visited)) {
                return false;
            }
        }

        return true;
    }

    get cycleCount(): number {
        return this.cycles;
    }

    predictCollapse(): number | null {
        // Create a copy of current terrain
        const simulatedMatrix = this.matrix.map(row => [...row]);
        const simulatedTerrain = new Terrain(simulatedMatrix.map(row => row.join('')));
        
        // Run simulation until collapse or max cycles (100)
        const MAX_CYCLES = 100;
        while (!simulatedTerrain.isCollapsing && simulatedTerrain.cycleCount < MAX_CYCLES) {
            simulatedTerrain.nextDay();
        }
        
        return simulatedTerrain.isCollapsing ? simulatedTerrain.cycleCount : null;
    }

    asTable(): string {
        const style = 'style="border: 1px solid black; width: 20px; height: 20px; text-align: center;"';
        const rows = this.matrix.map(row => {
            const cells = row.map(cell => `<td ${style}>${cell}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<table style="border-collapse: collapse;">${rows}</table>`;
    }

    toString(): string {
        return this.matrix.map(row => row.join('')).join('\n');
    }
}