const conection = require('../database/connection')
const crypto = require('crypto');

module.exports = {
    async create( request, response){
        const ong_id = request.headers.authorization;

        const {title, description, value } = request.body;    
        //conection
       const [id] = await conection('incidents').insert({
            title,
            description,
            value,
            ong_id
        })
    
        return response.json({id});
    },

    async index(request, response) {

        const { page = 1} = request.query;

        const [count] = await conection('incidents').count();

        const casos = await conection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page -1)*5)
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
        ]);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(casos);
    }, 

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;
        const incident = await conection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();

        if(incident.ong_id != ong_id){
            return response.status(401).json({error: 'Authorization not permitted'});
        }

        await conection('incidents').where('id', id).delete();

        return response.status(204).send();

    }
};