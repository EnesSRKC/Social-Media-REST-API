const Tag = require('../models/tags');

module.exports.tags_get_all = (req, res, next) => {
    Tag.find().then(tags => {
        const response = {
            count: tags.length,
            tags: tags
        }
        res.status(200).end(JSON.stringify(response, null, 4));
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}