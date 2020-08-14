//公共函数
const getNum = value => value < 10 ? "0" + value : value;
//修改utc时间
export const getChinaTime = utctime => {
    //判定utictime是否是一个对象
    let time = typeof utctime == "string" ? new Date(utctime) : utctime
    // let time = new Date(utctime)
    return time.getFullYear() +
        "-" +
        getNum(time.getMonth() + 1) +
        "-" +
        getNum(time.getDate()) +
        " " +
        getNum(time.getHours()) +
        ":" +
        getNum(time.getMinutes()) +
        ":" +
        getNum(time.getSeconds());
}

export const getPicStr = str => str.substr(str.lastIndexOf("/") + 1)