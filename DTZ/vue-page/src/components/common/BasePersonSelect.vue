<template>
  <div class="person-select">
    <div class="tagclass" @click="choosePerson(1)">
      <el-tag style="z-index:100" :type="item.type" v-for="(item,index) in personClerk.personList" :key="item.id">
        {{item.name}}
      </el-tag>
    </div>
    <el-dialog :title="title" append-to-body :visible="personVisable" class="personDialog" :show-close="false" :close-on-click-modal="false">
      <base-person :orgId='orgId' :max='max' :dialog-visible="personVisable" :expand=true type="executorClerk" :disabledOptions='disabledOptions' :data="PersonPropData" ref="executorClerk" @close="mainDialogClose"></base-person>
    </el-dialog>
  </div>
</template>

<script>
import BasePerson from "common/BasePerson.vue";

export default {
  name: "person-select",
  props: {
    value: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "人员选择"
    },
    disabledOptions: {
      //禁用数据
      type: Object,
      default: () => {
        return {
          name: "禁用",
          list: () => []
        };
      }
    },
    orgId:{
      default:null
    },
    max: {
      default: null
    }
  },
  data() {
    return {
      personClerk: {
        default: [],
        personList: []
      },
      PersonPropData: {}, //弹窗数据
      personVisable: false //弹窗
    };
  },
  components: {
    BasePerson
  },
  mount() {},
  methods: {
    choosePerson(value, data) {
      this.personVisable = true;
      this.PersonPropData = this.personClerk;
    },
    mainDialogClose(msg) {
      console.log("close:", msg);
      this.personVisable = msg.dialogVisible;
      this.personClerk = msg.CheckedLists;
      let data = this.personClerk.personList.map(item => {
        return item.id;
      });
      this.$emit("input", data);
    },
    async getUserByIds(data) {
      let newData = data || [];
      const Res = await this.$http.post(
        "/sys/UserController/getUserInfoByIds",
        {
          ids: newData
        }
      );
      console.log(Res);
      if (Res && Res.data.success) {
        this.personClerk.personList = Res.data.result.map(item => {
          item.type = "person";
          return item;
        });
      }
    }
  },
  watch: {
    value: {
      handler: function(val, oldval) {
        console.log("watch:", val);
        // if (val instanceof Array) {

        this.getUserByIds(val);
        // }
      },
      immediate: true
    }
  }
};
</script>
 
<style lang="scss" scoped>
.person-select {
  .el-tag--person {
    background-color: #20a0ff;
    border-color: rgba(18, 206, 102, 0.2);
    color: #fbfdff;
    margin: 5px 2px 0 2px;
  }
  .tagclass {
    min-height: 30px;
    border-radius: 4px;
    background: #fff;
    border: 1px solid #bfcbd9;
    padding: 0 5px;
    /* width: 200px; */
    margin-top: 5px;
    max-height: 30px;
    overflow: auto;
  }
}
</style>