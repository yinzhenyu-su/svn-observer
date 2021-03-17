let { matchSVNInfoRev, matchSVNLogRev } = require('../lib/svn/svn-utils');
let iconv = require('iconv-lite');
let remote_utf8ChStr = `路径: .
工作副本根目录: /root/xxxxx
URL: https://xxx.xxx.xxx/xxx
Relative URL: ^/
版本库根: https://xxx.xxx.xxx/xxx
版本库 UUID: ce59bbe4-f623-11e9-85da-5d21c543291e
版本: 700
节点种类: 目录
调度: 正常
最后修改的作者: yinzhenyu
最后修改的版本: 700
最后修改的时间: 2021-03-17 13:17:17 +0800 (三, 2021-03-17)`;

let remote_cp936ChStr = iconv.encode(remote_utf8ChStr, 'cp936');

let remote_utf8Str = `Path: .
Working Copy Root Path: C:\\Users\\Robot\\Code\\xxx
URL: https://xxx.xxx.xxx/xxx
Relative URL: ^/
Repository Root: https://xxx.xxx.xxx/xxx
Repository UUID: ce59bbe4-f623-11e9-85da-5d21c543291e
Revision: 700
Node Kind: directory
Schedule: normal
Last Changed Author: yinzhenyu
Last Changed Rev: 700
Last Changed Date: 2021-01-12 13:54:39 +0800 (周二, 12 1月 2021)`;

let remote_cp936Str = iconv.encode(remote_utf8Str, 'cp936');

let local_utf8Str = `------------------------------------------------------------------------
r700 | yinzhenyu | 2021-03-17 13:17:17 +0800 (周三, 17 3月 2021) | 1 line

EVALUATE-857
------------------------------------------------------------------------
`;

let local_cp936Str = iconv.encode(local_utf8Str, 'cp936');

let a = matchSVNLogRev(local_cp936Str)

let b = matchSVNLogRev(local_utf8Str)

let c = matchSVNInfoRev(remote_cp936ChStr)

let d = matchSVNInfoRev(remote_cp936Str)

let e = matchSVNInfoRev(iconv.encode(remote_utf8ChStr, 'utf8'))

let f = matchSVNInfoRev(remote_utf8Str)

console.log([a,b,c,d,e,f])