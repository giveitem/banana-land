import config from './config.json'

const getAuroraTable = async () => {
    let basic = `http://${config.server_host}:${config.server_port}/rds`;
    //console.log(basic);
    var res = await fetch(basic, {
        method: 'GET',
    })
    var ans = await res.json()
    //console.log(ans)
    return ans.result;
}

const getChangeDBResult = async () => {
    let basic = `http://${config.server_host}:${config.server_port}/changeDB`;
    //console.log(basic);
    var res = await fetch(basic, {
        method: 'GET',
    })
    var ans = await res.json()
    //console.log(ans)
    return ans.result;
}

export { getAuroraTable, getChangeDBResult }