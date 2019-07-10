
export const faceUtils = {
  alt: [
    '[微笑]',
    '[嘻嘻]',
    '[哈哈]',
    '[可爱]',
    '[可怜]',
    '[挖鼻]',
    '[吃惊]',
    '[害羞]',
    '[挤眼]',
    '[闭嘴]',
    '[鄙视]',
    '[爱你]',
    '[泪]',
    '[偷笑]',
    '[亲亲]',
    '[生病]',
    '[太开心]',
    '[白眼]',
    '[右哼哼]',
    '[左哼哼]',
    '[嘘]',
    '[衰]',
    '[委屈]',
    '[吐]',
    '[哈欠]',
    '[抱抱]',
    '[怒]',
    '[疑问]',
    '[馋嘴]',
    '[拜拜]',
    '[思考]',
    '[汗]',
    '[困]',
    '[睡]',
    '[钱]',
    '[失望]',
    '[酷]',
    '[色]',
    '[哼]',
    '[鼓掌]',
    '[晕]',
    '[悲伤]',
    '[抓狂]',
    '[黑线]',
    '[阴险]',
    '[怒骂]',
    '[互粉]',
    '[心]',
    '[伤心]',
    '[猪头]',
    '[熊猫]',
    '[兔子]',
    '[ok]',
    '[耶]',
    '[good]',
    '[NO]',
    '[赞]',
    '[来]',
    '[弱]',
    '[草泥马]',
    '[神马]',
    '[囧]',
    '[浮云]',
    '[给力]',
    '[围观]',
    '[威武]',
    '[奥特曼]',
    '[礼物]',
    '[钟]',
    '[话筒]',
    '[蜡烛]',
    '[蛋糕]'
  ],
  faces: function () {
    const self = this
    const arr = {}
    for (let i = 0; i < self.alt.length; i++) {
      arr[self.alt[i]] = '/face/' + i + '.png'
    }
    return arr
  }
}

export function transform (content) {
  // 支持的html标签
  const html = function (end) {
    return new RegExp('\\n*\\[' + (end || '') + '(code|pre|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)]\\n*', 'g')
  }
  const fa = faceUtils.faces()
  if (content) {
    content = content
      .replace(/face\[([^\s\[\]]+?)]/g, function (face) {
        // 转义表情
        const alt = face.replace(/^face/g, '')
        return '<img height="24px" width="24px" alt="' + fa[alt] + '" title="' + fa[alt] + '" src="' + fa[alt] + '">'
      })
      .replace(html('/'), '</$1>') // 转移HTML代码
      .replace(/\n/g, '<br>') // 转义换行
  }
  return content
}
