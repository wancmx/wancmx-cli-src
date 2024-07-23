<template>
  <div>
    <el-upload
      ref="upload"
      class="upload"
      drag
      :action="returnAction()"
      :headers="uploadHeader"
      accept=""
      name="dxfFile"
      :limit="1"
      :on-exceed="handleExceed"
      :on-success="handleFileSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :on-change="changeFile"
      :auto-upload="false"
      :show-file-list="false"
      :disabled="disabled"
    >
      <div v-if="fileList.length" class="el-upload__text file-upload">
        <span class="font-size10">
          {{ fileName }}
        </span>
      </div>
      <div v-if="!fileList.length" class="el-upload__text file-upload">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text font-size14">
          拖拽DXF文件至此或者<em>点此上传文件</em>
        </div>
      </div>
    </el-upload>
  </div>
  <div class="btn-div">
    <el-button type="primary" @click="uploadFile">uploadFile</el-button>
  </div>
</template>

<style scoped lang="scss">
.btn-div {
  height: 100px;
  display: flex;
  justify-content: end;
  align-items: center;
}
</style>

<script setup lang="ts">
import http from "@/http/http";
import {
  UploadFile,
  UploadProps,
  UploadRawFile,
  genFileId,
} from "element-plus";
import { ref } from "vue";
const props = defineProps<{
  chunkFileUploadSrc: string; // file切片上传接口地址
  uploadSuccessSrc: string; // file切片上传成功后通知接口的地址
}>();

const { chunkFileUploadSrc, uploadSuccessSrc } = props;
const uploadHeader = ref<any>({
  Authorization: localStorage.getItem("token"),
});
const upload = ref<any>();
let fileList = ref<Array<any>>([]);
let fileName = ref<string>("");
let disabled = ref<boolean>(false);
const returnAction = () => {
  return ``;
};

/**
 * 下一个文件替换上一个文件
 * @param files
 */
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const handleFileSuccess = async () => {
  upload.value.clearFiles();
};

const handleError = () => {};

const beforeUpload = () => {};

const changeFile = (uploadFile: UploadFile) => {
  fileName.value = uploadFile.name;
  fileList.value = [uploadFile];
};
const uploadFile = async () => {
  let size = 1024;
  await chunkUpload(createFileChunk(size)).then(() => {
    // 所有切片file上传完毕后，执行特定请求告诉后端我已切片完毕，由后端将切片的file重新组合回原file
    http.post(uploadSuccessSrc, {
      fileName: fileName.value,
      size,
    });
  });
};

/**
 * 生成切片
 */
const createFileChunk = (size: number = 10 * 1024) => {
  let fileChunkList: Array<{
    fileArr: Array<{
      blob: Blob;
      id: number;
    }>;
    fileName: string;
  }> = [];
  fileList.value.forEach((fileItem) => {
    // 从element-plus的upload组件中拿到File类型的文件
    let file: File = fileItem.raw;
    let fileChunkArr: Array<{
      blob: Blob;
      id: number;
    }> = [];
    if (size) {
      let curr = 0;
      while (curr < file.size) {
        // 切片，File类型继承自Blob类型，Blob类型存在size为文件流长度，单位为比特（b），存在slice方法，用于切分Blob
        let fileChunk = file.slice(curr, curr + size);
        fileChunkArr.push({
          blob: fileChunk,
          id: curr / size,
        });
        curr += size;
      }
      fileChunkList.push({
        fileArr: fileChunkArr,
        fileName: fileName.value,
      });
    }
  });
  return fileChunkList;
};

/**
 * 切片上传
 * @param fileChunkList 切片后的file数组
 */
const chunkUpload = (
  fileChunkList: Array<{
    fileArr: Array<{
      blob: Blob;
      id: number;
    }>;
    fileName: string;
  }>
) => {
  let promiseFuncArr: Array<Function> = [];
  // 循环file切片，将http promise请求封装为一个未执行的function，供queue队列控制使用
  fileChunkList.forEach((fileItem, index) => {
    fileItem.fileArr.forEach((fileBlobObj) => {
      // Promise Function，由于Promise在实例化时就会执行，因而为了控制Promise在何时执行，将Promise封装进Function，执行Function即执行Promise，供queue队列控制
      let promiseFunc = () => {
        return new Promise((resolve, reject) => {
          try {
            let formData = new FormData();
            // 切片传参
            formData.append("chunk", fileBlobObj.blob);
            formData.append("id", `${index}-${fileBlobObj.id}`);
            formData.append("fileName", fileItem.fileName);
            http.post(chunkFileUploadSrc, formData).then((res) => {
              resolve(res);
            });
          } catch (error) {
            reject(error);
          }
        });
      };
      promiseFuncArr.push(promiseFunc);
    });
  });
  return promiseQueue(promiseFuncArr);
};

/**
 * promise限流，保证同时最多只有10000个请求会被执行
 * @param promiseFuncArr
 */
const promiseQueue = (promiseFuncArr: Array<Function>) => {
  return new Promise((resolve, reject) => {
    let queue: Array<Promise<any>> = []; // 正在执行请求的promise数组，queue队列中应当全部都是正在执行未执行完毕的promise
    let num = 10000;
    let currentStart = 0;
    // 进出队列控制
    const enqueue = (
      queue: any,
      num: number,
      promiseFuncArr: Array<Function>,
      currentStart: number
    ) => {
      try {
        let shiftPromise = promiseFuncArr.shift();
        // 当queue队列不为空，当前正在执行的请求小于最大允许执行数，并且待请求队列不为空，则允许queue队列入队
        if (queue && currentStart < num && shiftPromise) {
          let promiseFunc = shiftPromise;
          let currentIndex = queue.length - 1;
          queue.push(
            promiseFunc().then(() => {
              // 出队列，当promise执行完毕后从queue队列中出列，并且currentStart正在执行的数目减1
              queue.splice(currentIndex, 1);
              currentStart--;
              // 当出现出队列情况时，currentStart必定小于最大允许执行数num，因此必定重新执行一次enqueue入队列
              enqueue(queue, num, promiseFuncArr, currentStart);
            })
          );
          // push进queue队列后，正在执行数加1
          currentStart++;
        }
        // 当当前正在执行数为0时，代表所有请求均执行完毕，可以执行下一步
        if (currentStart === 0) {
          resolve(0);
        }
      } catch (error) {
        reject(error);
      }
    };
    enqueue(queue, num, promiseFuncArr, currentStart);
  });
};
</script>
