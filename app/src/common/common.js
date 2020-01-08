import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import moment from 'moment';
import 'moment/locale/zh-cn';

export function initCommon(Vue) {
    Vue.config.productionTip = false
    Vue.use(Antd)
    Antd.openNotificationWithIcon
    dateFormat()
    moment.locale('zh-cn');
}

function dateFormat() {
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, // 月份
            "d+": this.getDate(), // 日
            "h+": this.getHours(), // 小时
            "m+": this.getMinutes(), // 分
            "s+": this.getSeconds(), // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
            "S": this.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}

export function openRouter({
    query = {},
    name = '',
    type = ''
} = {}) {
    let params = ''

    let formatQuery = query => {
        let params = ''

        if (query) {
            for (let item in query) {
                let vals = query[item]

                if (vals !== undefined) {
                    params += item + '=' + vals + '&'
                }
            }
        }

        params = params ? '?' + params : params

        return params
    }

    if (query) {
        params = formatQuery(query)
    }

    let homepath = `/${location.pathname.split('/')[1]}/` // 获取单页前缀

    let url = `${homepath}${name}${params}` // 拼接url

    if (type === 'replace') {
        location.replace(url) // replace 跳转
    } else {
        location.href = url // href 跳转
    }
}