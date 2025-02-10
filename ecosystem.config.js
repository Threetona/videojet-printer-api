module.exports = {
    apps: [
        {
            name: 'Videojet',
            script: 'npm',
            args: 'start',
            watch: false,
            instances: 1,
            autorestart: true,
            exec_mode: 'fork',
            max_memory_restart: '50G',
            env: {
                NODE_ENV: 'production',
            },
            post_start: ['npm install', 'npm run build'],
        },
    ],
};
