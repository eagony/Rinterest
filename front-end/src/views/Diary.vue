<template>
  <v-container>
    <v-row class="justify-center" dense>
      <v-col cols="12" md="9" xl="7">
        <v-card>
          <v-card-title v-if="!adding">
            <div class="text-justify text--black">
              共 {{ diaries.length }} 篇日记
            </div>
            <v-spacer></v-spacer>
            <div>
              <v-btn class="mx-2" fab dark color="teal" @click="adding = true">
                <v-icon dark>mdi-pencil</v-icon>
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text v-if="adding">
            <v-textarea
              v-model="content"
              auto-grow
              counter
              name="input-7-4"
              label="新增日记"
            ></v-textarea>
            <v-row class="ml-1">
              <span class="text-body-2 mr-5 mt-3">添加标签</span>
              <v-chip-group
                column
                v-for="chip in chips"
                :key="chip.ID"
                multiple
                v-model="tags"
                active-class="teal--text text--accent-4"
              >
                <v-chip :value="chip"
                  ><v-icon left>{{ chip.icon || 'mdi-label' }}</v-icon
                  >{{ chip.text }}</v-chip
                >
              </v-chip-group>
            </v-row>
          </v-card-text>
          <v-card-actions v-if="adding">
            <!-- 是否公开， 默认否 -->
            <v-switch
              class="ml-3"
              v-model="isPublic"
              inset
              label="公开"
            ></v-switch>
            <v-spacer></v-spacer>
            <v-btn
              class="white--text"
              color="purple accent-4"
              @click="adding = false"
            >
              取消
            </v-btn>
            <v-btn class="white--text" color="teal accent-4" @click="addDiary">
              完成
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="9" xl="7" v-for="diary in diaries" :key="diary.ID">
        <v-card class="mx-auto">
          <v-card-title>
            <p class="text-justify">
              {{ diary.CreatedAt.split('T')[0] }}({{
                getDay(diary.CreatedAt.split('T')[0])
              }})
            </p>
            <v-spacer></v-spacer>
            <v-icon @click="deleteDiary(diary.ID)"
              >mdi-trash-can-outline</v-icon
            >
          </v-card-title>

          <v-card-text>
            <div class="text-justify text-body-1 text--black">
              {{ diary.content }}
            </div>
          </v-card-text>
          <!-- <v-divider class="mt-6 mx-4"></v-divider> -->
          <v-card-actions>
            <v-row class="mx-1" justify="center" align="center">
              <v-chip
                v-for="tag in diary.tags"
                :key="tag.ID"
                class="ma-2"
                :color="tag.color"
                label
                text-color="white"
              >
                <v-icon left>{{ tag.icon || 'mdi-label' }}</v-icon>
                {{ tag.text }}
              </v-chip>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from '../plugins/moment';
import Toast from '../plugins/toast';
import Swal from 'sweetalert2';

export default {
  name: 'Diary',
  data: () => ({
    date: moment().format('YYYY.MM.DD'),
    day: moment().format('dddd'),
    adding: false,
    tags: [],
    content: '',
    isPublic: false,
    chips: [],
    diaries: []
  }),
  methods: {
    getDay(date) {
      return moment(date).format('dddd');
    },
    getTags() {
      this.$axios({
        method: 'get',
        url: `/tags`,
        headers: {
          Authorization: 'Bearer ' + window.localStorage.getItem('r-token')
        }
      })
        .then(res => {
          this.chips = res.data.data;
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: '出错了',
            text: `${err.response.data.error}`
          });
        });
    },
    getDiaryList() {
      this.$axios({
        method: 'get',
        url: `/users/${this.$store.state.user.id}/diaries`,
        headers: {
          Authorization: 'Bearer ' + window.localStorage.getItem('r-token')
        }
      })
        .then(res => {
          this.diaries = res.data.data;
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: '出错了',
            text: `${err.response.data.error}`
          });
        });
    },
    deleteDiary(id) {
      this.$axios({
        method: 'delete',
        url: `/diaries/${id}`,
        headers: {
          Authorization: 'Bearer ' + window.localStorage.getItem('r-token')
        }
      })
        .then(res => {
          if (res.status == 200) {
            Toast.fire({
              icon: 'success',
              title: '删除成功，回忆-1。'
            });
            this.getDiaryList();
          }
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: '出错了',
            text: `${err.response.data.error}`
          });
        });
    },
    addDiary() {
      this.$axios({
        method: 'post',
        url: '/diaries',
        data: {
          tags: this.tags,
          content: this.content,
          invisibility: this.isPublic ? 'public' : 'private',
          user_id: this.$store.state.user.id
        },
        headers: {
          Authorization: 'Bearer ' + window.localStorage.getItem('r-token')
        }
      })
        .then(() => {
          Toast.fire({
            icon: 'success',
            title: '新增成功，回忆+1。'
          });

          this.tags = '';
          this.content = null;
          this.adding = false;
          (this.isPublic = false), (this.selectedChips = []);
          this.getDiaryList();
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: '出错了',
            text: `${err.response.data.error}`
          });
        });
    }
  },
  mounted() {
    this.getDiaryList();
    this.getTags();
  }
};
</script>

<style scoped></style>
