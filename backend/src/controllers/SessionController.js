const conection = require('../database/connection')
const crypto = require('crypto');

module.exports = {

    async create(request, response){
        
        const {id } = request.body; 
        const ong  = await conection('ongs')
            .where('id', id)
            .select('name')
            .first();

        if(!ong){
            return response.status(400).json({error: 'No Ong found with this Id'});
        }


        return response.json(ong);
    }


}