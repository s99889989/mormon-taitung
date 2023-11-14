import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as path from "path";

export const useImageStore = defineStore('image', () => {
    //https://localhost:9100/
    //https://madustrialtd.asuscomm.com:9100/
    const data = reactive({
        main_url: 'https://madustrialtd.asuscomm.com:9100/',
        search_active_month: '所有月份',
        select_image_path: '',
        image_list:[
            {
            url: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg',
            select: false,
        },
            {
                url: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
                select: false,
            },
        ],
        path:['mormon', 'image', 'active'],
    })

    const addImage = () => {

        const inputFile = document.getElementById('dropzone-file');
        const formData = new FormData();
        formData.append('file', inputFile.files[0]);

        const url = data.main_url+'mormon/image/add/'+data.path.join('__');

        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.text())
            .then(imageName => {
                data.select_image_path = '<img>'+data.main_url+data.path.join('/')+'/'+ imageName+'</img>';
                //
                //
                //   data.image_list.push('https://localhost:9100/'+imageName)
                console.log('檔案名稱:' +imageName);
            })
            .catch(error => console.error('錯誤:', error));
    }
    //插入圖片
    const insertImage = () => {
        const text = data.select_image_path;
        const textarea = document.getElementById('editor');
        if(textarea == null){
            return;
        }

        const cursorStart = textarea.selectionStart;
        const cursorEnd = textarea.selectionEnd;

        const textBeforeCursor = textarea.value.substring(0, cursorStart);
        const textAfterCursor = textarea.value.substring(cursorEnd);

        textarea.value = textBeforeCursor + text + textAfterCursor;
        textarea.setSelectionRange(cursorStart + text.length, cursorStart + text.length);
        textarea.focus();



    }

    const refreshImage = () => {
        const pathList = data.path;
        const url = data.main_url+'mormon/image/get';
        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pathList)
        })
            .then(res=>res.json())
            .then(dataRes=>{
                let image_list = [''];

                image_list = dataRes;
                data.image_list.length = 0;
                image_list.forEach(image=>{
                    data.image_list.push({
                        url: data.main_url+image,
                        select: false,
                    })
                })
            })
    }

    //獲取目前日期
    const todayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1; // 月份从 0 开始，需要加 1
        let day = today.getDate();

        // 在月份和日期前面补零，以保持格式一致
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        // 构建日期字符串
        return `${year}-${month}-${day}`;
    }

    onMounted(()=>{
        data.path.push(todayDate());
    })
  return {data, addImage, refreshImage, insertImage }
})
