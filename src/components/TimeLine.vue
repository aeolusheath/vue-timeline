<template>
  <div class="container">

    <div class="version-no">
      <div class="common-title">
        <button @click="removeCurrentNode">
          delete currentItem
        </button>
      </div>
      <div class="time-line-wrapper" >

        <template v-if="allNodes.length!==0">
          <div :class='["move-tag-wrapper to-left", disableLeft? "disable": ""]'>
            <a class="move-tag left" @click="toLeft">
              <i class="fa fa-angle-double-left"> </i>
            </a>

          </div>

          <div id="UlWrapper" :style="allNodes.length==0? 'padding-top:38px': `transform: translateX(-${lineOffset}px)`">

            <ul style="text-align:left" class="blueprint-line" :style="{minWidth: '100%', width: (liWidth*allNodes.length + 1500) + 'px'}">
              <li :style="{width: liWidth+'px', top: '18px'}" v-for="(item, index) in allNodes" >
                  
                <span style="left:0; right: 0" class="date"> {{item.createTime}}</span>
                <a style="left:0; right: 0; position:absolute;" :class="['icon', currentNode.uuid==item.uuid?'active': '']" @click="activeOne(item)"  :uuid="item.uuid"> </a>
                <span class="name"> {{item.name}} </span>
              </li>

            </ul>
          </div>
          <div :class='["move-tag-wrapper to-right", disableRight? "disable": ""]'>
            <a class="move-tag right" @click="toRight">
              <i class="fa fa-angle-double-right"> </i>
            </a>

          </div>
        </template>
        <template v-else>
          <p>oops，暂无蓝图，请点击添加</p>
        </template>
      </div>
    </div>



  </div>
</template>
<style lang="scss">
  .container {
    min-height: 200px;
    padding: 5px 10px;
    margin-top: 10px;
  }
  .time-line-wrapper {
    padding: 0 30px;
    position: relative;
    width: 500px;
    // width: 97%;
    margin: 20px auto;
    overflow: hidden;
    #UlWrapper {
       padding-top: 20px;
       height: 80px;
       transition: all ease-out .4s
    }
    .move-tag-wrapper {
      background-color: white ;
      height:75px;
      width: 30px;
      position: absolute;
      display: inline-block;
    }
    .to-left{
      left: 0;
      top: 2px;
      z-index: 1;
    }
    .to-right.disable, .to-left.disable {
      a { cursor: auto; }
      i { color: #ddd; }
    }
    .to-right {
      right: 0px;
      top: 2px;
      z-index: 1;
    }
    .move-tag {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: white;
      display: inline-block;
      border-radius: 50%;
      text-align:center;
      font-size: 1.5em;
      line-height: 30px;
      cursor:pointer;
      &.right {
        position: absolute;
        right: 0px;
        top: 22px;
      }
      &.left {
        position: absolute;
        left: 0px;
        top: 21px;
      }
    }
    .blueprint-line {
      list-style: none;
      border-bottom: 2px dotted #ddd;
      padding-left: 0;
      font-size: 0;
      margin-bottom: 0;
      height: 18px;      
    }
    .blueprint-line > li {
      // min-width: 100px;
      font-size: 12px;
      display: inline-block;
      position: relative;
      top: 24px;
      text-align: center;
      border-top: 2px solid #6eaeec;
      .icon {
        display: inline-block;
        content: "";
        background-color:white;
        width: 14px;
        height: 14px;
        border: 1px solid #6eaeec;
        border-radius: 50%;
        position: absolute;
        top: -9px;
        cursor: pointer;
        right: 0; //绝对布局的水平居中处理
        left: 0;  //绝对布局的水平居中处理
        margin-left: auto; //绝对布局的水平居中处理
        margin-right: auto; //绝对布局的水平居中处理
      }
      .icon.active {
        background-color:#6eaeec;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        top: -11px;
        
      }
      .icon::before, icon.active::before {
        content: '';
        position: absolute;
        top: -5px;
        right: -5px;
        bottom: -5px;
        left: -5px;
      }
      .date {
        font-size: 12px;
        position: absolute;
        top: -34px;
        right: 45px;
      }
      .name {
        font-size: 12px;
        position: relative;
        top: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
  
        max-width: 100%;
        width: 100%;
        display: inline-block;
      }
    }
  }


