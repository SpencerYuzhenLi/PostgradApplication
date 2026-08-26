import {
    execFileSync,
    spawnSync,
} from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repositoryDirectory =
    fileURLToPath(
        new URL('../../', import.meta.url)
    )

const dataFile =
    'frontend/public/data/referee-programmes.json'

function run(command, args) {
    execFileSync(
        command,
        args,
        {
            cwd: repositoryDirectory,
            stdio: 'inherit',
        }
    )
}

try {
    const diffResult =
        spawnSync(
            'git',
            [
                'diff',
                '--quiet',
                '--',
                dataFile,
            ],
            {
                cwd: repositoryDirectory,
            }
        )

    if (diffResult.status === 0) {
        console.log(
            'No referee data changes to publish.'
        )

        process.exit(0)
    }

    if (diffResult.status !== 1) {
        throw new Error(
            'Could not check referee data changes.'
        )
    }

    console.log(
        '\nChanges to be published:\n'
    )

    run(
        'git',
        [
            'diff',
            '--',
            dataFile,
        ]
    )

    run(
        'git',
        [
            'add',
            dataFile,
        ]
    )

    run(
        'git',
        [
            'commit',
            '-m',
            'Update referee programme data',
        ]
    )

    run(
        'git',
        ['push']
    )

    console.log(
        '\nReferee data published.'
    )
} catch (error) {
    console.error(
        '\nCould not publish referee data:',
        error instanceof Error
            ? error.message
            : error
    )

    process.exitCode = 1
}