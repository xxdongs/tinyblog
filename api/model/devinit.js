const faker = require('faker')
const labelModel = require('./label')
const articleModel = require('./article')
const commentModel = require('./comment')
const { randomList } = require('../util/util')


const genLabels = async function () {
    const labels = ['Android', 'Java', 'JavaScript', 'Python', 'Security']
    let all = []
    for (let i = 0; i < labels.length; i++) {
        all.push(await labelModel.addLabel(labels[i]))
    }
    let results = await Promise.all(all)
    if (results.filter(val => val).length != labels.length) {
        let all = await labelModel.getAllLabels()
        return all.map(val => val.id)
    }
    return results.map(val => val.insertId)
}

const genArticles = async function (count) {
    let label_ids = await genLabels()
    if (label_ids.length === 0) {
        return
    }
    let add = async function (random_labels, data) {
        let results = await articleModel.addArticle(data)
        if (!results || results.affectedRows <= 0) return
        await labelModel.bindLabel(results.insertId, random_labels)

        let comment_count = Math.random() * 21;
        let comments = []
        for (let i = 0; i < comment_count; i++) {
            comments.push(commentModel.addComment({
                article_id: results.insertId,
                nickname: faker.name.firstName(),
                content: faker.lorem.text()
            }))
        }
        await Promise.all(comments)
    }
    let all = []
    for (let i = 0; i < count; i++) {
        all.push(add(randomList(label_ids), {
            title: faker.name.findName(),
            content: faker.lorem.text(),
        }))
    }
    await Promise.all(all)
}

const deleteTabels = async function () {
    await labelModel.query("SET foreign_key_checks=0;", null)
    await labelModel.query("TRUNCATE User;", null)
    await labelModel.query("TRUNCATE Article;", null)
    await labelModel.query("TRUNCATE Label;", null)
    await labelModel.query("TRUNCATE ArticleLabel;", null)
    await labelModel.query("TRUNCATE Comment;", null)
    await labelModel.query("SET foreign_key_checks=1;", null)

}

module.exports = {
    genArticles
}


deleteTabels().then(val => genArticles(1000))

// genArticles(100)



