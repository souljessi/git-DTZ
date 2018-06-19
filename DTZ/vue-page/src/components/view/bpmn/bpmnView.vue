<template>
  <div style="width: 100%;height:100%" ref="bpmnBody" class="bpmnCss">
    <div id="modeler" class="modeler" style="height: 100%">
      <div class="canvas" id="js-canvas" style="height: 100%"></div>
    </div>
  </div>

</template>

<script>
  import "bpmn-js/assets/bpmn-font/css/bpmn.css";
  import "bpmn-js/assets/bpmn-font/css/bpmn-embedded.css";
  import "bpmn-js/node_modules/diagram-js/assets/diagram-js.css";
  import BpmnModeler from 'bpmn-js/lib/NavigatedViewer'
//  import debounce from 'lodash/debounce';
  export default {
    data() {
      return {
        bpmnJS: {},//bpmn对象
        base:{
          id:'',
          name:''
        },
        variable:[],//{key:'', value:''}
        mainConfig:{},
        downVisible:true,
        selectElement:{}
      };
    },
    created: function () {

    },
    mounted: function () {

    },
    components: {},
    computed: {},
    methods: {
      //实例化bpmn
      initBpmn(){
        $('#js-canvas').html('');
        //实例化bpmn
        this.bpmnJS = new BpmnModeler({
          container: '#js-canvas'
        });
        // attach it to some element
//        let propertiesPanel = this.bpmnJS.get('propertiesPanel');
//        propertiesPanel.detach();

      },
      //导入bpmn文件
      importXmL(xml) {
        let self=this;
        this.initBpmn();
        let str=this.byteToString(xml.data)
        this.bpmnJS.importXML(str, function (err) {
          if (err) {
            console.log('error rendering', err);
          } else {
            console.log('rendered');
          }

        });
      },
      //byte转字符串
      byteToString(arr) {
        if(typeof arr === 'string') {
          return arr;
        }
        var str = '',
          _arr = arr;
        for(var i = 0; i < _arr.length; i++) {
          var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
          if(v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for(var st = 1; st < bytesLength; st++) {
              store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
          } else {
            str += String.fromCharCode(_arr[i]);
          }
        }
        return str;
      },
      //设置编码
      setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);
        if (data) {
          link.addClass('active').attr({
            'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
            'download': name
          });
        } else {
          link.removeClass('active');
        }
      },
      //保存svg
      saveSVG(done) {
        this.bpmnJS.saveSVG(done);
      },
      //保存svg
      saveDiagram(done) {
        this.bpmnJS.saveXML({ format: true }, function(err, xml) {
          done(err, xml);
        });
      },
      //得到任务的xml文件
      async getTaskXml(proc_id){
        try{
          const res = await this.$http.post('/bpmn/BpmnController/queryAgencyView', {proc_id: proc_id});
          if (res.data && res.data.success) {
            this.setImportXml(res.data.result.xml[0],res.data.result.actInstArr);
          }else{
            this.$message.error(res.data.msg);
          }
        }catch(err){
          this.$message.error('查询错误！'+err);
        }
      },
      setImportXml(xml,data){
        this.initBpmn();
        this.downVisible=false;
        let self=this;
        let str=this.byteToString(xml.bytes.data)
        this.bpmnJS.importXML(str, function (err) {
          let canvas = self.bpmnJS.get('canvas');
          for(let i=0;i<data.length;i++){
            canvas.addMarker(data[i].proc_element_id, 'highlight');
          }
          if (err) {
            console.log('error rendering', err);
          } else {
            console.log('rendered');
          }

        });
      }
    }
  }
</script>

