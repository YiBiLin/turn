<template>
  <div class="wheel">


      <div class="rotate" ref="rotate">
        <slot name="table">
          <div :class="'item rollItem_'+index" v-for="(item,index) in list">
            <img :src="item.icon" alt="">
            <span>{{item.title}}</span>
          </div>
        </slot>
      </div>


      <div class="pointer" @click="play">
        <slot name="pointer">
          <span>剩余{{chance}}次</span>
        </slot>
      </div>


  </div>
</template>

<script>



  export default {
    name: "lottery",
    props:{
      //奖品种类数量
      blockNum:{
        type:Number,
        default:6,
      },
      //剩余抽奖机会
      chance:{
        type:Number,
        default:0,
      },
      //奖品列表,非动态配置直接修改ref元素rotate的背景图
      list:{
        type:Array,
        default:[]
      },

      //最终需要结果
      prizeIdx:{
        type:Number,
        require:true
      },
      easeType:{
        type:String,
        default:'easeOut'
      }
    },
    data(){
      return{
        //停下前缓慢走过的圈数
        distance:0,

        t:0,

        //结果角度
        angles:0,

        //当前旋转角度
        angleNow:0,


        //是否正在抽奖
        isRolling:false,

        //旋转计时器
        timer:-1,
        //得到结果前的旋转计时器
        vtimer:-1,
      }
    },
    computed:{
      //每个方格所占角度
      perAngle(){
        return 360/this.blockNum;
      },


      result(){
        console.log(this.prizeIdx)
        return this.prizeIdx;
      }
    },
    methods:{

      //转盘参数设置
      async init(){

        let rotate=this.$refs.rotate;
        rotate.style.transform="rotateZ(0deg)";
        this.isRolling=true;
        await this.$emit('begin');
        clearInterval(this.vtimer);

        if(this.result<=0){
          console.log('false')
          this.reset();
          this.$emit('callb',this.result)
          return;
        }
        else{
          this.roll();
        }

        console.log('roll',this.result)

        this.distance=Math.floor(Math.random()*3+1);

        //目标角度
        this.angles=this.distance*360+(this.result-1)*this.perAngle+this.randomAngle();

        console.log(this.angles)
      },


      //点击抽奖按钮事件
      async play(){
        if(this.chance<=0){
          // gameBox.showToast('还未获得抽奖机会，快去参与游戏吧~');
          console.log('还未获得机会')
          return;
        }
        //阻止用户在滚动时重复点击
        if(this.isRolling){
          console.log("正在抽奖中,请勿重复点击哦");
          return ;
        }
        else{

          this.virtualRoll();

          // 获取奖励结果
          await this.init();
        }
      },

      //在ajax请求得到前不停滚动
      virtualRoll(){
        console.log('virtualroll')
        let rotate=this.$refs.rotate;

        this.vtimer=setInterval(()=>{

          rotate.style.transform=`rotateZ(-${this.angleNow}deg)`;
          this.angleNow=(this.angleNow+10)%360;

        },16)
      },

      //中心点附近角度 2/3
      randomAngle(){
        return Math.floor(Math.random()*this.perAngle*2/3)-this.perAngle/3;
      },

      //旋转到指定角度
      roll:function () {
        let self=this;
        let rotate=self.$refs.rotate;
        self.timer=setInterval(()=>{
          if(Math.abs(self.angles-self.angleNow)<5){
            clearInterval(self.timer);
            this.$emit('callb',this.result);
            self.reset();
          }else{
            self.t+=16;
            self.angleNow=self.ease(2000,self.angles,self.t,0,this.easeType);
            rotate.style.transform=`rotateZ(-${self.angleNow}deg)`;
          }
        },16);
      },

      //计算位置函数
      ease(duration,distance,time,b,type){
        switch (type) {
          case 'easeOut':
            return distance * ((time = time / duration - 1) * time * time + 1)+b ;
          case 'easeInOut':
            if ((time /= duration / 2) < 1)
              return distance / 2 * time * time * time +b ;
            else
              return distance / 2 * ((time -= 2) * time * time + 2)+b;
          case 'easeOutExpo':
            return (time == duration) ? b + distance : distance * (-Math.pow(2, -10 * time / duration) + 1) + b;
          case 'easeOutSin':
            return distance * Math.sin(time / duration * (Math.PI / 2)) + b;
          default:
            //easeOut
            return distance * ((time = time / duration - 1) * time * time + 1)+b ;
        }
      },

      //重置参数
      reset(){
        let self=this;
        self.isRolling=false;
        self.angleNow=0;
        self.t=0;
        self.angles=0;
      },



    },
    watch:{
      //commputed可实现 忽略此方法


      /*
      result(newval,oldval){
        if(newval>0){
          clearInterval(this.vtimer);
          this.roll();
        }
      }
      */
    }
  }
</script>

<style>
  .pointer{
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
    z-index: 4;
  }
</style>
