'use strict';

const https = require('https');

const corp_id = '';
const corp_secret = '';

var get_access_token = (cb) => {
  https.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=' + corp_id + '&corpsecret=' + corp_secret, (response) => {
    var result = "";
    response.on('data', (data) => {
      result += data;
    });

    response.on('end', () => {
      var access_token = JSON.parse(result)['access_token'];
      cb(access_token);
    });
  }).on('error', (e) => {
    console.log(e);
    cb(e);
  });
}

var wechat_send_data = (subject, content) => {

  var data = JSON.stringify({
    "touser": "",
    "toparty": "1",
    "totag": "",
    "agentid": 0,
    "msgtype": "text",
    "text": {
      "content": subject + "\n" + content
    },
    "safe": 0
  });

  get_access_token((access_token) => {
    var options = {
      host: 'qyapi.weixin.qq.com',
      path: '/cgi-bin/message/send?debug=1&access_token=' + access_token,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Length': data.length
      }
    };

    var req = https.request(options, (response) => {
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        console.log("Response:", chunk);
      });
    });

    req.on('error', (e) => {
      console.log("Error: ", e);
    });

    req.write(data);

    req.end();
  });

}

exports.wechat_send_data = wechat_send_data;
