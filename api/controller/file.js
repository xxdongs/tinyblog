const fs = require('fs');
const Formidable = require('formidable');
const config = require('../util/config')

class FileController {

    static async uploadFile(ctx, next) {
        let form = new Formidable()
        form.uploadDir = config.staticDir;
        form.keepExtensions = true;
        form.maxFileSize = config.maxFileSize;
        form.multiples = true;
        let loadimg = new Promise((reslove, reject) => {
            form.parse(ctx.req, (err, fields, files) => {
                if (err) {
                    reject(null)
                } else {
                    reslove(files.file.path)
                }
            });
        })
        let result = await loadimg
        if (result) {
            console.log("result " + result)
            ctx.status = 200
            ctx.body={avatar: result.split(/\\|\//).pop()}
            return
        }
        ctx.status = 444

        // let file = ctx.request.files.file;
        // let reader = fs.createReadStream(file.path);
        // // let tmp = file.name.split('.')
        // // let filename = `${tmp[0]}-${Math.random().toString(36).slice(2)}.${tmp[1]}`
        // let filename = file.name
        // let upStream = fs.createWriteStream(`./static/${filename}`)
        // reader.pipe(upStream);
        // ctx.body = {
        //     avatar: filename
        // }
        // ctx.status = 200
    }
}

module.exports = FileController