</style>
<script type="text/javascript">
  import $ from 'jquery'
  import { debounce } from 'lodash'
  export default {
    data () {
      return {
        liWidth: 200,// 每个li标签的长度
        lineOffsetUnit: 0,//偏移的基本单位
        lineOffset: 0,//偏移量
        disableLeft: true,
        disableRight: true,
        page: 0,
        workingStatus: true,//删除的时候禁止调用setToRightBtn
        pageSize: 0,//每页的条数
        pages: 0,//一共多少页
        currentPage: 1, //当前位于第几页,
        offsetArr: [],
        allNodes: [
          {
            name: 'Kevin',
            createTime: '2017-08-09',
            uuid: 1
          },
          {
            name: 'Jack',
            createTime: '2017-08-09',
            uuid: 2
          },
          {
            name: 'Lucy',
            createTime: '2017-08-09',
            uuid: 3
          },
          {
            name: 'Lily',
            createTime: '2017-08-09',
            uuid: 4
          }
        ],
        currentNode: { uuid: 1}
      }
    },
    mounted() {
      this.$nextTick(()=>{
        this.setToRightBtn()
      })
    },
    watch: {
    },
    methods: {
      activeOne (one) {
        this.currentNode = this.allNodes.find(item=>item.uuid === one.uuid )
        console.log(this.currentNode.uuid, 'dddddddddddd')
      },
      removeCurrentNode () {
        let oldLength = this.allNodes.length        
        let index = this.allNodes.findIndex(item=>item.uuid === this.currentNode.uuid)
        console.log(index, 'indexxxx')
        this.allNodes.splice(index, 1)
        this.currentNode = this.allNodes[index++]
        this.workingStatus = false
        let  deleteItemIndex = index + 1
        //删除的是最后一页的唯一一个元素
        if( deleteItemIndex%this.pageSize===1 && deleteItemIndex===oldLength ) {
          this.currentPage --
          //如果是第一页  则不能向左
          this.disableLeft = this.currentPage=== 1
          this.lineOffset = this.lineOffset - this.lineOffsetUnit
          // this.animateAction(this.lineOffset)
        }
        //更新总的页码数
        this.pages = this.getPages(oldLength-1, this.pageSize)
        console.log(this.pages, '现在的总页数', oldLength, this.pageSize)
        //如果删掉了一个,当前的总页码 和 currentPage一样 则也不能向右
        this.disableToRightWhenLoacatedLastPage()
        //如果总的只有一页，则左右都不能移动
        if(this.pages ===1) {
          this.disableRight = true
          this.disableLeft = true
        }
      },
      toLeft () {
        if(this.disableLeft) return
        this.disableRight = false //能够向左点击，就肯定能够向右
        this.currentPage --  //页码-1
        if(this.currentPage === 1) {
          this.disableLeft = true
        }
        this.lineOffset = this.lineOffset - this.lineOffsetUnit
      },
      toRight () {
        if(this.disableRight) return
        this.disableLeft = false //能够向右点击,就肯定能够向左
        this.currentPage ++  //页码+1
        this.lineOffsetUnit = this.getOffsetUit()
        this.lineOffset = this.lineOffset + this.lineOffsetUnit
        this.disableToRightWhenLoacatedLastPage()
      },
      //如果当前页是最后的一页，则向右应该被禁止
      disableToRightWhenLoacatedLastPage() {
        if(this.currentPage === this.pages)
          this.disableRight = true
      },
      getOffsetUit () {
        let visionalWidth = $('.time-line-wrapper').width(), //可视范围的宽度
          remain = visionalWidth % this.liWidth //能否整除一个单位
        return (remain< this.liWidth && remain> 0) ? parseInt(visionalWidth/this.liWidth) * this.liWidth : visionalWidth
      },
      getPageSize (containerWidth) {
        return parseInt(containerWidth/this.liWidth)
      },
      getPages (length, size) {
        return length%size === 0 ? length/size : parseInt(length/size) + 1
      },
      setToRightBtn () {
        let containerWidth = $('#UlWrapper').width()
        console.log(containerWidth, 'containerWidth')
        if(this.allNodes.length * this.liWidth > containerWidth && this.workingStatus){
          this.disableRight = false
          this.pageSize = this.getPageSize(containerWidth)
          console.log(this.pageSize, 'pageSize')
          this.pages = this.getPages(this.allNodes.length, this.pageSize)
          console.log(this.pages, 'pageSize')          
        }
      }
    }
  }
</script>