  <template>
  <el-table :data="logs"
            border
            style="width: 100%">
    <el-table-column prop="lastLogin.loginTime"
                     label="上次登入时间">
    </el-table-column>
    <el-table-column prop="lastLogin.ip"
                     label="登入IP">
    </el-table-column>
    <el-table-column prop="nowLogin.loginTime"
                     label="登入时间">
    </el-table-column>
    <el-table-column prop="nowLogin.ip"
                     label="登入IP">
    </el-table-column>
  </el-table>
</template>
<script>
  import { getLoginLog } from "@/api"
  export default {
    data() {
      return {
        logs: []
      }
    },
    created() {
      getLoginLog()
        .then(res => {
          this.logs = res.data.data
        })
    }
  }
</script>