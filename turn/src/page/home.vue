<template>
  <div id="app">
    <lottery :blockNum="blockNum"
             :chance="lotteryChance" :list="turn"
             :prizeIdx="prize"  :easeType="easeType"
             @callb="cb" @begin="gameBegin">
      <!--奖励列表动态配置时插入的列表-->
      <template slot="table" class="table-list">

      </template>
      <template slot="pointer">
        <button class="btn spin-button" @click="proxy" ref="button">
          <span>还剩{{lotteryChance}}次</span>
        </button>
      </template>
    </lottery>
  </div>
</template>

<script>
  import Lottery from "../components/lottery.vue";
  export default {
    name: "home",
    components: {Lottery},
    data(){
      return{
        lotteryChance:1,
        turn:[
          // {
          //   "id": "803",
          //   "title": "非人学园logo",
          //   "channel": "5",
          //   "prize_key": "sp-115517"
          // },
          // {
          //   "id": "820",
          //   "title": "100盒币",
          //   "channel": "1",
          //   "prize_key": "100hebi"
          // },
          // {
          //   "id": "821",
          //   "title": "10盒币",
          //   "channel": "1",
          //   "prize_key": "10hebi"
          // }
        ],
        blockNum:6,
        prize:-1,
        //easeOut,easeInOut,easeOutExpo,easeOutSin
        easeType:'easeOut'
      }
    },
    methods:{
      //点击开始按钮时ajax请求获取结果后返回奖品下标
      async gameBegin(){
        //获取结果在奖品列表中的下标 index+1
        //   result=0 是代表设备限制等错误请求
        this.prize=Math.floor(Math.random()*this.blockNum)+1;


      },

      //点击按钮前对开始条件进行判断
      proxy(e){
        if(this.lotteryChance<=0){
          //利用阻止事件冒泡的方式 进行点击行为过滤
          e.stopPropagation();
          return;
        }

      },

      //转动结束后要执行的事件
      cb(result){
        console.log('结果是',result)
      }
    }
  }
</script>

<style lang="scss" >
 @import "./reset";
 @import "./index";
 body,html{
   height: 100%;
   margin: 0;
   padding: 0;
 }
  #app{
    width: rem(750);
    height:100%;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }
</style>
