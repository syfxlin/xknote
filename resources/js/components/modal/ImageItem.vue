<template>
  <div class="image-item grid-lg">
    <div v-if="images.length === 0">
      <div class="loading"></div>
      <div class="text-gray text-center">正在加载，客官莫急。</div>
    </div>
    <template v-if="images.length !== 0">
      <div v-for="(image, index) in images" :key="image.id" class="columns">
        <div class="col-3 col-sm-12">
          <img :src="image" alt />
        </div>
        <div class="col-9 col-sm-12">
          <div class="input-group">
            <input
              type="text"
              class="form-input"
              :value="'![](' + image + ')'"
              :id="'image-item-' + index"
              :readonly="true"
            />
            <button @click="copyMD(image, index)" class="btn input-group-btn">
              复制MD
            </button>
            <button
              @click="deleteImage(image, index, $event)"
              class="btn input-group-btn"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import zooming from "zooming";
export default {
  name: "image-item",
  data() {
    return {
      images: []
    };
  },
  computed: {
    ...mapState({
      data: state => state.tools.miModal.data,
      modal: state => state.tools.miModal
    })
  },
  methods: {
    ...mapActions("tools", ["setMiModalData", "hideMiModal"]),
    ...mapActions("other", ["imageOperate"]),
    ...mapActions("toast", ["timeToast"]),
    copyMD(image, index) {
      document.getElementById("image-item-" + index).select();
      try {
        if (document.execCommand("Copy")) {
          this.timeToast({
            message: "复制成功！",
            status: "success",
            delay: 1000
          });
        } else {
          this.timeToast({
            message: "复制错误！请手动复制！",
            status: "error",
            delay: 1000
          });
        }
      } catch (err) {
        this.timeToast({
          message: "复制错误！请手动复制！",
          status: "error",
          delay: 1000
        });
      }
    },
    deleteImage(image, index, event) {
      let name = image.substring(image.lastIndexOf("/"));
      event.target.classList.add("loading");
      this.imageOperate({ operate: "delete", name: name })
        .then(() => {
          this.timeToast({
            message: "删除成功！",
            status: "success",
            delay: 1000
          });
          event.target.classList.remove("loading");
          this.images.splice(index, 1);
        })
        .catch(err => {
          this.timeToast({
            message: "删除失败！(" + err.response.data.error + ")",
            status: "error",
            delay: 1000
          });
          event.target.classList.remove("loading");
        });
    }
  },
  created() {
    this.modal.title = "图片";
    this.modal.confirm = {
      content: "下载所有图片",
      handler: () => {
        window.location.href = "/api/export/images";
      }
    };
    this.modal.cancel = {
      content: "关闭",
      handler: () => {
        this.hideMiModal();
      }
    };
    this.imageOperate({ operate: "getAll" }).then(images => {
      this.$set(this, "images", images);
      this.$nextTick(() => {
        new zooming({
          bgColor: "rgba(0,0,0,0.5)",
          custemSize: "90%",
          zIndex: 399,
          onBeforeOpen(target) {
            target.classList.add("open");
          },
          onClose(target) {
            target.classList.remove("open");
          }
        }).listen(".image-item img");
      });
    });
  }
};
</script>

<style></style>
