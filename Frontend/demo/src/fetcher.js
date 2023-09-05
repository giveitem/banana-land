import config from './config.json';

const getAuroraTable = async() => {
    let basic = `http://${config.server_host}:${config.server_port}/rds`;
    //console.log(basic);
    var res = await fetch(basic, {
        method: 'GET',
    })
    var ans = await res.json()
        //console.log(ans)
    return ans.result;
}

const getChangeDBResult = async() => {
    let basic = `http://${config.server_host}:${config.server_port}/changeDB`;
    //console.log(basic);
    var res = await fetch(basic, {
        method: 'GET',
    })
    var ans = await res.json()
        //console.log(ans)
    return ans.result;
}

const getDynamoDBTable = async() => {
    let basic = `http://${config.server_host}:${config.server_port}/ddb`;
    //console.log(basic);
    var res = await fetch(basic, {
        method: 'GET',
    })
    var ans = await res.json()
        //console.log(ans)
    return ans.result;
}

const getCurrentTable = async() => {
    if (config.use_change_db) {
        config.use_change_db = false
    } else {
        config.use_change_db = true
    }
    if (config.use_change_db) {
        // Use getChangeDBResult if the feature flag is true
        return await getDynamoDBTable();
    } else {
        // Use getAuroraTable if the feature flag is false
        return await getAuroraTable();
    }
}

// function updateToggleConfig(){
//     if (config.use_change_db) {
//        config.use_change_db = false
//     } else {
//         config.use_change_db = true
//     }
// }

export { getAuroraTable, getChangeDBResult, getCurrentTable, getDynamoDBTable };
