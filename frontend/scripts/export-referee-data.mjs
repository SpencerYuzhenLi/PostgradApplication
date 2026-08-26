import {
    mkdir,
    writeFile,
} from 'node:fs/promises'

const endpoint =
    'http://localhost:8080/api/referee-programmes'

const outputDirectory =
    new URL('../public/data/', import.meta.url)

const outputFile =
    new URL(
        'referee-programmes.json',
        outputDirectory
    )

try {
    const response =
        await fetch(endpoint)

    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status}`
        )
    }

    const programmes =
        await response.json()

    await mkdir(
        outputDirectory,
        { recursive: true }
    )

    await writeFile(
        outputFile,
        `${JSON.stringify(
            programmes,
            null,
            2
        )}\n`,
        'utf8'
    )

    console.log(
        `Exported ${programmes.length} referee programmes.`
    )
} catch (error) {
    console.error(
        'Could not export referee programme data:',
        error instanceof Error
            ? error.message
            : error
    )

    process.exitCode = 1
}