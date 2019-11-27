<template>
  <div class="choose">
    <div class="group" v-for="(group, index) in groupList" :key="index">
      <div class="group-title">
        <span>{{group.group}}组</span>
      </div>
      <ul>
        <li v-for="(team, teamIndex) in group.teams" :key="teamIndex" :class="{active: selectedCountry==`${group.group}-${teamIndex}`}" @click="handleSelect(`${group.group}-${teamIndex}`)">
          <img :src="team.flag" alt="">
          <p>{{team.country}}</p>
        </li>
        <template v-if="group.teams.length==1">
          <li></li>
          <li></li>
          <li></li>
        </template>
      </ul>
    </div>
    <div class="choose-btn" @click="handleSubmit">
      加入本队
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCountry: '',
      groupList: [{
        group: 'X',
        teams: [{
          country: '中国',
          name: 'China',
          flag: './static/flags/China.png'
        }]
      }, {
        group: 'A',
        teams: [{
          country: '俄罗斯',
          name: 'Russia',
          flag: './static/flags/Russia.png'
        }, {
          country: '沙特',
          name: 'Saudi',
          flag: './static/flags/Saudi.png'
        }, {
          country: '埃及',
          name: 'Egypt',
          flag: './static/flags/Egypt.png'
        }, {
          country: '乌拉圭',
          name: 'Uruguay',
          flag: './static/flags/Uruguay.png'
        }]
      }, {
        group: 'B',
        teams: [{
          country: '葡萄牙',
          name: 'Portugal',
          flag: './static/flags/Portugal.png'
        }, {
          country: '西班牙',
          name: 'Spain',
          flag: './static/flags/Spain.png'
        }, {
          country: '摩洛哥',
          name: 'Morocco',
          flag: './static/flags/Morocco.png'
        }, {
          country: '伊朗',
          name: 'Iran',
          flag: './static/flags/Iran.png'
        }]
      }, {
        group: 'C',
        teams: [{
          country: '法国',
          name: 'France',
          flag: './static/flags/France.png'
        }, {
          country: '澳大利亚',
          name: 'Australia',
          flag: './static/flags/Australia.png'
        }, {
          country: '秘鲁',
          name: 'Peru',
          flag: './static/flags/Peru.png'
        }, {
          country: '丹麦',
          name: 'Denmark',
          flag: './static/flags/Denmark.png'
        }]
      }, {
        group: 'D',
        teams: [{
          country: '阿根廷',
          name: 'Argentina',
          flag: './static/flags/Argentina.png'
        }, {
          country: '冰岛',
          name: 'Iceland',
          flag: './static/flags/Iceland.png'
        }, {
          country: '克罗地亚',
          name: 'Croatia',
          flag: './static/flags/Croatia.png'
        }, {
          country: '尼日利亚',
          name: 'Nigeria',
          flag: './static/flags/Nigeria.png'
        }]
      }, {
        group: 'E',
        teams: [{
          country: '巴西',
          name: 'Brazil',
          flag: './static/flags/Brazil.png'
        }, {
          country: '瑞士',
          name: 'Swiss',
          flag: './static/flags/Swiss.png'
        }, {
          country: '哥斯达黎加',
          name: 'CostaRica',
          flag: './static/flags/CostaRica.png'
        }, {
          country: '塞尔维亚',
          name: 'Serbia',
          flag: './static/flags/Serbia.png'
        }]
      }, {
        group: 'F',
        teams: [{
          country: '德国',
          name: 'Germany',
          flag: './static/flags/Germany.png'
        }, {
          country: '墨西哥',
          name: 'Mexico',
          flag: './static/flags/Mexico.png'
        }, {
          country: '瑞典',
          name: 'Sweden',
          flag: './static/flags/Sweden.png'
        }, {
          country: '韩国',
          name: 'Korea',
          flag: './static/flags/Korea.png'
        }]
      }, {
        group: 'G',
        teams: [{
          country: '比利时',
          name: 'Belgium',
          flag: './static/flags/Belgium.png'
        }, {
          country: '巴拿马',
          name: 'Panama',
          flag: './static/flags/Panama.png'
        }, {
          country: '突尼斯',
          name: 'Tunisia',
          flag: './static/flags/Tunisia.png'
        }, {
          country: '英格兰',
          name: 'England',
          flag: './static/flags/England.png'
        }]
      }, {
        group: 'H',
        teams: [{
          country: '波兰',
          name: 'Poland',
          flag: './static/flags/Poland.png'
        }, {
          country: '塞内加尔',
          name: 'Senegal',
          flag: './static/flags/Senegal.png'
        }, {
          country: '哥伦比亚',
          name: 'Colombia',
          flag: './static/flags/Colombia.png'
        }, {
          country: '日本',
          name: 'Japan',
          flag: './static/flags/Japan.png'
        }]
      }]
    }
  },

  methods: {
    handleSelect(code) {
      this.selectedCountry = code
    },
    handleSubmit() {
      console.log('====handleSubmit====', this.selectedCountry)
      if (!this.selectedCountry) {
        this.$toast('请选择支持的球队')
        return
      }
      let [group, index] = this.selectedCountry.split('-')
      console.log('====group====', this.selectedCountry.split('-'), group, index)
      let country = this.groupList.find(item => item.group === group).teams[index]
      console.log('====country====', country)
      this.$fetch('/fifa/add-team', {
        userid: this.$getUser().user_id,
        teamid: '',
        teamname: country.name
      }).then(res => {
        console.log('====res====', res)
        if (res.code == 0 || res.msg == '已经选择队伍，不能重新选择') {
          this.$emit('next', {
            teamname: country.name
          })
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.choose {
  padding-bottom: 70px;
  .group {
    width: 100%;
    margin: 4vw auto 7vw;
    .group-title {
      background-image: url('~@/assets/img/title-bg.png');
      background-size: contain;
      width: 22.133vw;
      height: 7.467vw;
      line-height: 7.467vw;
      padding-left: 9vw;
      margin-left: 5vw;
      margin-bottom: 5vw;
      background-repeat: no-repeat;
      span {
        font-size: 16px;
        color: #ffffff;
      }
    }
    ul {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      li {
        width: 22%;
        color: #fff;
        text-align: center;
        padding: 3vw 0;
        border: 1px solid transparent;
        border-radius: 2.6665vw;
        &.active {
          background-color: #001c3e;
          border-color: #ce1b20;
        }
        img {
          width: 63%;
        }
        p {
          font-size: 3.7334vw;
        }
      }
    }
  }
  .choose-btn {
    background-image: linear-gradient(-180deg, #ec1d23 0%, #871519 100%);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    line-height: 60px;
  }
}
</style>
