const getA = new Promise((resolve, reject) => {
    //模拟异步任务
    setTimeout(function () {
        resolve("A");
    }, 1000)
})
//  .then(result => result)


const getB = new Promise((resolve, reject) => {
    setTimeout(function () {
        // resolve(3);
        resolve('B')
    }, 2000)
})
//  .then(result => result)

let start = new Date().getTime()
//  Promise.all([getA, getB]).then(data=>{
//      console.log(new Date().getTime() - start)
//      console.log(typeof data)
//      console.log(data)
//  })
//  .catch(e => console.log(e));

let all = new Promise((resolve, reject) => {
    Promise.all([getA, getB]).then(data => {
        // throw new Error("error on resolve")
        resolve(data)
    }).catch(e => {
        reject(e)
    });
})

all.then(result => {
    console.log(new Date().getTime() - start)
    console.log(typeof result)
    console.log(result)
}).catch(e => console.log(e))