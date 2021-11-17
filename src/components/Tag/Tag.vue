<!--
 * @Author: qiuqi
 * @Date: 2021-10-05 21:04:47
 * @LastEditTime: 2021-11-13 17:53:34
 * @LastEditors: Please set LastEditors
 * @Description: 帖子标签管理
 * @FilePath: \xh_forum\src\components\Tag\Tag.vue
-->
<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>帖子管理</a-breadcrumb-item>
      <a-breadcrumb-item>标签列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        minHeight: '280px',
      }"
    >
      <a-button class="add-tag-btn" @click="addTag()">添加父标签</a-button>
      <a-table :columns="columns" :data-source="tagsList" rowKey="_id">
        <template slot="parentTag" slot-scope="text, tag">
          <a-tag color="#32b16c">{{ tag.tagname }}</a-tag>
        </template>
        <template slot="operation" slot-scope="text, tag">
          <a
            v-if="!tag.parentId"
            href="javascript:;"
            class="addTagBtn"
            @click="addSonTag(tag._id)"
            >添加子标签</a
          >
          <a href="javascript:;" class="editBtn" @click="editTag(tag)">编辑</a>
          <a-popconfirm
            v-if="tagsList.length"
            title="此操作将永久删除此标签，确定删除?"
            okText="确定"
            cancelText="取消"
            @confirm="() => deleteTag(tag)"
          >
            <a href="javascript:;" class="deleteBtn">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-layout-content>

    <!-- 添加父标签对话框 -->
    <a-modal
      width="600px"
      title="添加父标签"
      :visible="addVisible"
      okText="确定"
      cancelText="取消"
      @ok="addTagOk"
      @cancel="addTagCancel"
      destroyOnClose
    >
      <a-form
        :form="addform"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item name="tagname" label="标签名">
          <a-input
            v-decorator="[
              'tagname',
              {
                initialValue: tagInfo.tag.tagname,
                rules: [{ required: true, message: '标签名不能为空！' }],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加子标签对话框 -->
    <a-modal
      width="600px"
      title="添加子标签"
      :visible="addSonVisible"
      okText="确定"
      cancelText="取消"
      @ok="addSonTagOk"
      @cancel="addSonTagCancel"
      destroyOnClose
    >
      <a-form
        :form="addSonForm"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item name="tagname" label="标签名">
          <a-input
            v-decorator="[
              'tagname',
              {
                initialValue: tagInfo.tag.tagname,
                rules: [{ required: true, message: '标签名不能为空！' }],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑标签对话框 -->
    <a-modal
      width="600px"
      title="编辑标签"
      :visible="editVisible"
      okText="确定"
      cancelText="取消"
      @ok="editTagOk"
      @cancel="editTagCancel"
      destroyOnClose
    >
      <a-form
        :form="form"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item name="tagname" label="标签名">
          <a-input
            v-decorator="[
              'tagname',
              {
                initialValue: tagInfo.tag.tagname,
                rules: [{ required: true, message: '标签名不能为空！' }],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
const columns = [
  {
    title: "标签名",
    dataIndex: "",
    key: "parentTag",
    scopedSlots: { customRender: "parentTag" },
  },
  // { title: "帖子数量", dataIndex: "tagname", key: "tagname" },
  {
    title: "操作",
    dataIndex: "",
    key: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
import {
  getTagsApi,
  createTagApi,
  updateTagApi,
  deleteTagApi,
  createChildTagApi,
  updateChildTagApi,
  deleteChildTagApi,
} from "../../api/api";
export default {
  data() {
    return {
      columns,
      // 标签列表
      tagsList: [],
      // 当前标签信息
      tagInfo: { tag: {} },
      addTagInfo: { tag: {} },
      addVisible: false,
      addSonVisible: false,
      editVisible: false,
      form: this.$form.createForm(this, { name: "coordinated" }),
      addform: this.$form.createForm(this, { name: "addform" }),
      addSonForm: this.$form.createForm(this, { name: "addSonForm" }),
      // 当前父标签
      parentId: "",
    };
  },
  created() {
    this.getTagsList();
  },
  methods: {
    // 获取标签列表
    getTagsList() {
      getTagsApi().then((res) => {
        console.log(res.data.tags);
        this.tagsList = res.data.tags;
      });
    },

    addTag() {
      this.addVisible = true;
    },

    addTagOk() {
      this.addform.validateFields(async (err, values) => {
        if (!err) {
          console.log(values);
          this.addTagInfo.tag.tagname = values.tagname;
          await createTagApi({
            tag: {
              tagname: this.addTagInfo.tag.tagname,
              parentId: this.addTagInfo.tag.parentId,
            },
          }).then((res) => {
            this.$message.success("添加标签名成功！");
            this.getTagsList();
            this.addVisible = false;
          });
        }
      });
    },

    addTagCancel() {
      this.addVisible = false;
    },

    // 编辑标签
    editTag(tag) {
      this.editVisible = true;
      this.tagInfo.tag = tag;
    },

    // 确定编辑标签
    editTagOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.tagInfo.tag.parentId) {
            console.log(this.tagInfo.tag);
            console.log(values);
            this.tagInfo.tag.tagname = values.tagname;
            updateTagApi(this.tagInfo.tag._id, {
              tag: {
                tagname: this.tagInfo.tag.tagname,
              },
            }).then((res) => {
              this.$message.success("编辑父标签名成功！");
              this.getTagsList();
              this.editVisible = false;
            });
          } else {
            this.tagInfo.tag.tagname = values.tagname;
            updateChildTagApi(this.tagInfo.tag.parentId, this.tagInfo.tag._id, {
              tag: {
                tagname: this.tagInfo.tag.tagname,
              },
            }).then((res) => {
              this.$message.success("编辑子标签名成功！");
              this.getTagsList();
              this.editVisible = false;
            });
          }
        }
      });
    },

    // 取消编辑标签
    editTagCancel() {
      this.editVisible = false;
    },

    // 删除标签
    deleteTag(tag) {
      console.log(tag);
      if (!tag.parentId) {
        deleteTagApi(tag._id).then((res) => {
          this.getTagsList();
          message.success("删除父标签成功！");
        });
      } else {
        deleteChildTagApi(tag.parentId, tag._id).then((res) => {
          this.getTagsList();
          message.success("删除子标签成功！");
        });
      }
    },

    // 添加子标签
    addSonTag(tagId) {
      this.parentId = tagId;
      this.addSonVisible = true;
      console.log(this.parentId);
    },

    //确定添加子标签
    addSonTagOk() {
      this.addSonForm.validateFields(async (err, values) => {
        if (!err) {
          console.log(values);
          this.addTagInfo.tag.tagname = values.tagname;
          this.addTagInfo.tag.parentId = this.parentId;
          await createChildTagApi(this.addTagInfo.tag.parentId, {
            tag: {
              tagname: this.addTagInfo.tag.tagname,
              parentId: this.addTagInfo.tag.parentId,
            },
          }).then((res) => {
            this.$message.success("添加标签名成功！");
            this.getTagsList();
            this.addSonVisible = false;
            this.addTagInfo.tag.parentId = "";
          });
        }
      });
    },

    // 取消添加子标签
    addSonTagCancel() {
      this.addSonVisible = false;
    },
  },
};
</script>

<style scoped>
.add-tag-btn {
  color: #fff;
  background-color: #32b16c;
  margin-bottom: 20px;
}
.add-tag-btn:hover,
.add-tag-btn:focus {
  border-color: #32b16c;
}

.editBtn {
  margin-right: 20px;
}
.addTagBtn {
  margin-right: 20px;
  color: #32b16c;
}
.deleteBtn {
  color: red;
}
</style>