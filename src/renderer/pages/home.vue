<template>
  <h2>文件重命名工具</h2>
  <el-button class="primary" @click="handleBtnClick">选择文件夹</el-button>
  <el-table :data="obj.tableData" style="width: 100%">
    <el-table-column prop="oldPath" label="Old Name" />
    <el-table-column prop="newPath" label="New Name">
      <template #default="scope">
        <div
          v-if="!scope.row.isRename"
          class="show_state"
          @click.stop="scope.row.isRename = true"
        >
          {{ scope.row.newPath }}
        </div>
        <div v-else>
          <el-input
            v-model="scope.row.newPath"
            :autofocus="true"
            @blur="handleBlurEvent(scope.row)"
          ></el-input>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="Status" />
  </el-table>
  <el-button class="primary rename_btn" @click="handleRenameBtnClickEvent"
    >重命名</el-button
  >
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "home",
  setup() {
    const obj = reactive({
      tableData: [],
    });
    const handleBtnClick = async () => {
      const filePath = await window.electronAPI.openFile();
      console.log(filePath);
      if (filePath) {
        let filesArr = await window.electronAPI.readFilesInDir(filePath);
        filesArr = filesArr.map((_filePath: string, index: number) => {
          return {
            id: index,
            path: _filePath,
            oldPath: _filePath,
            newPath: _filePath,
            isRename: false,
            status: "READY",
          };
        });
        obj.tableData = filesArr;
      }
    };

    const handleBlurEvent = (row: any) => {
      row.isRename = false;
    };

    const handleRenameBtnClickEvent = async () => {
      if (obj.tableData.length === 0) return;
      let needRenamePaths: Array<Record<string, any>> = [];
      obj.tableData.forEach((item: any) => {
        item.isRename = false;
        if (item.oldPath !== item.newPath) {
          needRenamePaths.push({
            id: item.id,
            oldPath: item.oldPath,
            newPath: item.newPath,
          });
        }
      });
      if (needRenamePaths.length > 0) {
        window.electronAPI
          .rename(needRenamePaths)
          .then((result: any) => {
            console.log("success!");
            obj.tableData.forEach((item) => {
              needRenamePaths.forEach((okPath) => {
                if (item.id === okPath.id) {
                  item.status = "OK";
                  item.oldPath = okPath.newPath;
                  item.newPath = okPath.newPath;
                }
              });
            });
            needRenamePaths = [];
          })
          .catch((error) => {
            console.error(error);
            obj.tableData.forEach((item) => {
              needRenamePaths.forEach((okPath) => {
                if (item.id === okPath.id) {
                  item.status = "ERROR";
                  item.oldPath = okPath.oldPath;
                  item.newPath = okPath.oldPath;
                }
              });
            });
            needRenamePaths = [];
          });
      }
    };

    return {
      handleBtnClick,
      obj,
      handleBlurEvent,
      handleRenameBtnClickEvent,
    };
  },
});
</script>

<style scoped>
.rename_btn {
  margin-top: 15px;
}
</style>>