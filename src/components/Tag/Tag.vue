<!--
 * @Author: qiuqi
 * @Date: 2021-10-05 21:04:47
 * @LastEditTime: 2021-11-20 13:47:58
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
        <template slot="image" slot-scope="text, tag">
          <div v-if="tag.image">
            <img class="table--tag-img" :src="tag.image" alt="" />
          </div>
          <span v-else>-</span>
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
                rules: [{ required: true, message: '标签名不能为空！' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item name="describe" label="描述">
          <a-input
            v-decorator="[
              'describe',
              {
                rules: [{ required: true, message: '描述不能为空！' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="展示图片">
          <input
            type="file"
            accept="image/*"
            name="uploader-input"
            class="uploader-file"
            id="upload"
            @change="(event) => createImage(event)"
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
        <a-form-item name="describe" label="描述">
          <a-input
            v-decorator="[
              'describe',
              {
                initialValue: tagInfo.tag.describe,
                rules: [{ required: true, message: '描述不能为空！' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item v-if="tagInfo.tag.image" name="image" label="展示图片">
          <div class="form-tag-image-content">
            <img
              class="form-tag-image"
              id="show"
              :src="tagInfo.tag.image"
              alt=""
            />
          </div>
          <input
            type="file"
            accept="image/*"
            name="uploader-input"
            class="uploader-file"
            id="upload"
            @change="(event) => updateImage(event)"
          />
          <div class="update-image-tip">
            <div>点击修改图片</div>
          </div>
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
  { title: "标签描述", dataIndex: "describe", key: "describe" },
  {
    title: "展示图片",
    dataIndex: "",
    key: "image",
    scopedSlots: { customRender: "image" },
  },
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
  createChildTagImageApi,
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
      // 添加子标签的图片
      tagForms: "",
      // 更新子标签的图片
      updateTagForms: "",
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
      this.addform.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          this.addTagInfo.tag.tagname = values.tagname;
          this.addTagInfo.tag.describe = values.describe;
          createTagApi({
            tag: {
              tagname: this.addTagInfo.tag.tagname,
              parentId: this.addTagInfo.tag.parentId,
              describe: this.addTagInfo.tag.describe,
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
            this.tagInfo.tag.describe = values.describe;
            updateTagApi(this.tagInfo.tag._id, {
              tag: {
                tagname: this.tagInfo.tag.tagname,
                describe: this.tagInfo.tag.describe,
              },
            }).then((res) => {
              this.$message.success("编辑父标签名成功！");
              this.getTagsList();
              this.editVisible = false;
            });
          } else {
            this.tagInfo.tag.tagname = values.tagname;
            this.tagInfo.tag.describe = values.describe;
            if (this.updateTagForms) {
              createChildTagImageApi(this.updateTagForms).then((res) => {
                console.log(res.data.url);
                this.tagInfo.tag.image = res.data.url;
                updateChildTagApi(
                  this.tagInfo.tag.parentId,
                  this.tagInfo.tag._id,
                  {
                    tag: {
                      tagname: this.tagInfo.tag.tagname,
                      describe: this.tagInfo.tag.describe,
                      image: this.tagInfo.tag.image,
                    },
                  }
                ).then((res) => {
                  this.$message.success("编辑子标签名成功！");
                  this.updateTagForms = "";
                  this.getTagsList();
                  this.editVisible = false;
                });
              });
            } else {
              updateChildTagApi(
                this.tagInfo.tag.parentId,
                this.tagInfo.tag._id,
                {
                  tag: {
                    tagname: this.tagInfo.tag.tagname,
                    describe: this.tagInfo.tag.describe,
                    image: this.tagInfo.tag.image,
                  },
                }
              ).then((res) => {
                this.$message.success("编辑子标签名成功！");
                this.getTagsList();
                this.editVisible = false;
              });
            }
          }
        }
      });
    },

    // 取消编辑标签
    editTagCancel() {
      this.updateTagForms = "";
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
      this.addSonForm.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          this.addTagInfo.tag.tagname = values.tagname;
          this.addTagInfo.tag.describe = values.describe;
          this.addTagInfo.tag.parentId = this.parentId;
          createChildTagImageApi(this.tagForms).then((res) => {
            console.log(res.data.url);
            this.addTagInfo.tag.image = res.data.url;
            createChildTagApi(this.addTagInfo.tag.parentId, {
              tag: {
                tagname: this.addTagInfo.tag.tagname,
                parentId: this.addTagInfo.tag.parentId,
                describe: this.addTagInfo.tag.describe,
                image: this.addTagInfo.tag.image,
              },
            }).then((res) => {
              this.$message.success("添加标签名成功！");
              this.getTagsList();
              this.tagForms = "";
              this.addTagInfo.tag.parentId = "";
              this.addSonVisible = false;
            });
          });
        }
      });
    },

    // 取消添加子标签
    addSonTagCancel() {
      this.tagForms = "";
      this.addSonVisible = false;
    },

    // 创建标签照片
    createImage(event) {
      console.log(event.currentTarget.files[0]);
      let forms = new FormData();
      forms.append("file", event.currentTarget.files[0]);
      this.tagForms = forms;
    },

    // 修改标签图片
    updateImage(event) {
      console.log(event.currentTarget.files[0]);
      let forms = new FormData();
      forms.append("file", event.currentTarget.files[0]);
      this.updateTagForms = forms;
      // 预览图片
      let reads = new FileReader();
      let f = event.currentTarget.files[0];
      reads.readAsDataURL(f);
      reads.onload = function (e) {
        document.getElementById("show").src = this.result;
      };
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
.table--tag-img {
  width: 40px;
  height: 40px;
}
.form-tag-image-content {
  width: 80px;
  height: 80px;
}

.form-tag-image {
  width: 80px;
  height: 80px;
}

.uploader-file {
  box-sizing: border-box;
  padding: 40px;
  cursor: pointer;
  opacity: 0;
  position: absolute;
  top: 0px;
  width: 80px;
  height: 80px;
  z-index: 100;
}

.update-image-tip {
  opacity: 0;
  position: absolute;
  top: 0px;
  margin: 0 auto;
  width: 80px;
  height: 80px;
  z-index: 10;
  background-color: rgba(155, 155, 155, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.1s;
}

.update-image-tip > div {
  font-size: 12px;
  color: #fff;
  text-align: center;
}

.uploader-file:hover + .update-image-tip {
  opacity: 1;
  cursor: pointer;
}
</style>
