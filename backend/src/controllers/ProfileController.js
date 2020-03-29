const conection = require('../database/connection')
const crypto = require('crypto');

module.exports = {
    async index(request, response) {
        const ong_id = request.headers.authorization;
        const casos = await conection('incidents')
        .where('ong_id', ong_id)
        .select('*');
        return response.json(casos);
    }
};