<style >
  .bpmnCss a:link {
    text-decoration: none;
  }

  .bpmnCss .content, .bpmnCss
  .content > div {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .bpmnCss .content > .message {
    text-align: center;
    display: table;

    font-size: 16px;
    color: #111;
  }

  .bpmnCss .content > .message .note {
    vertical-align: middle;
    text-align: center;
    display: table-cell;
  }

  .bpmnCss .content .error .details {
    max-width: 500px;
    font-size: 12px;
    margin: 20px auto;
    text-align: left;
  }

  .bpmnCss .content .error pre {
    border: solid 1px #CCC;
    background: #EEE;
    padding: 10px;
  }

  .bpmnCss .content:not(.with-error) .error,
  .bpmnCss .content.with-error .intro,
  .bpmnCss .content.with-diagram .intro {
    display: none;
  }

  .bpmnCss .content .canvas,
  .bpmnCss .content.with-error .canvas {
    visibility: hidden;
  }

  .bpmnCss .content.with-diagram .canvas {
    visibility: visible;
  }

  .bpmnCss .buttons {
    position: absolute;
    bottom: 20px;
    left: 20px;

    padding: 0;
    margin: 0;
    list-style: none;
  }

  .bpmnCss .buttons > li {
    display: inline-block;
    margin-right: 10px;
  }

  .bpmnCss .buttons > li > a {
    background: #DDD;
    border: solid 1px #666;
    display: inline-block;
    padding: 5px;
  }

  .bpmnCss .buttons a {
    opacity: 0.3;
  }

  .bpmnCss .buttons a.active {
    opacity: 1.0;
  }


  .bpmnCss .io-control-list.io-horizontal, .bpmnCss  .io-control-list.io-horizontal li {
    display: inline-block;
  }

  .bpmnCss .io-control-list {
    list-style: none;
    padding: 5px;
    margin: 0;
  }

  .bpmnCss .io-control-list.io-horizontal, .bpmnCss .io-control-list.io-horizontal li {
    display: inline-block;
  }


  .bpmnCss .bjs-powered-by, .cjs-powered-by, .io-control {
    background: #FFF;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    padding: 5px;
  }

  .bpmnCss .io-control-list a, .io-control-list a:visited, .io-control-list button {
    padding: 0;
    outline: none;
    cursor: pointer;
    font-size: 22px;
    line-height: 26px;
    color: #555555;
    background: none;
    border: none;
  }


  .bpmnCss .io-import-export {
    position: fixed;
    bottom: 25px;
    left: 20px;
  }


  .bpmnCss .io-control-list.io-horizontal, .io-control-list.io-horizontal li {
    display: inline-block;
  }

  .bpmnCss  .io-control-list {
    list-style: none;
    padding: 5px;
    margin: 0;
  }

  .bpmnCss .bjs-powered-by,.bpmnCss .cjs-powered-by,.bpmnCss .io-control {
    background: #FFF;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    padding: 5px;
  }

  .bpmnCss .io-control-list a,.bpmnCss .io-control-list a:visited,.bpmnCss .io-control-list button {
    padding: 0;
    outline: none;
    cursor: pointer;
    font-size: 22px;
    line-height: 26px;
    color: #555555;
    background: none;
    border: none;
  }


  .bpmnCss .content,
  .bpmnCss .content > div {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .bpmnCss  .content > .message {
    text-align: center;
    display: table;

    font-size: 16px;
    color: #111;
  }

  .bpmnCss .content > .message .note {
    vertical-align: middle;
    text-align: center;
    display: table-cell;
  }

  .bpmnCss .content .error .details {
    max-width: 500px;
    font-size: 12px;
    margin: 20px auto;
    text-align: left;
  }

  .bpmnCss .content .error pre {
    border: solid 1px #CCC;
    background: #EEE;
    padding: 10px;
  }

  .bpmnCss .content:not(.with-error) .error,
  .bpmnCss .content.with-error .intro,
  .bpmnCss .content.with-diagram .intro {
    display: none;
  }


  .bpmnCss .content .canvas,
  .bpmnCss .content.with-error .canvas {
    visibility: hidden;
  }

  .bpmnCss .content.with-diagram .canvas {
    visibility: visible;
  }

  .bpmnCss .buttons {
    position: absolute;
    bottom: 20px;
    left: 20px;

    padding: 0;
    margin: 0;
    list-style: none;
  }

  .bpmnCss .buttons > li {
    display: inline-block;
    margin-right: 10px;
  }
  .bpmnCss .buttons > li > a {
    background: #DDD;
    border: solid 1px #666;
    display: inline-block;
    padding: 5px;
  }

  .bpmnCss .buttons a {
    opacity: 0.3;
  }

  .bpmnCss  .buttons a.active {
    opacity: 1.0;
  }

  .bpmnCss .highlight .djs-visual > :nth-child(1) {
    stroke: red !important; /* color elements as green */
  }

  .bjs-powered-by{
    display: none;
  }
  .bpmnDialog .el-dialog__body {
    position: absolute;
    top:40px;
    left:0;
    right:0;
    bottom:0px;
  }

</style>
