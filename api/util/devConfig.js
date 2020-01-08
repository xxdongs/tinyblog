
const Config = {
    isDev: true,

    db: {
        // default is 10
        connectionLimit: 20,
        host: '127.0.0.1',
        user: 'edgar',
        password: '1234',
        port: 3306,
        database: 'blog'
    },
}

module.exports = Config