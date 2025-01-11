import { Terrain } from './terrain';
import * as fs from 'fs';

export class Parser {
    private static async readFile(filename: string): Promise<string> {
        try {
            // Try Node.js fs first
            return fs.readFileSync(filename, 'utf-8');
        } catch (e) {
            // Fallback to fetch
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Failed to load file: ${filename}`);
            }
            return response.text();
        }
    }

    static async parseSolution(filename: string): Promise<number[]> {
        const content = await this.readFile(filename);
        const lines = content
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        return lines.map((line) => {
            const [_, solution] = line.split(' ').map(Number);
            return solution;
        });
    }

    static async parseFile(filename: string): Promise<Terrain[]> {
        const content = await this.readFile(filename);
        const lines = content.split('\n').map((line) => line.trim());

        const terrains: Terrain[] = [];
        let currentLine = 0;

        // Read number of test cases
        const numCases = parseInt(lines[currentLine++]);

        console.log(`parseFile: Number of test cases: ${numCases}, read ${lines.length} lines.`);
        for (let i = 0; i < numCases; i++) {
            // Read dimensions
            const rows = parseInt(lines[currentLine++]);
            const cols = parseInt(lines[currentLine++]);
            // console.log(
            //     `parseFile() : Reading terrain ${
            //         i + 1
            //     } of ${numCases} with ${rows} rows and ${cols} columns`
            // );

            // Read terrain matrix
            const terrainRows: string[] = [];
            for (let j = 0; j < rows; j++) {
                terrainRows.push(lines[currentLine++]);
            }

            // Create new terrain instance
            terrains.push(new Terrain(terrainRows));
        }

        return terrains;
    }
}
