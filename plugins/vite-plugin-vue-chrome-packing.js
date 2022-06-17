
// export default () => {
//     return {

//     }
// }

export default function myExample() {
    // 返回的时插件对象
    return {
        name: 'chrome:packing',
        enforce: 'post',
        buildStart() {
            console.log('buildStart')
        },
        // id确认
        resolveId(source) {
            console.log("[debug]source:", source)
            console.log('source')
            if (source === 'virtual-module') {
                return source // 返回source 表明命中，vite不在询问其他插件处理该id请求
            }
            return null // 返回null 表明是其他id要继续处理
        },
        // 加载模块代码
        load(id) {
            console.log("[debug]id:", id)
            if (id === 'virtual-module') {
                return 'export default "This is virtual!"'
            }
            return null
        },
        // 转换
        transform(code, id) {
            if (id === 'virtual-module') {
                console.log('transform', code)
            }
            return code
        }
    }
}